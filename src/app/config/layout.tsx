import "./config.css";
import "./capability.css";

/** 配置页样式在路由层 layout 引入，仅在进入 /config 时加载 */
export default function ConfigLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
