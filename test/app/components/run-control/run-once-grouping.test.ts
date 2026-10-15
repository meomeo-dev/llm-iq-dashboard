import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  classifyPrompt,
  groupByModel,
  groupPrompts,
  type PromptOption,
  type Target,
} from "@/app/components/run-control/run-once-grouping";

describe("run-once-grouping", () => {
  describe("classifyPrompt", () => {
    test("经典基准分类（含犰狳与狐猴）", () => {
      assert.equal(classifyPrompt({ id: "classic-v1", label: "经典", defaultSelected: false }), "经典基准");
      assert.equal(classifyPrompt({ id: "upgraded-v2", label: "升级", defaultSelected: false }), "经典基准");
      assert.equal(classifyPrompt({ id: "animated-pelican-v1", label: "动态", defaultSelected: true }), "经典基准");
      assert.equal(classifyPrompt({ id: "animated-armadillo-fishnet-mars-v1", label: "犰狳", defaultSelected: false }), "经典基准");
      assert.equal(classifyPrompt({ id: "animated-lemur-scooter-front-v1", label: "狐猴", defaultSelected: false }), "经典基准");
    });

    test("2026-09 分组分类", () => {
      const ids = [
        "animated-iso-vintage-pc-v1",
        "animated-iso-amber-crt-v1",
        "animated-iso-server-rack-v1",
        "animated-iso-camera-exploded-v1",
        "animated-human-hand-kinetic-v1",
        "animated-fish-cloud-amodal-v1",
        "animated-island-chest-containment-v1",
        "animated-tree-reader-occlusion-v1",
      ];
      for (const id of ids) {
        assert.equal(classifyPrompt({ id, label: id, defaultSelected: false }), "2026-09");
      }
    });

    test("四大名著分类", () => {
      assert.equal(classifyPrompt({ id: "shuihu-wusong", label: "武松", defaultSelected: false }), "四大名著（文学与叙事构图）");
      assert.equal(classifyPrompt({ id: "xiyou-wukong", label: "悟空", defaultSelected: false }), "四大名著（文学与叙事构图）");
      assert.equal(classifyPrompt({ id: "sanguo-chibi", label: "赤壁", defaultSelected: false }), "四大名著（文学与叙事构图）");
      assert.equal(classifyPrompt({ id: "honglou-daiyu", label: "黛玉", defaultSelected: false }), "四大名著（文学与叙事构图）");
    });

    test("世界地标分类", () => {
      assert.equal(classifyPrompt({ id: "landmarks-v1", label: "地标", defaultSelected: false }), "世界地标（微缩景观）");
    });

    test("自定义提示词分类", () => {
      assert.equal(classifyPrompt({ id: "custom-prompt-abc", label: "自定义", defaultSelected: false }), "自定义提示词");
    });
  });

  describe("groupPrompts", () => {
    test("过滤空分组并按预定义顺序输出", () => {
      const prompts: PromptOption[] = [
        { id: "custom-abc", label: "自定义", defaultSelected: false },
        { id: "classic-v1", label: "经典", defaultSelected: false },
      ];
      const groups = groupPrompts(prompts);
      assert.equal(groups.length, 2);
      assert.equal(groups[0]?.name, "经典基准");
      assert.equal(groups[1]?.name, "自定义提示词");
      assert.equal(groups[0]?.items[0]?.id, "classic-v1");
    });

    test("已移除的前沿工程、前沿视效及微观物理题目被排除在展示之外", () => {
      const prompts: PromptOption[] = [
        { id: "fe-ai-v1", label: "前沿AI", defaultSelected: false },
        { id: "vfx-sim-v1", label: "前沿视效", defaultSelected: false },
        { id: "quantum-double-slit-v1", label: "量子双缝", defaultSelected: false },
        { id: "clock-v1", label: "时钟", defaultSelected: false },
        { id: "classic-v1", label: "经典", defaultSelected: false },
      ];
      const groups = groupPrompts(prompts);
      assert.equal(groups.length, 1);
      assert.equal(groups[0]?.name, "经典基准");
      assert.equal(groups[0]?.items[0]?.id, "classic-v1");
    });

    test("全部分组顺序严格保证 2026-09 紧随四大名著/世界地标之后", () => {
      const allPrompts: PromptOption[] = [
        { id: "custom-abc", label: "自定义", defaultSelected: false },
        { id: "animated-iso-vintage-pc-v1", label: "复古PC", defaultSelected: false },
        { id: "landmarks-v1", label: "地标", defaultSelected: false },
        { id: "classic-v1", label: "经典", defaultSelected: false },
      ];
      const groups = groupPrompts(allPrompts);
      const names = groups.map((g) => g.name);
      assert.deepEqual(names, [
        "经典基准",
        "世界地标（微缩景观）",
        "2026-09",
        "自定义提示词",
      ]);
      assert.equal(names.indexOf("2026-09"), names.indexOf("世界地标（微缩景观）") + 1);
    });

    test("空输入返回空数组", () => {
      assert.deepEqual(groupPrompts([]), []);
    });
  });

  describe("groupByModel", () => {
    test("按 CLI 和 model 正确聚合 targets", () => {
      const targets: Target[] = [
        { id: "claude/3-7/low", cli: "claude", model: "claude-3-7", effort: "low", label: "Claude 3.7 Low", defaultSelected: false },
        { id: "claude/3-7/high", cli: "claude", model: "claude-3-7", effort: "high", label: "Claude 3.7 High", defaultSelected: true },
        { id: "codex/o3/high", cli: "codex", model: "o3-mini", effort: "high", label: "Codex O3 High", defaultSelected: false },
      ];
      const groups = groupByModel(targets);
      assert.equal(groups.length, 2);
      assert.equal(groups[0]?.key, "claude/claude-3-7");
      assert.equal(groups[0]?.targets.length, 2);
      assert.equal(groups[1]?.key, "codex/o3-mini");
      assert.equal(groups[1]?.targets.length, 1);
    });

    test("空输入返回空数组", () => {
      assert.deepEqual(groupByModel([]), []);
    });
  });
});
