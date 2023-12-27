import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountDOM } from "../src/mount-dom";
import { h, hFragment, hString } from "../src/h";

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
    expect(document.body.innerHTML).toBe(
      'hello world<h1 class="heading" name="main-title">super cool</h1>',
    );
  });

  test("if mounting a multiple fragment works", () => {
    const fragment = hFragment([
      hFragment([
        hFragment([hString("super cool")]),
        hFragment([
          hString("hello world"),
          h(
            "h1",
            { name: "main-title", class: "heading", "data-status": "error" },
            [hString("super cool")],
          ),
        ]),
      ]),
    ]);

    mountDOM(fragment, document.body);

    expect(fragment.domPointer).toBeDefined();
    expect(fragment.domPointer).toBeInstanceOf(HTMLElement);
    expect(fragment.domPointer?.tagName.toLowerCase()).toBe("body");
    expect(document.body.innerHTML).toBe(
      'super coolhello world<h1 class="heading" name="main-title" data-status="error">super cool</h1>',
    );
  });
});

describe("testing the mounting of an element vdom", () => {
  test("if mounting a single element works", () => {
    const clickHandler = vi.fn();

    const header = h(
      "header",
      {
        class: "heading",
        id: "main-heading",
        "data-status": "success",
      },
      [
        h("span", {}, [hString("hello world")]),
        h("button", { id: "btn", on: { click: clickHandler } }, [
          hString("click me"),
        ]),
        h("label", { class: "label-style", for: "status-checkbox" }, [
          hString("hello world"),
        ]),
      ],
    );

    mountDOM(header, document.body);

    const $btn = document.getElementById("btn")!;
    $btn.click();

    expect(header.domPointer).toBeDefined();
    expect(header.domPointer).toBeInstanceOf(HTMLElement);
    expect(header.domPointer?.tagName.toLowerCase()).toBe("header");
    expect(document.body.innerHTML).toBe(
      '<header class="heading" id="main-heading" data-status="success"><span>hello world</span><button id="btn">click me</button><label class="label-style" for="status-checkbox">hello world</label></header>',
    );
    expect(clickHandler).toHaveBeenCalledOnce();
  });
});
