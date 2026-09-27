# Third-Party Notices

<!-- ip-compliance:begin -->

## 由 IP 合规审查维护的第三方声明

### npm:@types/node

- 许可证：MIT
- 使用位置：package.json
- 原始声明：未在引入台账中记录，请从来源补全版权与许可声明全文。

### npm:@types/react

- 许可证：MIT
- 使用位置：package.json
- 原始声明：未在引入台账中记录，请从来源补全版权与许可声明全文。

### npm:@types/react-dom

- 许可证：MIT
- 使用位置：package.json
- 原始声明：未在引入台账中记录，请从来源补全版权与许可声明全文。

### npm:better-sse

- 许可证：MIT
- 使用位置：package.json
- 原始声明：未在引入台账中记录，请从来源补全版权与许可声明全文。

### npm:chokidar

- 许可证：MIT
- 使用位置：package.json
- 原始声明：未在引入台账中记录，请从来源补全版权与许可声明全文。

### npm:croner

- 许可证：MIT
- 使用位置：package.json
- 原始声明：未在引入台账中记录，请从来源补全版权与许可声明全文。

### npm:jsdom

- 许可证：MIT
- 使用位置：package.json
- 原始声明：未在引入台账中记录，请从来源补全版权与许可声明全文。

### npm:next

- 许可证：MIT
- 使用位置：package.json
- 原始声明：未在引入台账中记录，请从来源补全版权与许可声明全文。

### npm:react

- 许可证：MIT
- 使用位置：package.json
- 原始声明：未在引入台账中记录，请从来源补全版权与许可声明全文。

### npm:react-dom

- 许可证：MIT
- 使用位置：package.json
- 原始声明：未在引入台账中记录，请从来源补全版权与许可声明全文。

### npm:tsx

- 许可证：MIT
- 使用位置：package.json
- 原始声明：未在引入台账中记录，请从来源补全版权与许可声明全文。

### npm:typescript

- 许可证：Apache-2.0
- 使用位置：package.json
- Apache-2.0：若来源分发了 NOTICE 文件，须随本项目一并提供其内容。
- 原始声明：未在引入台账中记录，请从来源补全版权与许可声明全文。

### npm:yaml

- 许可证：ISC
- 使用位置：package.json
- 原始声明：未在引入台账中记录，请从来源补全版权与许可声明全文。

<!-- ip-compliance:end -->

## 版权声明

本仓库不包含第三方代码；以下直接依赖由 pnpm 安装，许可证全文见各包目录下的 LICENSE 文件。

| 包 | 版本 | 许可证 | 版权 |
| --- | --- | --- | --- |
| next | 15.5.25 | MIT | Copyright (c) 2025 Vercel, Inc. |
| react / react-dom | 19.3.0 | MIT | Copyright (c) Meta Platforms, Inc. and affiliates. |
| better-sse | 0.16.1 | MIT | Copyright (c) 2025 Matthew W. |
| chokidar | 5.0.0 | MIT | Copyright (c) 2012 Paul Miller, Elan Shanker |
| croner | 9.1.0 | MIT | Copyright (c) 2015-2021 Hexagon |
| yaml | 2.9.1 | ISC | Copyright Eemeli Aro |
| tsx | 4.23.15 | MIT | Copyright (c) Hiroki Osame |
| typescript | 5.9.3 | Apache-2.0 | Copyright (c) Microsoft Corporation. |
| jsdom | 29.1.1 | MIT | Copyright (c) 2010 Elijah Insua |
| @types/node、@types/react、@types/react-dom | 22.20.4 / 19.3.0 | MIT | Copyright (c) Microsoft Corporation. |

## 不随本仓库分发的组件

- Docker 镜像不含三家 CLI：容器启动时由 `docker/install-clis.sh` 从官方渠道安装
  claude-code（Anthropic 专有许可）、codex（Apache-2.0）与 agy（Google 分发）。
- next 的可选依赖 `@img/sharp-libvips-*` 为 LGPL-3.0-or-later，由包管理器按平台安装，
  本项目未使用图片优化功能。
- 价格目录数据来自 [meomeo-dev/llm-pricing-catalog](https://github.com/meomeo-dev/llm-pricing-catalog)（MIT），运行时下载到 `data/`。
