/**
 * 设备配对页（/pair）双语字典。
 */

export interface PairMessages {
  title: string;
  subtitle: string;
  codeLabel: string;
  codePlaceholder: string;
  deviceNameLabel: string;
  deviceNamePlaceholder: string;
  submitButton: string;
  submitting: string;
  howToTitle: string;
  howToStep1: string;
  howToStep2: string;
  signedInTitle: string;
  signedInDesc: string;
  signOutButton: string;
  signingOut: string;
  openConfigButton: string;
  errors: {
    emptyCode: string;
    invalidOrExpired: string;
    rateLimited: string;
    networkError: string;
  };
}

export const zhCNPair: PairMessages = {
  title: "配对所有者浏览器",
  subtitle: "输入在宿主机或 runner 容器终端生成的配对码，解锁配置管理、手动跑一轮与自动任务开关。",
  codeLabel: "一次性配对码",
  codePlaceholder: "例如：ABCD-1234",
  deviceNameLabel: "设备备注名（可选）",
  deviceNamePlaceholder: "例如：MacBook Pro Chrome",
  submitButton: "完成配对",
  submitting: "验证中…",
  howToTitle: "如何获取配对码？",
  howToStep1: "在运行看板的机器或容器内执行以下命令（10 分钟内有效、仅限使用一次）：",
  howToStep2: "将终端输出的配对码填入上方输入框即可完成授权。",
  signedInTitle: "当前浏览器已配对为所有者",
  signedInDesc: "你可以直接修改配置、手动发起评测或管理自动任务开关。",
  signOutButton: "退出当前设备配对",
  signingOut: "退出中…",
  openConfigButton: "前往配置管理台",
  errors: {
    emptyCode: "请输入配对码",
    invalidOrExpired: "配对码无效或已过期，请重新运行 pnpm pair 生成",
    rateLimited: "尝试次数过多，请稍后再试",
    networkError: "网络请求失败，请检查看板服务状态",
  },
};

export const enPair: PairMessages = {
  title: "Pair Owner Browser",
  subtitle:
    "Enter the one-time pairing code generated in your host or runner terminal to unlock configuration, manual runs, and auto-run controls.",
  codeLabel: "One-Time Pairing Code",
  codePlaceholder: "e.g. ABCD-1234",
  deviceNameLabel: "Device Label (optional)",
  deviceNamePlaceholder: "e.g. MacBook Pro Chrome",
  submitButton: "Pair Device",
  submitting: "Verifying…",
  howToTitle: "How to get a pairing code?",
  howToStep1: "Run the following command on the host or inside the runner container (valid for 10 minutes, single use):",
  howToStep2: "Paste the printed pairing code above to authorize this browser.",
  signedInTitle: "This browser is paired as Owner",
  signedInDesc: "You have full access to configuration, manual benchmark runs, and auto-run controls.",
  signOutButton: "Unpair This Browser",
  signingOut: "Unpairing…",
  openConfigButton: "Open Configuration Console",
  errors: {
    emptyCode: "Please enter a pairing code",
    invalidOrExpired: "Invalid or expired pairing code. Run pnpm pair to generate a new one.",
    rateLimited: "Too many attempts. Please wait and try again.",
    networkError: "Network request failed. Please check the dashboard server.",
  },
};
