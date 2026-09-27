/**
 * 展台冒烟测试断言清单与执行器。
 */

import assert from "node:assert/strict";

export interface AssertionStep {
  name: string;
  run: () => Promise<void>;
}

/** 断言首页可访问且包含夹具中的模型名 */
export async function assertHomePage(baseUrl: string): Promise<void> {
  const res = await fetch(`${baseUrl}/`);
  assert.equal(res.status, 200, `首页应当返回 200，实际: ${res.status}`);
  const text = await res.text();
  assert.ok(
    text.includes("model-b") || text.includes("model-a"),
    "首页内容应包含夹具中的模型名 (model-b 或 model-a)",
  );
}

/** 断言健康检查接口正常返回只读远程状态 */
export async function assertHealthApi(baseUrl: string): Promise<void> {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200, `健康检查应返回 200，实际: ${res.status}`);
  const json = await res.json();
  assert.equal(json.mode.readonly, true, "mode.readonly 应为 true");
  assert.equal(json.mode.dataSource, "remote", "mode.dataSource 应为 remote");
  assert.ok(json.dataRepo, "dataRepo 字段不应为空");
  assert.equal(json.dataRepo.reachable, true, "dataRepo.reachable 应为 true");
}

/** 断言已登记作品正常返回并附带 CSP sandbox */
export async function assertArtRegistered(baseUrl: string): Promise<void> {
  const res = await fetch(
    `${baseUrl}/art/20260927T021708Z/claude__model-b__high.svg`,
  );
  assert.equal(res.status, 200, `作品应返回 200，实际: ${res.status}`);
  const csp = res.headers.get("content-security-policy") ?? "";
  assert.ok(csp.includes("sandbox"), `CSP 应包含 sandbox，实际: ${csp}`);
  const contentType = res.headers.get("content-type") ?? "";
  assert.ok(
    contentType.includes("image/svg+xml"),
    `Content-Type 应为 SVG，实际: ${contentType}`,
  );
  const body = await res.text();
  assert.ok(body.includes("<svg"), "作品主体应为有效 SVG 标签");
}

/** 断言未登记作品返回 404 */
export async function assertArtUnregistered(baseUrl: string): Promise<void> {
  const res = await fetch(`${baseUrl}/art/20260927T021708Z/unregistered.svg`);
  assert.equal(res.status, 404, `未登记作品应返回 404，实际: ${res.status}`);
}

/** 断言只读模式拦截评测写请求 */
export async function assertBlockedRunPost(baseUrl: string): Promise<void> {
  const res = await fetch(`${baseUrl}/api/run`, {
    method: "POST",
    headers: { "x-pelican-action": "1" },
    body: JSON.stringify({}),
  });
  assert.equal(res.status, 403, `只读模式应拦截写请求为 403，实际: ${res.status}`);
}

/** 断言只读远程模式下 GET /api/data-repo 阻断为 403 */
export async function assertBlockedDataRepoGet(baseUrl: string): Promise<void> {
  const res = await fetch(`${baseUrl}/api/data-repo`);
  assert.equal(res.status, 403, `只读模式应拦截 GET /api/data-repo 为 403，实际: ${res.status}`);
}

/** 断言只读远程模式下 POST /api/data-repo/sync 阻断为 403 */
export async function assertBlockedDataRepoSyncPost(baseUrl: string): Promise<void> {
  const res = await fetch(`${baseUrl}/api/data-repo/sync`, {
    method: "POST",
    headers: { "x-pelican-action": "1" },
    body: JSON.stringify({ mode: "dry-run" }),
  });
  assert.equal(res.status, 403, `只读模式应拦截 POST /api/data-repo/sync 为 403，实际: ${res.status}`);
}

/** 断言只读远程模式下 GET /api/data-repo/github/connect 阻断为 403 */
export async function assertBlockedGithubConnectGet(baseUrl: string): Promise<void> {
  const res = await fetch(`${baseUrl}/api/data-repo/github/connect`);
  assert.equal(res.status, 403, `只读模式应拦截 GET /api/data-repo/github/connect 为 403，实际: ${res.status}`);
}

/** 断言只读远程模式下 GET /api/data-repo/github/app-created 阻断为 403 */
export async function assertBlockedGithubAppCreatedGet(baseUrl: string): Promise<void> {
  const res = await fetch(`${baseUrl}/api/data-repo/github/app-created`);
  assert.equal(res.status, 403, `只读模式应拦截 GET /api/data-repo/github/app-created 为 403，实际: ${res.status}`);
}

