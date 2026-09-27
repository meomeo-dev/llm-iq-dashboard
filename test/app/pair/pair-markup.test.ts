import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import React from "react";
// @ts-ignore global React for jsx preserve
(globalThis as unknown as { React: typeof React }).React = React;

import ReactDOMServer from "react-dom/server";
import { PairForm } from "@/app/pair/PairForm";

const FIXTURES_DIR = path.resolve(__dirname, "../../fixtures/markup/wp-g");

function readFixture(name: string): string {
  return fs.readFileSync(path.join(FIXTURES_DIR, name), "utf-8");
}

test("PairForm markup matches fixtures", async (t) => {
  await t.test("signed out shows code input form", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(PairForm, {
        returnTo: "/config",
        signedInAs: null,
      })
    );
    assert.strictEqual(html, readFixture("pairform-signed-out.html"));
  });

  await t.test("signed in shows signed-in card and controls", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(PairForm, {
        returnTo: "/config",
        signedInAs: "MacBook Pro",
      })
    );
    assert.strictEqual(html, readFixture("pairform-signed-in.html"));
  });
});
