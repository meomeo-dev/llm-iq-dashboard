import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { SESSION_COOKIE, verifySession } from "@/core/auth/session";
import { commandHint } from "@/core/command-hint";
import { isReadonly } from "@/core/deploy-mode";
import { PairForm } from "./PairForm";
import "./pair.css";

/** 会话状态每次请求都要重读 */
export const dynamic = "force-dynamic";

interface PageProps {
  /** next=/config：配对成功后回到的页面，只接受站内路径 */
  searchParams: Promise<{ next?: string | string[] }>;
}

export default async function PairPage({ searchParams }: PageProps) {
  if (isReadonly()) notFound();
  const { next } = await searchParams;
  const returnTo = typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/";
  const owner = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);

  return (
    <main className="page pair-page">
      <header className="masthead">
        <div>
          <h1>
            所有者登录
            <Link className="nav-link" href="/">
              ← 看板
            </Link>
          </h1>
          <p className="prompt">
            在运行看板的机器上执行 <code>{commandHint("pnpm pair")}</code>，把打印出的配对码填到下面。
          </p>
        </div>
      </header>
      <PairForm returnTo={returnTo} signedInAs={owner?.deviceName ?? null} />
    </main>
  );
}
