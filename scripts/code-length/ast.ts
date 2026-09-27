/**
 * AST 解析与函数提取模块（使用 TypeScript 编译器 API）。
 */

import ts from "typescript";
import type { ASTFunctionInfo } from "./types";

/** 计算文件行数（空文件为 0，带末尾换行符的行按常规换行统计） */
export function countFileLines(content: string): number {
  if (content.length === 0) return 0;
  if (content.endsWith("\n")) {
    return content.slice(0, -1).split("\n").length;
  }
  return content.split("\n").length;
}

/** 从 ArrowFunction 或 FunctionExpression 获取被绑定的变量名或属性名 */
function getAnonymousParentName(
  node: ts.ArrowFunction | ts.FunctionExpression,
  sourceFile: ts.SourceFile,
): string | null {
  const parent = node.parent;
  if (ts.isVariableDeclaration(parent) && parent.initializer === node) {
    return parent.name.getText(sourceFile);
  }
  if (ts.isPropertyAssignment(parent) && parent.initializer === node) {
    return parent.name.getText(sourceFile);
  }
  if (ts.isPropertyDeclaration(parent) && parent.initializer === node) {
    return parent.name.getText(sourceFile);
  }
  if (ts.isExportAssignment(parent)) {
    return "default";
  }
  if (
    ts.isBinaryExpression(parent) &&
    parent.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
    parent.right === node
  ) {
    return parent.left.getText(sourceFile);
  }
  return null;
}

/** 获取 AST 节点的函数名称（非命名函数/匿名回调返回 null） */
export function getFunctionName(
  node: ts.Node,
  sourceFile: ts.SourceFile,
): string | null {
  if (ts.isFunctionDeclaration(node)) {
    return node.name ? node.name.text : "default";
  }
  if (ts.isMethodDeclaration(node) || ts.isMethodSignature(node)) {
    return node.name.getText(sourceFile);
  }
  if (ts.isConstructorDeclaration(node)) {
    return "constructor";
  }
  if (ts.isGetAccessorDeclaration(node)) {
    return `get ${node.name.getText(sourceFile)}`;
  }
  if (ts.isSetAccessorDeclaration(node)) {
    return `set ${node.name.getText(sourceFile)}`;
  }
  if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
    return getAnonymousParentName(node, sourceFile);
  }
  return null;
}

/** 计算函数的起始节点（对于由变量/属性声明赋值的函数，从变量/属性声明起始位置计算） */
function getDeclarationStartNode(node: ts.Node): ts.Node {
  if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
    const parent = node.parent;
    if (
      ts.isVariableDeclaration(parent) ||
      ts.isPropertyAssignment(parent) ||
      ts.isPropertyDeclaration(parent)
    ) {
      return parent;
    }
  }
  return node;
}

/** 提取源文件中的所有命名函数信息 */
export function extractFunctions(sourceFile: ts.SourceFile): ASTFunctionInfo[] {
  const functions: ASTFunctionInfo[] = [];

  function visit(node: ts.Node): void {
    const name = getFunctionName(node, sourceFile);
    if (name !== null) {
      const startNode = getDeclarationStartNode(node);
      const start = sourceFile.getLineAndCharacterOfPosition(
        startNode.getStart(sourceFile),
      );
      const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
      const startLine = start.line + 1;
      const endLine = end.line + 1;
      const lineCount = endLine - startLine + 1;

      functions.push({ name, startLine, endLine, lineCount });
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return functions;
}
