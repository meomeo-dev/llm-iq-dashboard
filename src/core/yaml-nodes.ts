/**
 * 在既有 YAML 语法树上做保留注释的结构性修改。yaml 库把键上方的注释存为该键的
 * commentBefore，直接删键或整体替换数组会连带丢失注释。
 */

import { isMap, isScalar, isSeq, type Document, type Pair, type YAMLMap, type YAMLSeq } from "yaml";

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
  /**
   * 宽松身份（如目标去掉强度后的 cli::model），只在精确身份认领完之后使用：
   * 某宽松身份下恰好剩一个原节点、也恰好剩一个新项时，视为同一项改了字段，
   * 复用原节点以保留注释。多对多时无法判断谁对应谁，一律新建，不猜。
   */
  looseIdentityOf?: (item: Record<string, unknown>) => string;
  /**
   * 由调用方全权管理的键，新对象里缺失即从节点删除。
   * 其余键不删，以保留界面不编辑的手写字段（如目标的 timeoutMs）；
   * 因此认领必须准确，认错节点会把别项的手写字段带过来。
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

  const nodes = seq.items.filter((node): node is YAMLMap => isMap(node));
  detachFirstItemComment(seq, nodes[0]);
  const claimed = claimExact(nodes, next, options.identityOf);
  if (options.looseIdentityOf !== undefined) {
    claimUnambiguousLoose(nodes, next, claimed, options.looseIdentityOf);
  }

  const managed = options.managedKeys ?? [];
  seq.items = next.map((item, index) => {
    const reused = claimed[index];
    if (reused === undefined) return doc.createNode(item);
    syncFields(doc, reused, item, managed);
    return reused;
  });
  clearHeadSpacing(seq);
}

/**
 * yaml 把第一项上方的注释整段挂在数组节点上，删掉或挪走第一项时注释会留在原处、
 * 张冠李戴。紧贴第一项的那一段（最后一个空行之后）是这一项自己的注释，移到该项上
 * 随它走；更上面、隔着空行的段落描述整个数组，留在数组上。
 */
function detachFirstItemComment(seq: YAMLSeq, first: YAMLMap | undefined): void {
  const comment = seq.commentBefore;
  if (!comment || first === undefined || first.commentBefore) return;
  const split = comment.lastIndexOf("\n\n");
  first.commentBefore = split === -1 ? comment : comment.slice(split + 2);
  // 末尾的换行渲染为数组注释与第一项之间的空行
  seq.commentBefore = split === -1 ? undefined : `${comment.slice(0, split)}\n`;
}

/**
 * 与上文的空行由数组注释的末尾换行表达；第一项自己再带 spaceBefore 会渲染出一行
 * 只有缩进的空白。原第二项被提为第一项时常带着它，须清掉。
 */
function clearHeadSpacing(seq: YAMLSeq): void {
  const head = seq.items[0];
  if (isMap(head)) head.spaceBefore = false;
}

/** 第一遍：精确身份按出现顺序一一认领；返回与 next 同下标的认领结果 */
function claimExact(
  nodes: readonly YAMLMap[],
  next: readonly Record<string, unknown>[],
  identityOf: (item: Record<string, unknown>) => string,
): (YAMLMap | undefined)[] {
  const pool = new Map<string, YAMLMap[]>();
  for (const node of nodes) {
    const id = identityOf(node.toJSON() as Record<string, unknown>);
    pool.set(id, [...(pool.get(id) ?? []), node]);
  }
  return next.map((item) => pool.get(identityOf(item))?.shift());
}

/** 第二遍：宽松身份下一对一的剩余项才复用，结果写回 claimed */
function claimUnambiguousLoose(
  nodes: readonly YAMLMap[],
  next: readonly Record<string, unknown>[],
  claimed: (YAMLMap | undefined)[],
  looseIdentityOf: (item: Record<string, unknown>) => string,
): void {
  const taken = new Set(claimed.filter((node) => node !== undefined));
  const leftoverNodes = new Map<string, YAMLMap[]>();
  for (const node of nodes) {
    if (taken.has(node)) continue;
    const key = looseIdentityOf(node.toJSON() as Record<string, unknown>);
    leftoverNodes.set(key, [...(leftoverNodes.get(key) ?? []), node]);
  }
  const leftoverItems = new Map<string, number[]>();
  next.forEach((item, index) => {
    if (claimed[index] !== undefined) return;
    const key = looseIdentityOf(item);
    leftoverItems.set(key, [...(leftoverItems.get(key) ?? []), index]);
  });
  for (const [key, indexes] of leftoverItems) {
    const candidates = leftoverNodes.get(key) ?? [];
    if (indexes.length === 1 && candidates.length === 1) claimed[indexes[0]!] = candidates[0];
  }
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
