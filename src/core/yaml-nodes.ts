/**
 * 在既有 YAML 语法树上做保留注释的结构性修改。yaml 库把键上方的注释存为该键的
 * commentBefore，直接删键或整体替换数组会连带丢失注释。
 */

import { isMap, isScalar, isSeq, type Document, type Pair, type YAMLMap } from "yaml";

/**
 * 删除映射里的一个键，并把它上方的注释移交给下一个键；
 * 这类注释常描述整个区块（如 cron 上方的调度说明）。
 */
export function deleteKeyKeepingComment(
  doc: Document,
  mapPath: readonly string[],
  key: string,
): void {
  const map = doc.getIn(mapPath, true);
  if (!isMap(map)) return;

  const index = map.items.findIndex((pair) => keyName(pair) === key);
  if (index === -1) return;

  const removed = map.items[index] as Pair;
  const comment = commentOf(removed);
  map.items.splice(index, 1);

  if (comment === null) return;
  const successor = map.items[index];
  if (successor !== undefined && isScalar(successor.key)) {
    const existing = successor.key.commentBefore;
    successor.key.commentBefore = existing ? `${comment}\n${existing}` : comment;
  }
}

export interface ReconcileOptions {
  /** 身份键，允许重复：同一身份的多项按出现顺序一一对应 */
  identityOf: (item: Record<string, unknown>) => string;
  /** 调用方不可见、须原样保留的原有项（如 `enabled: false` 的目标），追加在末尾 */
  retain?: (item: Record<string, unknown>) => boolean;
  /**
   * 由调用方全权管理的键，新对象里缺失即从节点删除。
   * 其余键不删，以保留界面不编辑的手写字段（如目标的 timeoutMs）。
   */
  managedKeys?: readonly string[];
}

/**
 * 按身份对齐重建映射数组：同身份项复用原节点及其注释并只更新变动字段，
 * 新项新建节点，消失的项连同注释移除。按下标对齐会在删除中间项后让注释错位。
 */
export function reconcileSequence(
  doc: Document,
  path: readonly string[],
  next: readonly Record<string, unknown>[],
  options: ReconcileOptions,
): void {
  const seq = doc.getIn(path, true);
  if (!isSeq(seq)) {
    doc.setIn(path, next);
    return;
  }

  // 身份 → 待认领的原节点队列；retain 项不入队，以免被同身份的新项认领
  const pool = new Map<string, YAMLMap[]>();
  const retained: YAMLMap[] = [];
  for (const node of seq.items) {
    if (!isMap(node)) continue;
    const json = node.toJSON() as Record<string, unknown>;
    if (options.retain?.(json) === true) {
      retained.push(node);
      continue;
    }
    const id = options.identityOf(json);
    pool.set(id, [...(pool.get(id) ?? []), node]);
  }

  const managed = options.managedKeys ?? [];
  const rebuilt = next.map((item) => {
    const reused = pool.get(options.identityOf(item))?.shift();
    if (reused === undefined) return doc.createNode(item);
    syncFields(doc, reused, item, managed);
    return reused;
  });

  seq.items = [...rebuilt, ...retained];
}

/**
 * 让节点字段与目标对象一致。值未变的字段不重建，以保留行尾注释；
 * 只删除 managedKeys 中且目标对象已没有的键。
 */
function syncFields(
  doc: Document,
  node: YAMLMap,
  item: Record<string, unknown>,
  managedKeys: readonly string[],
): void {
  for (const [key, value] of Object.entries(item)) {
    const current = node.get(key, true);
    const currentJson = current === undefined ? undefined : toJson(current);
    if (JSON.stringify(currentJson) === JSON.stringify(value)) continue;
    node.set(key, doc.createNode(value));
  }
  for (const key of managedKeys) {
    if (!(key in item)) node.delete(key);
  }
}

function toJson(node: unknown): unknown {
  if (node !== null && typeof node === "object" && "toJSON" in node) {
    return (node as { toJSON(): unknown }).toJSON();
  }
  return node;
}

function keyName(pair: Pair): string | null {
  return isScalar(pair.key) ? String(pair.key.value) : null;
}

function commentOf(pair: Pair): string | null {
  return isScalar(pair.key) && pair.key.commentBefore ? pair.key.commentBefore : null;
}
