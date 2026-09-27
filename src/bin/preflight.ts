#!/usr/bin/env tsx
/**
 * 环境自查：`pnpm preflight`
 *
 * 检查项见 environment-report.ts；配置用到的项目有问题时以非零退出。
 */

import { reportEnvironment } from "./environment-report";

reportEnvironment()
  .then((ok) => {
    if (!ok) process.exit(1);
  })
  .catch((cause: unknown) => {
    console.error(cause instanceof Error ? cause.message : cause);
    process.exit(1);
  });
