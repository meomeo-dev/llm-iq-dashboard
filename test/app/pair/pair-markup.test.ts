import test from "node:test";
import path from "node:path";
import React from "react";
// @ts-ignore global React for jsx preserve
(globalThis as unknown as { React: typeof React }).React = React;

import ReactDOMServer from "react-dom/server";
import { PairForm } from "@/app/pair/PairForm";
import { expectFixture } from "../../support/fixtures";

const FIXTURES_DIR = path.resolve(__dirname, "../../fixtures/markup/wp-g");

function assertFixture(actual: string, name: string): void {
  expectFixture(actual, path.join(FIXTURES_DIR, name));
}

test("PairForm markup matches fixtures", async (t) => {
  await t.test("signed out shows code input form", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(PairForm, {
        returnTo: "/config",
        signedInAs: null,
      })
    );
    assertFixture(html, "pairform-signed-out.html");
  });

  await t.test("signed in shows signed-in card and controls", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(PairForm, {
        returnTo: "/config",
        signedInAs: "MacBook Pro",
      })
    );
    assertFixture(html, "pairform-signed-in.html");
  });
});
