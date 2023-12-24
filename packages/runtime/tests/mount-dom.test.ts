import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { mountDOM } from "../src/mount-dom";
import { HFragment, h, hFragment, hString } from "../src/h";

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("testing the mounting of string vdom", () => {
  test("if mounting a string vnode works", () => {
    const text = hString("hello world");

    mountDOM(text, document.body);

    expect(text.domPointer).toBeDefined();
    expect(text.domPointer).toBeInstanceOf(Text);
    expect(text.domPointer?.textContent).toBe("hello world");
    expect(document.body.innerHTML).toBe("hello world");
  });
});

describe("testing the mounting of fragment vdom", () => {
  test("if mounting a single fragment works", () => {
    const fragment = hFragment([
      hString("hello world"),
      h("h1", { class: "heading", name: "main-title" }, [
        hString("super cool"),
      ]),
    ]);

    mountDOM(fragment, document.body);

    expect(fragment.domPointer).toBeDefined();
    expect(fragment.domPointer).toBeInstanceOf(HTMLElement);
    expect(fragment.domPointer?.tagName.toLowerCase()).toBe("body");
    expect(document.body.innerHTML).toBe("hello world");
  });

  test("if mounting a multiple fragment works", () => {
    const fragment = hFragment([
      hFragment([
        hFragment([hString("super cool")]),
        hFragment([
          hString("hello world"),
          h("h1", { name: "main-title" }, [hString("super cool")]),
        ]),
      ]),
    ]);

    mountDOM(fragment, document.body);

    expect(fragment.domPointer).toBeDefined();
    expect(fragment.domPointer).toBeInstanceOf(HTMLElement);
    expect(fragment.domPointer?.tagName.toLowerCase()).toBe("body");
  });
});
