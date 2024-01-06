import { describe, expect, test } from "vitest";
import { H, HFragment, HString, h, hFragment, hString } from "../src/h";

describe("testing HElement", () => {
  test("the creation of a vdom element", () => {
    const candidateDiv = h("div");

    const correctDiv: H = {
      type: "element",
      children: [],
      props: {},
      tagName: "div",
    };

    expect(candidateDiv).toStrictEqual(correctDiv);
  });

  test("the creation of a vdom element", () => {
    const candidateDiv = h("div", { class: "container" });

    const correctDiv: H = {
      type: "element",
      children: [],
      props: { class: "container" },
      tagName: "div",
    };

    expect(candidateDiv).toStrictEqual(correctDiv);
  });

  test("the creation of nested vdom element", () => {
    const title = h("h1");
    const header = h("header", { class: "main-header" }, [
      null,
      title,
      null,
      null,
    ]);

    const correctHeader: H = {
      type: "element",
      children: [
        {
          type: "element",
          children: [],
          props: {},
          tagName: "h1",
        },
      ],
      props: { class: "main-header" },
      tagName: "header",
    };

    expect(header).toStrictEqual(correctHeader);
  });
});

describe("testing HString", () => {
  test("the creation of a string element", () => {
    const candidateString = hString("hello");

    const correctString: HString = {
      type: "text",
      value: "hello",
    };

    expect(candidateString).toStrictEqual(correctString);
  });
});

describe("testing HFragment", () => {
  test("the creation of a fragment element", () => {
    const candidateFragment = hFragment([]);

    const correctFragment: HFragment = {
      type: "fragment",
      children: [],
    };

    expect(candidateFragment).toStrictEqual(correctFragment);
  });

  test("the creation of a fragment element with children", () => {
    const candidateFragment = hFragment([h("div"), hString("hello")]);

    const correctFragment: HFragment = {
      type: "fragment",
      children: [
        { type: "element", children: [], props: {}, tagName: "div" },
        { type: "text", value: "hello" },
      ],
    };

    expect(candidateFragment).toStrictEqual(correctFragment);
  });

  test("the creation of nested fragments", () => {
    const candidateFragment = hFragment([
      hFragment([h("div"), hString("hello")]),
      h("header", { class: "header" }, [hString("world")]),
    ]);

    const correctFragment: HFragment = {
      type: "fragment",
      children: [
        {
          type: "fragment",
          children: [
            { type: "element", children: [], props: {}, tagName: "div" },
            { type: "text", value: "hello" },
          ],
        },
        {
          type: "element",
          tagName: "header",
          props: { class: "header" },
          children: [{ type: "text", value: "world" }],
        },
      ],
    };

    expect(candidateFragment).toStrictEqual(correctFragment);
  });
});
