/** 进度面板的分道按上游分组：登录态在前，其余按配置顺序，组内保持道序 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { groupLanes } from "@/app/components/run-status/RunStatus";
import type { LaneProgress } from "@/core/progress";
import type { ProfileView } from "@/core/profile-view";

function lane(model: string, profile?: string): LaneProgress {
  return { cli: "codex", model, calls: [], ...(profile === undefined ? {} : { profile }) } as LaneProgress;
}

const profiles: ProfileView[] = ["relay-a", "relay-b"].map((name) => ({
  name, label: name, cli: "codex", upstreamType: "t", group: null, website: null, multiplier: 1, enabled: true,
}));

test("groupLanes：登录态在前、配置顺序，组内保持道序；只有登录态时一组", () => {
  const lanes = [lane("m1", "relay-b"), lane("m2"), lane("m1", "relay-a"), lane("m2", "relay-b")];
  const groups = groupLanes(lanes, profiles);
  assert.deepEqual(
    groups.map((group) => [group.profile, group.lanes.map((item) => item.model)]),
    [["default", ["m2"]], ["relay-a", ["m1"]], ["relay-b", ["m1", "m2"]]],
  );
  assert.deepEqual(groupLanes([lane("m1"), lane("m2")], profiles).map((group) => group.profile), ["default"]);
});
