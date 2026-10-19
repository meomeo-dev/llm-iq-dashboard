import ts from "typescript";
import type { UiViolation } from "./types";

const DYNAMIC_STYLE_PROPS = new Set([
  "left",
  "top",
  "right",
  "bottom",
  "width",
  "height",
  "gridColumn",
  "background",
]);

const RAW_COLOR_RE = /#[0-9a-fA-F]{3,8}\b|\brgba?\s*\(|\bhsla?\s*\(/;

function unwrapExpression(expr: ts.Expression): ts.Expression {
  let curr = expr;
  while (
    ts.isParenthesizedExpression(curr) ||
    ts.isAsExpression(curr) ||
    ts.isSatisfiesExpression(curr) ||
    ts.isNonNullExpression(curr)
  ) {
    curr = curr.expression;
  }
  return curr;
}

function isStaticLiteralValue(
  expr: ts.Expression,
  varInitMap: ReadonlyMap<string, ts.Expression>,
): boolean {
  const node = unwrapExpression(expr);
  if (ts.isIdentifier(node)) {
    const resolved = varInitMap.get(node.text);
    return resolved ? isStaticLiteralValue(resolved, varInitMap) : false;
  }
  if (
    ts.isStringLiteral(node) ||
    ts.isNumericLiteral(node) ||
    ts.isNoSubstitutionTemplateLiteral(node)
  ) {
    return true;
  }
  return ts.isPrefixUnaryExpression(node) && ts.isNumericLiteral(node.operand);
}

function getPropertyNameText(name: ts.PropertyName): string | null {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }
  return null;
}

function lineOf(sf: ts.SourceFile, node: ts.Node): number {
  return sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
}

interface StyleContext {
  sf: ts.SourceFile;
  relFile: string;
  isColorExempt: boolean;
  styleMap: ReadonlyMap<string, ts.ObjectLiteralExpression[]>;
  varInitMap: ReadonlyMap<string, ts.Expression>;
  violations: UiViolation[];
}

function checkPropertyAssignment(ctx: StyleContext, prop: ts.PropertyAssignment): void {
  const key = getPropertyNameText(prop.name);
  if (!key) return;
  const valNode = unwrapExpression(prop.initializer);
  const resolvedVal =
    ts.isIdentifier(valNode) && ctx.varInitMap.has(valNode.text)
      ? ctx.varInitMap.get(valNode.text)!
      : prop.initializer;
  const valText = resolvedVal.getText(ctx.sf);

  if (!ctx.isColorExempt && RAW_COLOR_RE.test(valText)) {
    ctx.violations.push({
      rule: "UI-02",
      file: ctx.relFile,
      line: lineOf(ctx.sf, prop),
      message: `Raw color literal in style property "${key}": ${valText}`,
    });
  }
  if (key.startsWith("--")) return;
  if (DYNAMIC_STYLE_PROPS.has(key)) {
    if (isStaticLiteralValue(prop.initializer, ctx.varInitMap)) {
      ctx.violations.push({
        rule: "UI-01",
        file: ctx.relFile,
        line: lineOf(ctx.sf, prop),
        message: `Static literal value for "${key}" in inline style (${valText}); move to CSS class`,
      });
    }
    return;
  }
  ctx.violations.push({
    rule: "UI-01",
    file: ctx.relFile,
    line: lineOf(ctx.sf, prop),
    message: `Forbidden static inline style property "${key}"; use CSS classes and Design Tokens`,
  });
}

function checkStyleObjectLiteral(ctx: StyleContext, obj: ts.ObjectLiteralExpression): void {
  for (const prop of obj.properties) {
    if (ts.isPropertyAssignment(prop)) {
      checkPropertyAssignment(ctx, prop);
    } else if (ts.isShorthandPropertyAssignment(prop)) {
      const key = prop.name.text;
      const resolved = ctx.varInitMap.get(key);
      if (resolved && !ctx.isColorExempt && RAW_COLOR_RE.test(resolved.getText(ctx.sf))) {
        ctx.violations.push({
          rule: "UI-02",
          file: ctx.relFile,
          line: lineOf(ctx.sf, prop),
          message: `Raw color literal in shorthand style property "${key}"`,
        });
      }
      if (!DYNAMIC_STYLE_PROPS.has(key) || (resolved && isStaticLiteralValue(resolved, ctx.varInitMap))) {
        ctx.violations.push({
          rule: "UI-01",
          file: ctx.relFile,
          line: lineOf(ctx.sf, prop),
          message: `Forbidden inline style shorthand property "${key}"`,
        });
      }
    } else if (ts.isSpreadAssignment(prop)) {
      const spreadObjs = resolveStyleObjects(prop.expression, ctx.styleMap);
      if (spreadObjs.length === 0) {
        ctx.violations.push({
          rule: "UI-01",
          file: ctx.relFile,
          line: lineOf(ctx.sf, prop),
          message: `Forbidden unresolved spread assignment in inline style (${prop.getText(ctx.sf)})`,
        });
      } else {
        for (const sub of spreadObjs) checkStyleObjectLiteral(ctx, sub);
      }
    }
  }
}

