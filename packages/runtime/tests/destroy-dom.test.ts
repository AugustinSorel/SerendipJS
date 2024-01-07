import { beforeEach, describe, expect, test } from "vitest";
import { destroyDom } from "../src/destroy-dom";
import { h, hFragment, hPortal, hString } from "../src/h";
import { mountDOM } from "../src/mount-dom";

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("testing the destruction of a string node", () => {
  test("the destruction of a single string node", () => {
    const title = hString("hello world");

    mountDOM(title, document.body);

    destroyDom(title);

    expect(document.body.innerHTML).toBe("");
    expect(title.domPointer).not.toBeDefined();
  });
});

describe("testing the destruction of an element node", () => {
  test("the destruction of a single element node", () => {
    const title = h("h1");

    mountDOM(title, document.body);

    destroyDom(title);

    expect(document.body.innerHTML).toBe("");
    expect(title.domPointer).not.toBeDefined();
  });

  test("the destruction of a nested elementn node", () => {
    const title = h("h1", {}, [h("span", {}, [hString("hello world")])]);

    mountDOM(title, document.body);

    destroyDom(title);

    expect(document.body.innerHTML).toBe("");
    expect(title.domPointer).not.toBeDefined();
    expect(title.children[0].domPointer).not.toBeDefined();
  });
});

describe("testing the destruction of a fragment node", () => {
  test("the destruction of a single fragment", () => {
    const app = hFragment([
      h("h1", {}, [hString("hello world")]),
      h("h2", {}, [hString("super cool")]),
    ]);

    mountDOM(app, document.body);

    destroyDom(app);

    expect(document.body.innerHTML).toBe("");
    expect(app.domPointer).not.toBeDefined();
  });

  test("the destruction of nested fragment", () => {
    const app = hFragment([
      hFragment([
        hFragment([
          h("h1", {}, [hString("hello world")]),
          h("h2", {}, [hString("super cool")]),
        ]),
      ]),

      hFragment([
        h("h3", {}, [hString("hello world")]),
        h("h4", {}, [hString("super cool")]),
      ]),
    ]);

    mountDOM(app, document.body);

    destroyDom(app);

    expect(document.body.innerHTML).toBe("");
    expect(app.domPointer).not.toBeDefined();
  });
});

describe("testing the destruction of a hPortal node", () => {
  test("the destruction of a hPortal", () => {
    const header = h("header", {}, [
      h("h1", {}, [
        hString("my header"),
        hPortal(
          h("button", { class: "btn" }, [hString("portal string")]),
          document.body,
        ),
      ]),
    ]);

    mountDOM(header, document.body);

    destroyDom(header);

    expect(document.body.innerHTML).toBe("");
    expect(header.domPointer).not.toBeDefined();
    expect(header.children.length).toBe(1);
  });

  test("the destruction of a hPortal with a vdom of null", () => {
    const header = h("header", {}, [
      h("h1", {}, [hString("my header"), hPortal(null, document.body)]),
    ]);

    mountDOM(header, document.body);

    destroyDom(header);

    expect(document.body.innerHTML).toBe("");
    expect(header.domPointer).not.toBeDefined();
    expect(header.children.length).toBe(1);
  });
});
