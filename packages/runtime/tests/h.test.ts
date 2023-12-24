import { describe, expect, test } from "vitest";
import { HElement, HFragment, HString, h } from "../src/h";

describe("testing HElement", () => {
  test("the creation of a vdom element", () => {
    const candidateDiv = h({
      type: "element",
      tagName: "div",
      props: { class: "super" },
      children: [],
    });

    const correctDiv: HElement = {
      type: "element",
      children: [],
      props: { class: "super" },
      tagName: "div",
    };

    expect(candidateDiv).toStrictEqual(correctDiv);
  });

  test("the creation of nested vdom element", () => {
    const title = h({
      type: "element",
      children: [],
      props: {},
      tagName: "h1",
    });
    const header = h({
      type: "element",
      tagName: "header",
      props: { class: "main-header" },
      children: [title],
    });

    const correctHeader: HElement = {
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
    const candidateString = h({
      type: "text",
      value: "hello",
    });

    const correctString: HString = {
      type: "text",
      value: "hello",
    };

    expect(candidateString).toStrictEqual(correctString);
  });
});

describe("testing HFragment", () => {
  test("the creation of a fragment element", () => {
    const candidateFragment = h({
      type: "fragment",
      children: [],
    });

    const correctFragment: HFragment = {
      type: "fragment",
      children: [],
    };

    expect(candidateFragment).toStrictEqual(correctFragment);
  });

  test("the creation of a fragment element with children", () => {
    const candidateFragment = h({
      type: "fragment",
      children: [
        h({ type: "element", children: [], props: {}, tagName: "div" }),
        h({ type: "text", value: "hello" }),
      ],
    });

    const correctFragment: HFragment = {
      type: "fragment",
      children: [
        { type: "element", children: [], props: {}, tagName: "div" },
        { type: "text", value: "hello" },
      ],
    };

    expect(candidateFragment).toStrictEqual(correctFragment);
  });
});