function collectStyleAndVarMaps(sf: ts.SourceFile): {
  styleMap: Map<string, ts.ObjectLiteralExpression[]>;
  varInitMap: Map<string, ts.Expression>;
} {
  const styleMap = new Map<string, ts.ObjectLiteralExpression[]>();
  const varInitMap = new Map<string, ts.Expression>();
  const visit = (node: ts.Node): void => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      varInitMap.set(node.name.text, node.initializer);
      const unwrapped = unwrapExpression(node.initializer);
      if (ts.isObjectLiteralExpression(unwrapped)) {
        styleMap.set(node.name.text, [unwrapped]);
      } else if (ts.isConditionalExpression(unwrapped)) {
        const list: ts.ObjectLiteralExpression[] = [];
        const wTrue = unwrapExpression(unwrapped.whenTrue);
        const wFalse = unwrapExpression(unwrapped.whenFalse);
        if (ts.isObjectLiteralExpression(wTrue)) list.push(wTrue);
        if (ts.isObjectLiteralExpression(wFalse)) list.push(wFalse);
        if (list.length > 0) styleMap.set(node.name.text, list);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return { styleMap, varInitMap };
}

function resolveStyleObjects(
  expr: ts.Expression,
  styleMap: ReadonlyMap<string, ts.ObjectLiteralExpression[]>,
): ts.ObjectLiteralExpression[] {
  const node = unwrapExpression(expr);
  if (ts.isObjectLiteralExpression(node)) return [node];
  if (ts.isIdentifier(node)) return styleMap.get(node.text) ?? [];
  if (ts.isConditionalExpression(node)) {
    return [
      ...resolveStyleObjects(node.whenTrue, styleMap),
      ...resolveStyleObjects(node.whenFalse, styleMap),
    ];
  }
  return [];
}

function inspectJsxAttribute(
  ctx: StyleContext,
  node: ts.JsxAttribute,
  usedClasses: Map<string, number>,
): void {
  if (!ts.isIdentifier(node.name) || !node.initializer) return;
  const attrName = node.name.text;
  if (attrName === "className") {
    const text = ts.isStringLiteral(node.initializer) ? node.initializer.text : "";
    for (const token of text.split(/\s+/).filter(Boolean)) {
      if (!usedClasses.has(token)) usedClasses.set(token, lineOf(ctx.sf, node));
    }
    return;
  }
  if (attrName === "style" && ts.isJsxExpression(node.initializer) && node.initializer.expression) {
    const objs = resolveStyleObjects(node.initializer.expression, ctx.styleMap);
    for (const obj of objs) checkStyleObjectLiteral(ctx, obj);
    return;
  }
  if (
    !ctx.isColorExempt &&
    (attrName === "fill" || attrName === "stroke" || attrName === "color" || attrName === "stopColor")
  ) {
    const rawText = ts.isStringLiteral(node.initializer)
      ? node.initializer.text
      : node.initializer.getText(ctx.sf);
    if (RAW_COLOR_RE.test(rawText)) {
      ctx.violations.push({
        rule: "UI-02",
        file: ctx.relFile,
        line: lineOf(ctx.sf, node),
        message: `Raw color literal in JSX attribute ${attrName}=${rawText}`,
      });
    }
  }
}

export function checkTsxFile(
  relFile: string,
  content: string,
): { violations: UiViolation[]; usedClasses: Map<string, number> } {
  const violations: UiViolation[] = [];
  const usedClasses = new Map<string, number>();
  const kind = relFile.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(relFile, content, ts.ScriptTarget.Latest, true, kind);
  const isUiPrimitive = relFile.startsWith("src/app/components/ui/");
  const isColorExempt =
    relFile.startsWith("src/app/components/export/") ||
    relFile === "src/app/components/profile/profile-color.ts";
  const { styleMap, varInitMap } = collectStyleAndVarMaps(sf);
  const ctx: StyleContext = { sf, relFile, isColorExempt, styleMap, varInitMap, violations };

  const visit = (node: ts.Node): void => {
    if (isUiPrimitive && ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const spec = node.moduleSpecifier.text;
      if (spec.startsWith("@/core") || spec.includes("/core/")) {
        violations.push({
          rule: "UI-00",
          file: relFile,
          line: lineOf(sf, node),
          message: `UI primitive must not import domain/core module "${spec}"`,
        });
      }
    }
    if (ts.isJsxAttribute(node)) inspectJsxAttribute(ctx, node, usedClasses);
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return { violations, usedClasses };
}
