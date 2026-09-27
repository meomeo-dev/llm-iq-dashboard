/**
 * 串行写入队列：各道并行完成的写入串成一条链，后一次写入在前一次完成后才开始，
 * 旧快照不会覆盖新快照。任务以函数入队，可在轮到时再取快照。
 */

export interface SerialWriter {
  /** 排队一次写入；失败只记日志，缺一次中途快照不影响终稿 */
  enqueue: (task: () => Promise<void>) => void;
  /** 等排队中的写入全部完成 */
  drain: () => Promise<void>;
}

export function createSerialWriter(log: (message: string) => void): SerialWriter {
  let chain = Promise.resolve();
  return {
    enqueue(task) {
      chain = chain
        .then(task)
        .catch((cause: unknown) => log(`落盘失败：${cause instanceof Error ? cause.message : cause}`));
    },
    drain: () => chain,
  };
}
