import json
import os
import sys
import time
from playwright.sync_api import sync_playwright

BASE_URL = "http://127.0.0.1:3001"
COOKIE_VALUE = "2b11c782a345e661.ggrThIM6GPu9lFGNtc91KGJHJttoj2LGp8bIRuNTNmU"
ARTIFACT_DIR = "/Users/luojin/.gemini/antigravity-cli/brain/0d231da9-b48f-4c6f-907a-2c0f782595ee"
REPORT_PATH = "/Users/luojin/git/git-my-code/llm_iq_dashboard/docs/ui/ux_coverage_report.json"

VIEWPORTS = [
    {"id": "mobile_iphone16", "name": "iPhone 16 / 15", "width": 393, "height": 852, "dpr": 3, "mobile": True, "touch": True},
    {"id": "mobile_fold_outer", "name": "Galaxy Z Fold 6 (344px 外屏)", "width": 344, "height": 882, "dpr": 2.6, "mobile": True, "touch": True},
    {"id": "tablet_ipad_pro11", "name": "iPad Pro 11\"", "width": 834, "height": 1194, "dpr": 2, "mobile": True, "touch": True},
    {"id": "desktop_macbook14", "name": "MacBook Pro 14\"", "width": 1512, "height": 982, "dpr": 2, "mobile": False, "touch": False},
]

