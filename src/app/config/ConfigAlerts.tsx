export function ConfigCatalogUnavailableAlert() {
  return (
    <main className="page">
      <div className="alert error">
        <strong>能力目录尚未探测</strong>
        <p>执行器未响应。确认 runner 容器在运行（docker compose ps），稍后刷新。</p>
      </div>
    </main>
  );
}

export function ConfigLoadErrorAlert({ error }: { error: string }) {
  return (
    <div className="alert error">
      <strong>配置无法加载</strong>
      <pre>{error}</pre>
      <p>请直接修正该文件后刷新；界面不会在配置损坏时覆盖它。</p>
    </div>
  );
}