/** 断言只读远程模式下 GET /api/data-repo/github/callback 阻断为 403 */
export async function assertBlockedGithubCallbackGet(baseUrl: string): Promise<void> {
  const res = await fetch(`${baseUrl}/api/data-repo/github/callback`);
  assert.equal(res.status, 403, `只读模式应拦截 GET /api/data-repo/github/callback 为 403，实际: ${res.status}`);
}

/** 断言只读远程模式下 POST /api/data-repo/github/disconnect 阻断为 403 */
export async function assertBlockedGithubDisconnectPost(baseUrl: string): Promise<void> {
  const res = await fetch(`${baseUrl}/api/data-repo/github/disconnect`, {
    method: "POST",
    headers: { "x-pelican-action": "1" },
  });
  assert.equal(res.status, 403, `只读模式应拦截 POST /api/data-repo/github/disconnect 为 403，实际: ${res.status}`);
}

/** 断言配对页面入口返回 404 */
export async function assertPairPage404(baseUrl: string): Promise<void> {
  const res = await fetch(`${baseUrl}/pair`);
  assert.equal(res.status, 404, `/pair 应返回 404，实际: ${res.status}`);
}

/** 断言配置页面重定向至根路径 */
export async function assertConfigPageRedirect(baseUrl: string): Promise<void> {
  const res = await fetch(`${baseUrl}/config`, { redirect: "manual" });
  assert.ok(
    res.status === 307 || res.status === 308 || res.status === 302,
    `配置页应重定向，实际状态码: ${res.status}`,
  );
  const location = res.headers.get("location") ?? "";
  assert.ok(
    location === "/" || location.endsWith("/"),
    `Location 应重定向到 /，实际: ${location}`,
  );
}

function buildDataRepoBlockedSteps(baseUrl: string): AssertionStep[] {
  return [
    {
      name: "数据仓状态接口阻断 GET /api/data-repo (返回 403 Forbidden)",
      run: () => assertBlockedDataRepoGet(baseUrl),
    },
    {
      name: "数据仓同步动作阻断 POST /api/data-repo/sync (返回 403 Forbidden)",
      run: () => assertBlockedDataRepoSyncPost(baseUrl),
    },
    {
      name: "GitHub 连接路由阻断 GET /api/data-repo/github/connect (返回 403 Forbidden)",
      run: () => assertBlockedGithubConnectGet(baseUrl),
    },
    {
      name: "GitHub 应用创建回跳阻断 GET /api/data-repo/github/app-created (返回 403 Forbidden)",
      run: () => assertBlockedGithubAppCreatedGet(baseUrl),
    },
    {
      name: "GitHub 授权回调阻断 GET /api/data-repo/github/callback (返回 403 Forbidden)",
      run: () => assertBlockedGithubCallbackGet(baseUrl),
    },
    {
      name: "GitHub 断开连接阻断 POST /api/data-repo/github/disconnect (返回 403 Forbidden)",
      run: () => assertBlockedGithubDisconnectPost(baseUrl),
    },
  ];
}

/** 构建冒烟测试断言步骤列表 */
export function buildAssertionSteps(baseUrl: string): AssertionStep[] {
  return [
    {
      name: "首页 GET / (200 且含夹具模型名 model-b)",
      run: () => assertHomePage(baseUrl),
    },
    {
      name: "健康检查 GET /api/health (200 且 dataRepo.reachable=true)",
      run: () => assertHealthApi(baseUrl),
    },
    {
      name: "已登记作品 GET /art (200 且带 sandbox CSP)",
      run: () => assertArtRegistered(baseUrl),
    },
    {
      name: "未登记作品 GET /art (返回 404)",
      run: () => assertArtUnregistered(baseUrl),
    },
    {
      name: "写操作阻断 POST /api/run (返回 403 Forbidden)",
      run: () => assertBlockedRunPost(baseUrl),
    },
    ...buildDataRepoBlockedSteps(baseUrl),
    {
      name: "所有者配对页面入口 GET /pair (返回 404 Not Found)",
      run: () => assertPairPage404(baseUrl),
    },
    {
      name: "配置页面重定向 GET /config (307 重定向至 /)",
      run: () => assertConfigPageRedirect(baseUrl),
    },
  ];
}

/** 执行全部冒烟测试断言并打印结果 */
export async function runAllAssertions(baseUrl: string): Promise<void> {
  const steps = buildAssertionSteps(baseUrl);
  for (const step of steps) {
    await step.run();
    console.log(`  ✔ ${step.name}`);
  }
}