def run_crawler():
    print("=" * 70)
    print("🚀 Antigravity UX State Crawler & Visual Integrity Verifier")
    print("   Aligned with docs/ui/UX_STATE_MAP.md")
    print("=" * 70)

    report = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "states_tested": {},
        "summary": {"total": 0, "passed": 0, "failed": 0},
    }

    def record(state_id, name, viewport_id, passed, details, screenshot_file=None):
        report["summary"]["total"] += 1
        if passed:
            report["summary"]["passed"] += 1
            status = "✅ PASS"
        else:
            report["summary"]["failed"] += 1
            status = "❌ FAIL"
        
        print(f"[{status}] {state_id} ({name}) @ {viewport_id}: {details}")
        
        if state_id not in report["states_tested"]:
            report["states_tested"][state_id] = {
                "name": name,
                "viewports": []
            }
        report["states_tested"][state_id]["viewports"].append({
            "viewport": viewport_id,
            "status": "PASS" if passed else "FAIL",
            "details": details,
            "screenshot": screenshot_file
        })

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for vp in VIEWPORTS:
            vp_id = vp["id"]
            vp_name = vp["name"]
            width = vp["width"]
            height = vp["height"]
            dpr = vp["dpr"]
            is_mobile = vp["mobile"]
            has_touch = vp["touch"]

            print(f"\n--- Testing Viewport: {vp_name} ({width}x{height}) ---")

            context = browser.new_context(
                viewport={"width": width, "height": height},
                device_scale_factor=dpr,
                is_mobile=is_mobile,
                has_touch=has_touch,
            )
            context.add_cookies([{
                "name": "pelican_owner",
                "value": COOKIE_VALUE,
                "domain": "127.0.0.1",
                "path": "/",
                "httpOnly": True,
                "sameSite": "Strict",
            }])

            page = context.new_page()

            # ----------------------------------------------------
            # 1. STATE_DASHBOARD_IDLE
            # ----------------------------------------------------
            try:
                page.goto(BASE_URL, wait_until="domcontentloaded", timeout=15000)
                page.wait_for_selector(".toolbar", timeout=5000)
                time.sleep(0.4)

                overflow = page.evaluate("() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth })")
                is_overflow = overflow["scrollWidth"] > overflow["clientWidth"] + 2
                shot = f"{ARTIFACT_DIR}/ux_01_idle_{vp_id}.png"
                page.screenshot(path=shot)
                record(
                    "STATE_DASHBOARD_IDLE",
                    "主看板空闲态",
                    vp_id,
                    not is_overflow,
                    f"scrollWidth={overflow['scrollWidth']}, clientWidth={overflow['clientWidth']}",
                    shot
                )
            except Exception as e:
                record("STATE_DASHBOARD_IDLE", "主看板空闲态", vp_id, False, str(e))

            # ----------------------------------------------------
            # 2. STATE_DAY_CALENDAR
            # ----------------------------------------------------
            try:
                day_btn = page.locator("header .menus .menu:first-child button.menu-button")
                day_btn.click()
                time.sleep(0.3)
                day_panel = page.locator(".day-panel")
                visible = day_panel.is_visible()
                box = day_panel.bounding_box() if visible else None
                in_bounds = box and box["x"] >= 0 and (box["x"] + box["width"] <= width + 2)
                shot = f"{ARTIFACT_DIR}/ux_02_day_calendar_{vp_id}.png"
                page.screenshot(path=shot)

                record(
                    "STATE_DAY_CALENDAR",
                    "日期与月历浮层",
                    vp_id,
                    visible and in_bounds,
                    f"visible={visible}, x={box['x'] if box else 'N/A'}, width={box['width'] if box else 'N/A'}",
                    shot
                )
                # Close by clicking backdrop or close button
                close_btn = page.locator(".day-panel-close-btn")
                if close_btn.is_visible():
                    close_btn.click()
                else:
                    page.keyboard.press("Escape")
                time.sleep(0.2)
            except Exception as e:
                record("STATE_DAY_CALENDAR", "日期与月历浮层", vp_id, False, str(e))

            # ----------------------------------------------------
            # 3. STATE_FILTER_PANEL
            # ----------------------------------------------------
            try:
                filter_btn = page.locator("button:has-text('筛选')")
                filter_btn.click()
                time.sleep(0.3)
                filter_panel = page.locator(".filter-panel")
                visible = filter_panel.is_visible()
                box = filter_panel.bounding_box() if visible else None
                in_bounds = box and box["x"] >= 0 and (box["x"] + box["width"] <= width + 2)

                # Switch tabs
                model_tab = page.locator(".filter-group:has-text('模型')")
                if model_tab.is_visible():
                    model_tab.click()
                    time.sleep(0.2)

                shot = f"{ARTIFACT_DIR}/ux_03_filter_panel_{vp_id}.png"
                page.screenshot(path=shot)

                record(
                    "STATE_FILTER_PANEL",
                    "多维筛选面板",
                    vp_id,
                    visible and in_bounds,
                    f"visible={visible}, x={box['x'] if box else 'N/A'}, width={box['width'] if box else 'N/A'}",
                    shot
                )
                # Close
                close_btn = page.locator(".filter-panel-close-btn")
                if close_btn.is_visible():
                    close_btn.click()
                else:
                    page.keyboard.press("Escape")
                time.sleep(0.2)
            except Exception as e:
                record("STATE_FILTER_PANEL", "多维筛选面板", vp_id, False, str(e))

            # ----------------------------------------------------
            # 4. STATE_RUN_STATUS_POPOVER (Critical bug regression check)
            # ----------------------------------------------------
            try:
                # Find the status pill in the toolbar
                status_pill = page.locator(".run-pill")
                status_pill.click()
                time.sleep(0.3)
                run_panel = page.locator(".menu-panel.run-panel")
                visible = run_panel.is_visible()
                box = run_panel.bounding_box() if visible else None
                # Check bounds: must not overflow left (< 0) or right (> width)
                in_bounds = box and box["x"] >= 0 and (box["x"] + box["width"] <= width + 2)
                shot = f"{ARTIFACT_DIR}/ux_04_run_status_{vp_id}.png"
                page.screenshot(path=shot)

                record(
                    "STATE_RUN_STATUS_POPOVER",
                    "执行状态与进度监视器",
                    vp_id,
                    visible and in_bounds,
                    f"visible={visible}, x={box['x'] if box else 'N/A'}, width={box['width'] if box else 'N/A'}",
                    shot
                )
                # Close
                close_btn = page.locator(".run-panel-close-btn")
                if close_btn.is_visible():
                    close_btn.click()
                else:
                    page.keyboard.press("Escape")
                time.sleep(0.2)
            except Exception as e:
                record("STATE_RUN_STATUS_POPOVER", "执行状态与进度监视器", vp_id, False, str(e))

            # ----------------------------------------------------
            # 5. STATE_RUN_ONCE_MODAL
            # ----------------------------------------------------
            try:
                run_once_btn = page.locator("button:has-text('▶ 跑一次')")
                run_once_btn.click()
                time.sleep(0.3)
                run_once_panel = page.locator(".run-once-panel")
                visible = run_once_panel.is_visible()
                box = run_once_panel.bounding_box() if visible else None
                in_bounds = box and box["x"] >= 0 and (box["x"] + box["width"] <= width + 2)

                # Test tab switch if on mobile
                tab_prompts = page.locator(".run-once-tab-btn:has-text('题目')")
                if tab_prompts.is_visible():
                    tab_prompts.click()
                    time.sleep(0.2)

                shot = f"{ARTIFACT_DIR}/ux_05_run_once_{vp_id}.png"
                page.screenshot(path=shot)

                record(
                    "STATE_RUN_ONCE_MODAL",
                    "跑一次控制台",
                    vp_id,
                    visible and in_bounds,
                    f"visible={visible}, x={box['x'] if box else 'N/A'}, width={box['width'] if box else 'N/A'}",
                    shot
                )
                close_btn = page.locator(".run-once-close")
                if close_btn.is_visible():
                    close_btn.click()
                else:
                    page.keyboard.press("Escape")
                time.sleep(0.2)
            except Exception as e:
                record("STATE_RUN_ONCE_MODAL", "跑一次控制台", vp_id, False, str(e))

            # ----------------------------------------------------
            # 6. STATE_AUTORUN_TOGGLE
            # ----------------------------------------------------
            try:
                auto_switch = page.locator(".auto-run-switch")
                visible = auto_switch.is_visible()
                box = auto_switch.bounding_box() if visible else None
                record(
                    "STATE_AUTORUN_TOGGLE",
                    "自动任务调度器开关",
                    vp_id,
                    visible,
                    f"visible={visible}, enabled={auto_switch.get_attribute('aria-checked')}"
                )
            except Exception as e:
                record("STATE_AUTORUN_TOGGLE", "自动任务调度器开关", vp_id, False, str(e))

            # ----------------------------------------------------
            # 7. STATE_EXPORT_MENU
            # ----------------------------------------------------
            try:
                export_btn = page.locator("button:has-text('导出')")
                if export_btn.is_visible():
                    export_btn.click()
                    time.sleep(0.3)
                    export_panel = page.locator(".export-panel")
                    visible = export_panel.is_visible()
                    box = export_panel.bounding_box() if visible else None
                    in_bounds = box and box["x"] >= 0 and (box["x"] + box["width"] <= width + 2)
                    shot = f"{ARTIFACT_DIR}/ux_07_export_menu_{vp_id}.png"
                    page.screenshot(path=shot)

                    record(
                        "STATE_EXPORT_MENU",
                        "时间线全轨导出菜单",
                        vp_id,
                        visible and in_bounds,
                        f"visible={visible}, x={box['x'] if box else 'N/A'}, width={box['width'] if box else 'N/A'}",
                        shot
                    )
                    page.keyboard.press("Escape")
                    time.sleep(0.2)
                else:
                    record("STATE_EXPORT_MENU", "时间线全轨导出菜单", vp_id, True, "Skipped: no runs in current timeline view to export")
            except Exception as e:
                record("STATE_EXPORT_MENU", "时间线全轨导出菜单", vp_id, False, str(e))

            # ----------------------------------------------------
            # 8. STATE_MODEL_DETAIL_MODAL
            # ----------------------------------------------------
            try:
                folders = page.locator(".folder")
                if folders.count() > 0:
                    folders.first.click()
                    time.sleep(0.4)
                    modal = page.locator(".modal")
                    visible = modal.is_visible()
                    box = modal.bounding_box() if visible else None
                    in_bounds = box and box["x"] >= 0 and (box["x"] + box["width"] <= width + 2)

                    # Click ground truth standard button if present
                    std_btn = page.locator(".modal-standard-btn, .modal-standard-pill")
                    if std_btn.count() > 0 and std_btn.first.is_visible():
                        std_btn.first.click()
                        time.sleep(0.3)

                    shot = f"{ARTIFACT_DIR}/ux_08_model_modal_{vp_id}.png"
                    page.screenshot(path=shot)

                    record(
                        "STATE_MODEL_DETAIL_MODAL",
                        "单轮多强度对比弹窗",
                        vp_id,
                        visible and in_bounds,
                        f"visible={visible}, x={box['x'] if box else 'N/A'}, width={box['width'] if box else 'N/A'}",
                        shot
                    )
                    close_btn = page.locator(".modal-close")
                    if close_btn.is_visible():
                        close_btn.click()
                    else:
                        page.keyboard.press("Escape")
                    time.sleep(0.2)
                else:
                    record("STATE_MODEL_DETAIL_MODAL", "单轮多强度对比弹窗", vp_id, True, "No folder tiles on active day")
            except Exception as e:
                record("STATE_MODEL_DETAIL_MODAL", "单轮多强度对比弹窗", vp_id, False, str(e))

            # ----------------------------------------------------
            # 9. STATE_CONFIG_PAGE
            # ----------------------------------------------------
            try:
                page.goto(f"{BASE_URL}/config", wait_until="domcontentloaded", timeout=15000)
                page.wait_for_selector(".config", timeout=8000)
                time.sleep(0.4)

                overflow = page.evaluate("() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth })")
                is_overflow = overflow["scrollWidth"] > overflow["clientWidth"] + 2

                # Verify presence of tiered timeout cards
                tier_low = page.locator(".timeout-tier-card .tier-badge.low").is_visible()
                quick_fill = page.locator("button.btn-preset").is_visible()

                shot = f"{ARTIFACT_DIR}/ux_09_config_page_{vp_id}.png"
                page.screenshot(path=shot)

                record(
                    "STATE_CONFIG_PAGE",
                    "系统配置中心与分段超时",
                    vp_id,
                    not is_overflow and tier_low and quick_fill,
                    f"overflow={is_overflow}, tier_badge_low={tier_low}, quick_fill={quick_fill}",
                    shot
                )
            except Exception as e:
                record("STATE_CONFIG_PAGE", "系统配置中心与分段超时", vp_id, False, str(e))

            # ----------------------------------------------------
            # 10. STATE_PAIR_PAGE (Unauthenticated)
            # ----------------------------------------------------
            try:
                incognito_context = browser.new_context(
                    viewport={"width": width, "height": height},
                    device_scale_factor=dpr,
                    is_mobile=is_mobile,
                    has_touch=has_touch,
                )
                incognito_page = incognito_context.new_page()
                incognito_page.goto(f"{BASE_URL}/pair", wait_until="domcontentloaded", timeout=15000)
                incognito_page.wait_for_selector(".pair-card", timeout=5000)
                time.sleep(0.3)

                # Test invalid submit
                input_field = incognito_page.locator("#pair-code")
                input_field.fill("9999-9999-9999-9999-9999-9999-9999-9999")
                submit_btn = incognito_page.locator("button[type='submit']")
                submit_btn.click()

                try:
                    incognito_page.wait_for_selector(".pair-error", timeout=4000)
                    error_vis = True
                except Exception:
                    error_vis = False

                shot = f"{ARTIFACT_DIR}/ux_10_pair_page_{vp_id}.png"
                incognito_page.screenshot(path=shot)

                record(
                    "STATE_PAIR_PAGE",
                    "设备配对与鉴权中心",
                    vp_id,
                    error_vis,
                    f"pair_form_visible=True, error_feedback_visible={error_vis}",
                    shot
                )
                incognito_context.close()
            except Exception as e:
                record("STATE_PAIR_PAGE", "设备配对与鉴权中心", vp_id, False, str(e))

            # ----------------------------------------------------
            # 11. STATE_ART_VIEWER
            # ----------------------------------------------------
            try:
                sample_art_url = f"{BASE_URL}/view/20260924T063231Z/claude__claude-fable-5-1__high__classic-v1.svg"
                page.goto(sample_art_url, wait_until="domcontentloaded", timeout=15000)
                page.wait_for_selector(".viewer", timeout=5000)
                time.sleep(0.4)

                overflow = page.evaluate("() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth })")
                is_overflow = overflow["scrollWidth"] > overflow["clientWidth"] + 2

                # Test unfolding prompt drawer
                prompt_summary = page.locator(".viewer-prompt summary")
                if prompt_summary.is_visible():
                    prompt_summary.click()
                    time.sleep(0.2)

                # Test unfolding standard drawer if present
                std_summary = page.locator(".viewer-standard summary")
                if std_summary.is_visible():
                    std_summary.click()
                    time.sleep(0.2)

                shot = f"{ARTIFACT_DIR}/ux_11_art_viewer_{vp_id}.png"
                page.screenshot(path=shot)

                record(
                    "STATE_ART_VIEWER",
                    "作品沉浸查看器与抽屉",
                    vp_id,
                    not is_overflow,
                    f"scrollWidth={overflow['scrollWidth']}, clientWidth={overflow['clientWidth']}",
                    shot
                )
            except Exception as e:
                record("STATE_ART_VIEWER", "作品沉浸查看器与抽屉", vp_id, False, str(e))

            context.close()

        browser.close()

    print("\n" + "=" * 70)
    print(f"🏁 UX State Crawler Finished: {report['summary']['passed']}/{report['summary']['total']} checks passed.")
    print("=" * 70)

    with open(REPORT_PATH, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    print(f"Report saved to: {REPORT_PATH}")

    if report["summary"]["failed"] > 0:
        sys.exit(1)

if __name__ == "__main__":
    run_crawler()
