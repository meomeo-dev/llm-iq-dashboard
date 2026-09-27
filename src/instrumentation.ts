/**
 * 看板服务启动钩子（Next.js instrumentation）：自动任务开启而调度器不在时拉起调度器。
 * 只在 Node 运行时执行；失败只记日志，不影响看板启动。
 */

export async function register(): Promise<void> {
  // 用条件块而非提前 return：Edge 构建只剔除整块死分支，否则 node:child_process
  // 会被打进 Edge 包，开发模式下整站编译失败
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const { launchSchedulerIfNeeded } = await import("./core/scheduler-launcher");
      const pid = await launchSchedulerIfNeeded();
      if (pid !== null) console.log(`自动任务已开启而调度器不在，已拉起调度器（pid ${pid}）`);
    } catch (cause) {
      console.error(`启动时检查调度器失败：${cause instanceof Error ? cause.message : cause}`);
    }
  }
}
