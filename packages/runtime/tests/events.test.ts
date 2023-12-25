import { describe, expect, test, vi } from "vitest";
import { addEventListener } from "../src/events";

describe("testing the addEventListener", () => {
  test("if event is being called correctly", () => {
    const btn = document.createElement("button");
    const fn = vi.fn();
    const argument = { hello: "world" };

    addEventListener("click", fn(argument), btn);
    btn.click();

    expect(fn).toHaveBeenCalledWith(argument);
    expect(fn).toHaveBeenCalledOnce();
  });
});
