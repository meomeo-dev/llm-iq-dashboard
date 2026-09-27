#!/usr/bin/env python3
"""
analyze_browser_perf.py
Uses Playwright & Chrome DevTools Protocol (CDP) to diagnose:
1. Performance bottleneck when clicking "跑一次" (Run Once) menu:
   - Network time vs DOM layout/render time
   - Heap allocation & DOM node count
2. SSE (/api/events) lifecycle & why "自动任务" reports connection errors.
"""

import asyncio
import json
import subprocess
import time
from playwright.async_api import async_playwright

def get_auth_cookie():
    cmd = ["pnpm", "exec", "tsx", "-e", "import { issueSession } from './src/core/auth/session'; issueSession('cdp-tester').then(r => console.log(r.cookie))"]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return res.stdout.strip()

async def run_diagnosis():
    cookie_val = get_auth_cookie()
    print(f"Issued auth session cookie: {cookie_val[:12]}...")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        
        # Inject owner cookie
        await context.add_cookies([{
            "name": "pelican_owner",
            "value": cookie_val,
            "domain": "localhost",
            "path": "/",
        }])

        page = await context.new_page()

        console_logs = []
        network_logs = []
        failed_requests = []

        page.on("console", lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))
        page.on("pageerror", lambda err: console_logs.append(f"[PAGE_ERROR] {err}"))
        page.on("requestfailed", lambda req: failed_requests.append(f"[FAILED_REQ] {req.method} {req.url}: {req.failure}"))
        
        def on_req(req):
            if "api" in req.url:
                network_logs.append(f"-> REQ: {req.method} {req.url}")
        page.on("request", on_req)

        def on_res(res):
            if "api" in res.url:
                network_logs.append(f"<- RES: {res.status} {res.url}")
        page.on("response", on_res)

        # Connect CDP Session
        client = await context.new_cdp_session(page)
        await client.send("Performance.enable")
        await client.send("Network.enable")
        await client.send("DOM.enable")

        print("\n=== 1. 导航到看板首页 http://localhost:3001 ===")
        t0 = time.time()
        res = await page.goto("http://localhost:3001", wait_until="domcontentloaded")
        nav_time = time.time() - t0
        print(f"首页 DOMContentLoaded 耗时: {nav_time*1000:.1f}ms, 状态码: {res.status if res else 'None'}")

        # 等待页面 hydrate
        await page.wait_for_timeout(2000)

        # 检查自动任务组件状态
        auto_run_el = page.locator(".auto-run")
        if await auto_run_el.count() > 0:
            sub_text = await auto_run_el.locator(".stack-sub").text_content()
            btn_title = await auto_run_el.get_attribute("title")
            print(f"自动任务组件当前状态: sub='{sub_text}', title='{btn_title}'")
        else:
            print("未能找到 .auto-run 组件！")

        # 收集当前性能与内存度量
        metrics_before = await client.send("Performance.getMetrics")
        metrics_dict_before = {m["name"]: m["value"] for m in metrics_before["metrics"]}
        print(f"首屏渲染完成 DOM 节点数: {int(metrics_dict_before.get('Nodes', 0))}")
        print(f"首屏 JS Heap 占用: {metrics_dict_before.get('JSHeapUsedSize', 0) / 1024 / 1024:.2f} MB")

        # 检查“跑一次”按钮
        print("\n=== 2. 测量点击“跑一次”的性能链路 ===")
        run_once_btn = page.locator("button.menu-button", has_text="跑一次")
        if await run_once_btn.count() == 0:
            print("找不到‘跑一次’按钮！")
        else:
            print("找到‘跑一次’按钮，开始 Profile 并触发点击...")
            
            # 开始 CPU Profiler 采样
            await client.send("Profiler.enable")
            await client.send("Profiler.start")

            click_time = time.time()
            api_run_req_time = None
            api_run_res_time = None

            # 监听专门的 /api/run 耗时
            def check_api_run(req):
                nonlocal api_run_req_time
                if "/api/run" in req.url and req.method == "GET":
                    api_run_req_time = time.time()
            page.on("request", check_api_run)

            def check_api_res(res):
                nonlocal api_run_res_time
                if "/api/run" in res.url:
                    api_run_res_time = time.time()
            page.on("response", check_api_res)

            await run_once_btn.click()

            # 等待选项内容完全渲染
            options_body = page.locator(".run-once-body")
            await options_body.wait_for(state="visible", timeout=15000)
            rendered_time = time.time()

            total_click_to_render = rendered_time - click_time
            api_network_time = (api_run_res_time - api_run_req_time) if (api_run_res_time and api_run_req_time) else None
            render_after_api = (rendered_time - api_run_res_time) if api_run_res_time else None

            print(f"\n【耗时拆解测量结果】:")
            print(f"- 从点击按钮到选项渲染可见总耗时: {total_click_to_render*1000:.1f}ms ({total_click_to_render:.2f} 秒)")
            if api_network_time is not None:
                print(f"- 其中 GET /api/run 网络往返耗时: {api_network_time*1000:.1f}ms")
            if render_after_api is not None:
                print(f"- 其中 API 数据到达后，前端计算与 DOM 渲染耗时: {render_after_api*1000:.1f}ms")

            # 停止 Profiler
            profile = await client.send("Profiler.stop")
            
            # 分析 Profiler 中耗时最高的前 5 个调用
            nodes = profile.get("profile", {}).get("nodes", [])
            samples = profile.get("profile", {}).get("samples", [])
            time_deltas = profile.get("profile", {}).get("timeDeltas", [])
            
            node_times = {}
            for sample, dt in zip(samples, time_deltas):
                node_times[sample] = node_times.get(sample, 0) + dt
            
            top_nodes = sorted(node_times.items(), key=lambda x: x[1], reverse=True)[:10]
            print("\n【JS Profiler 热点函数 Top 10】:")
            node_map = {n["id"]: n for n in nodes}
            for nid, t_us in top_nodes:
                n = node_map.get(nid, {})
                cf = n.get("callFrame", {})
                fn = cf.get("functionName") or "(anonymous)"
                url = cf.get("url") or ""
                url_short = url.split("/")[-1] if url else ""
                line = cf.get("lineNumber", 0)
                print(f"  - {fn} ({url_short}:{line}): {t_us/1000:.1f}ms")

            # DOM 分析
            metrics_after = await client.send("Performance.getMetrics")
            metrics_dict_after = {m["name"]: m["value"] for m in metrics_after["metrics"]}
            print(f"\n【DOM 与内存指标】:")
            print(f"- 打开前 DOM 节点数: {int(metrics_dict_before.get('Nodes', 0))}")
            print(f"- 打开后 DOM 节点数: {int(metrics_dict_after.get('Nodes', 0))} (新增 {int(metrics_dict_after.get('Nodes', 0) - metrics_dict_before.get('Nodes', 0))})")
            print(f"- 打开前 JS 堆大小: {metrics_dict_before.get('JSHeapUsedSize', 0) / 1024 / 1024:.2f} MB")
            print(f"- 打开后 JS 堆大小: {metrics_dict_after.get('JSHeapUsedSize', 0) / 1024 / 1024:.2f} MB")

            prompt_items = await page.locator(".run-once-prompt-item").count()
            select_items = await page.locator(".candidate-picker-select").count()
            options_count = await page.locator(".candidate-picker-select option").count()
            print(f"- 题目组件项数: {prompt_items}")
            print(f"- 渲染的下拉框数: {select_items}")
            print(f"- 渲染的下拉选项总数 (<option>): {options_count}")

        print("\n=== 3. 观察 SSE (/api/events) 是否发生断连与重连 ===")
        await page.wait_for_timeout(3000)
        auto_run_text = await page.locator(".auto-run .stack-sub").text_content()
        print(f"当前自动任务文本: '{auto_run_text}'")

        print("\n=== 4. 相关 API 网络请求日志 ===")
        for nl in network_logs:
            print(" ", nl)

        if failed_requests:
            print("\n=== 5. 失败请求 ===")
            for fr in failed_requests:
                print(" ", fr)

        print("\n=== 6. 控制台日志 ===")
        for cl in console_logs[-15:]:
            print(" ", cl)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run_diagnosis())
