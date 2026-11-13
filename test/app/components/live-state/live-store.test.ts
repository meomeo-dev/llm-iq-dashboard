import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { useLiveProgress } from "@/app/components/live-state/live-store";

class Stream extends EventTarget {
  static readonly CLOSED = 2;
  static readonly instances: Stream[] = [];
  readyState = 1;

  constructor(readonly url: string) {
    super();
    Stream.instances.push(this);
  }

  close(): void {
    this.readyState = Stream.CLOSED;
  }
}

test("实时进度在后台释放连接，回到前台接收新快照", async (t) => {
  const dom = new JSDOM("<main></main>");
  let visibility = "visible";
  Object.defineProperty(dom.window.document, "visibilityState", { get: () => visibility });
  Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    EventSource: Stream,
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  t.mock.method(globalThis, "fetch", async () => new Response(null, { status: 503 }));

  function Progress() {
    const rows = useLiveProgress();
    return React.createElement("output", null, rows?.[0]?.runId ?? "waiting");
  }

  const container = dom.window.document.querySelector("main")!;
  const root = createRoot(container);
  function setVisibility(value: string): void {
    visibility = value;
    dom.window.document.dispatchEvent(new dom.window.Event("visibilitychange"));
  }

  try {
    await act(() => root.render(React.createElement(Progress)));
    const first = Stream.instances[0]!;
    assert.equal(first.url, "/api/events");
    assert.equal(first.readyState, 1);
    await act(() => {
      first.dispatchEvent(new MessageEvent("progress", { data: '[{"runId":"before"}]' }));
    });
    assert.equal(container.textContent, "before");

    await act(() => setVisibility("hidden"));
    assert.equal(first.readyState, Stream.CLOSED);
    assert.equal(container.textContent, "before");

    await act(() => setVisibility("visible"));
    assert.equal(Stream.instances.length, 2);
    const second = Stream.instances[1]!;
    await act(() => {
      second.dispatchEvent(new MessageEvent("progress", { data: '[{"runId":"after"}]' }));
    });
    assert.equal(container.textContent, "after");
  } finally {
    await act(() => root.unmount());
    dom.window.close();
  }
  assert.equal(Stream.instances.at(-1)?.readyState, Stream.CLOSED);
});
