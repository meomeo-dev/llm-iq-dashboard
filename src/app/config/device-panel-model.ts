/** 格式化会话设备的时间戳，截取到分并替换 T */
export function formatDeviceTime(iso: string): string {
  return iso.slice(0, 16).replace("T", " ");
}
