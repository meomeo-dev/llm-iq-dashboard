import Link from "next/link";

export function ConfigPageHeader({ path }: { path: string }) {
  return (
    <header className="masthead">
      <div>
        <h1>
          基准配置
          <Link className="nav-link" href="/">
            ← 看板
          </Link>
        </h1>
        <p className="prompt">{path}</p>
      </div>
    </header>
  );
}
