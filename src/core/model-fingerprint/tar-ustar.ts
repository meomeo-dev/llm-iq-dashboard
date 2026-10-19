/**
 * 零外部依赖的确定性 POSIX ustar (.tar.gz) 打包与安全解包器（Layer 1 容器安全）：
 * - 使用 Node.js 内置 node:zlib (gzipSync / gunzipSync)
 * - 严格限制压缩包体积（≤ 10 MB）、解压输出体积（≤ 50 MB，防 gzip 炸弹）与条目数（≤ 16）
 * - 校验 512 字节 ustar Header 校验和、仅允许普通文件（typeflag '0' 或 '\0'）并拦截路径穿越
 */

import { gunzipSync, gzipSync } from "node:zlib";

export const MAX_BUNDLE_COMPRESSED_BYTES = 10 * 1024 * 1024;
export const MAX_BUNDLE_UNCOMPRESSED_BYTES = 50 * 1024 * 1024;
export const MAX_BUNDLE_ENTRIES = 16;
const TAR_BLOCK_SIZE = 512;

export type BundleArchiveErrorCode =
  | "ARCHIVE_EMPTY_OR_OVERSIZE"
  | "ARCHIVE_GZIP_CORRUPT_OR_BOMB"
  | "ARCHIVE_TAR_INVALID_HEADER"
  | "ARCHIVE_PATH_TRAVERSAL_OR_FORBIDDEN_ENTRY"
  | "ARCHIVE_DUPLICATE_OR_MISSING_ENTRY"
  | "MANIFEST_JSON_INVALID"
  | "MANIFEST_SCHEMA_INVALID"
  | "MANIFEST_FILE_LIST_MISMATCH"
  | "MANIFEST_PACKAGE_HASH_MISMATCH"
  | "PROBE_FILE_BYTE_LENGTH_MISMATCH"
  | "PROBE_FILE_SHA256_MISMATCH"
  | "SAMPLE_SET_JSON_INVALID"
  | "SAMPLE_SET_META_MISMATCH"
  | "SAMPLE_SET_ATTEMPT_INVALID"
  | "SAMPLE_SET_SECRET_LEAK_DETECTED"
  | "QUALIFICATION_COUNT_MISMATCH"
  | "QUALIFICATION_ZERO_VALID_VALUES";

export class FingerprintBundleError extends Error {
  public readonly layer: 1 | 2 | 3 | 4 | 5;
  public readonly code: BundleArchiveErrorCode;
  public readonly detail?: Record<string, unknown>;

  public constructor(
    layer: 1 | 2 | 3 | 4 | 5,
    code: BundleArchiveErrorCode,
    message: string,
    detail?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "FingerprintBundleError";
    this.layer = layer;
    this.code = code;
    this.detail = detail;
  }
}

export interface TarFileEntry {
  name: string;
  data: Buffer;
  mtimeSec?: number;
}

function writeAsciiField(buf: Buffer, text: string, offset: number, length: number): void {
  buf.fill(0, offset, offset + length);
  buf.write(text, offset, Math.min(Buffer.byteLength(text, "utf8"), length - 1), "utf8");
}

function writeOctalField(buf: Buffer, value: number, offset: number, length: number): void {
  const octal = Math.max(0, Math.floor(value)).toString(8).padStart(length - 1, "0");
  buf.write(octal, offset, length - 1, "ascii");
  buf[offset + length - 1] = 0;
}

function computeHeaderChecksum(header: Buffer): number {
  let sum = 0;
  for (let i = 0; i < TAR_BLOCK_SIZE; i += 1) {
    sum += i >= 148 && i < 156 ? 0x20 : header[i]!;
  }
  return sum;
}

function buildUstarHeader(name: string, byteLength: number, mtimeSec: number): Buffer {
  const header = Buffer.alloc(TAR_BLOCK_SIZE, 0);
  writeAsciiField(header, name, 0, 100);
  writeOctalField(header, 0o644, 100, 8);
  writeOctalField(header, 0, 108, 8);
  writeOctalField(header, 0, 116, 8);
  writeOctalField(header, byteLength, 124, 12);
  writeOctalField(header, mtimeSec, 136, 12);
  header.fill(0x20, 148, 156);
  header[156] = 0x30; // '0' regular file
  header.write("ustar\0", 257, 6, "ascii");
  header.write("00", 263, 2, "ascii");
  const chksum = computeHeaderChecksum(header).toString(8).padStart(6, "0");
  header.write(chksum, 148, 6, "ascii");
  header[154] = 0;
  header[155] = 0x20;
  return header;
}

export function packTarGzip(entries: readonly TarFileEntry[]): Buffer {
  const chunks: Buffer[] = [];
  for (const entry of entries) {
    const header = buildUstarHeader(entry.name, entry.data.byteLength, entry.mtimeSec ?? 0);
    chunks.push(header, entry.data);
    const remainder = entry.data.byteLength % TAR_BLOCK_SIZE;
    if (remainder > 0) {
      chunks.push(Buffer.alloc(TAR_BLOCK_SIZE - remainder, 0));
    }
  }
  chunks.push(Buffer.alloc(TAR_BLOCK_SIZE * 2, 0));
  return gzipSync(Buffer.concat(chunks), { level: 9 });
}

