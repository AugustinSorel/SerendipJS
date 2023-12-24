import { describe, expect, test } from "vitest";
import { mountDOM } from "../src/mount-dom";
import { hString } from "../src/h";

describe("testing the mounting of string vdom", () => {
  test("if mount a string vnode is working properly", () => {
    const text = hString("hello world");

    mountDOM(text, document.body);

    expect(text.domPointer).toBeDefined();
    expect(text.domPointer).toBeInstanceOf(Text);
    expect(text.domPointer?.textContent).toBe("hello world");
    expect(document.body.innerHTML).toBe("hello world");
  });
});
