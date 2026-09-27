/**
 * RFC 4180 CSV 解析：逗号分隔，双引号包裹的字段可含逗号、换行与转义的双引号（""）。
 *
 * 价格目录的 Release 附件是标准 CSV；只为读这两个文件引入 CSV 依赖不值得。
 */

export function parseCsv(text: string): Record<string, string>[] {
  const rows = parseRows(text);
  const header = rows.shift();
  if (header === undefined) return [];
  return rows
    .filter((row) => row.length > 1 || row[0] !== "")
    .map((row) => Object.fromEntries(header.map((name, index) => [name, row[index] ?? ""])));
}

function parseRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      const escapedQuote = char === '"' && text[index + 1] === '"';
      if (escapedQuote) index += 1;
      if (char === '"' && !escapedQuote) quoted = false;
      else field += char;
      continue;
    }
    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field.endsWith("\r") ? field.slice(0, -1) : field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field !== "" || row.length > 0) rows.push([...row, field]);
  return rows;
}