function isZeroBlock(block: Buffer): boolean {
  for (let i = 0; i < block.byteLength; i += 1) {
    if (block[i] !== 0) return false;
  }
  return true;
}

function readNullTerminatedAscii(buf: Buffer, offset: number, length: number): string {
  const slice = buf.subarray(offset, offset + length);
  const zeroIdx = slice.indexOf(0);
  return (zeroIdx >= 0 ? slice.subarray(0, zeroIdx) : slice).toString("utf8").trim();
}

function parseOctalField(buf: Buffer, offset: number, length: number, label: string): number {
  const raw = readNullTerminatedAscii(buf, offset, length);
  if (!/^[0-7]+$/.test(raw)) {
    throw new FingerprintBundleError(1, "ARCHIVE_TAR_INVALID_HEADER", `Tar 头部字段 ${label} 非合法八进制：${raw}`);
  }
  return Number.parseInt(raw, 8);
}

function validateAllowedEntryPath(entryName: string): void {
  if (
    !entryName ||
    entryName.includes("\0") ||
    entryName.includes("\\") ||
    entryName.startsWith("/") ||
    entryName.includes("..") ||
    entryName.includes("//")
  ) {
    throw new FingerprintBundleError(
      1,
      "ARCHIVE_PATH_TRAVERSAL_OR_FORBIDDEN_ENTRY",
      `压缩包包含非法或越界路径：${entryName}`,
    );
  }
  const allowed =
    entryName === "manifest.json" ||
    /^samples\/(uuid|number|seed|palette|words-en|words-zh)\.json$/.test(entryName);
  if (!allowed) {
    throw new FingerprintBundleError(
      1,
      "ARCHIVE_PATH_TRAVERSAL_OR_FORBIDDEN_ENTRY",
      `压缩包包含非白名单文件条目：${entryName}`,
    );
  }
}

function decompressBundleBytes(compressed: Buffer): Buffer {
  if (compressed.byteLength === 0 || compressed.byteLength > MAX_BUNDLE_COMPRESSED_BYTES) {
    throw new FingerprintBundleError(
      1,
      "ARCHIVE_EMPTY_OR_OVERSIZE",
      `压缩包体积须在 1 B 至 ${MAX_BUNDLE_COMPRESSED_BYTES} B 之间（当前 ${compressed.byteLength} B）`,
    );
  }
  try {
    return gunzipSync(compressed, { maxOutputLength: MAX_BUNDLE_UNCOMPRESSED_BYTES });
  } catch (err) {
    throw new FingerprintBundleError(
      1,
      "ARCHIVE_GZIP_CORRUPT_OR_BOMB",
      `Gzip 解压失败或超过 50 MB 安全上限：${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

export function unpackTarGzip(compressed: Buffer): Map<string, Buffer> {
  const tar = decompressBundleBytes(compressed);
  if (tar.byteLength === 0 || tar.byteLength % TAR_BLOCK_SIZE !== 0) {
    throw new FingerprintBundleError(1, "ARCHIVE_TAR_INVALID_HEADER", "Tar 归档字节长度不是 512 的整数倍");
  }
  const files = new Map<string, Buffer>();
  let offset = 0;

  while (offset + TAR_BLOCK_SIZE <= tar.byteLength) {
    const header = tar.subarray(offset, offset + TAR_BLOCK_SIZE);
    offset += TAR_BLOCK_SIZE;
    if (isZeroBlock(header)) break;

    const recordedChksum = parseOctalField(header, 148, 8, "chksum");
    if (recordedChksum !== computeHeaderChecksum(header)) {
      throw new FingerprintBundleError(1, "ARCHIVE_TAR_INVALID_HEADER", "Tar 头部校验和（chksum）不匹配，文件已损坏");
    }
    const typeFlag = header[156]!;
    if (typeFlag !== 0 && typeFlag !== 0x30) {
      throw new FingerprintBundleError(1, "ARCHIVE_TAR_INVALID_HEADER", `仅允许普通文件条目（typeflag=${typeFlag}）`);
    }
    const name = readNullTerminatedAscii(header, 0, 100);
    validateAllowedEntryPath(name);
    if (files.has(name) || files.size >= MAX_BUNDLE_ENTRIES) {
      throw new FingerprintBundleError(1, "ARCHIVE_DUPLICATE_OR_MISSING_ENTRY", `重复或超限的归档条目：${name}`);
    }
    const size = parseOctalField(header, 124, 12, "size");
    if (offset + size > tar.byteLength) {
      throw new FingerprintBundleError(1, "ARCHIVE_TAR_INVALID_HEADER", `条目 ${name} 内容超出归档末尾`);
    }
    files.set(name, Buffer.from(tar.subarray(offset, offset + size)));
    offset += Math.ceil(size / TAR_BLOCK_SIZE) * TAR_BLOCK_SIZE;
  }

  if (!files.has("manifest.json") || files.size < 2) {
    throw new FingerprintBundleError(
      1,
      "ARCHIVE_DUPLICATE_OR_MISSING_ENTRY",
      "压缩包缺少 manifest.json 或未包含任何 samples/<probe>.json 样本文件",
    );
  }
  return files;
}
