import { describe, test, expect } from "vitest";
import { objectsDiff } from "../src/objects";
import { arraysDiff } from "../src/arrays";

describe("testing the objectsDiff fn", () => {
  test("that the added property is correct", () => {
    const candidateOutput = objectsDiff(
      { super: "cool" },
      { super: "cool", hello: "world" },
    );

    const correctOutput: ReturnType<typeof objectsDiff> = {
      added: ["hello"],
      removed: [],
      updated: [],
    };

    expect(candidateOutput).toStrictEqual(correctOutput);
  });

  test("that the removed property is correct", () => {
    const candidateOutput = objectsDiff(
      { super: "cool", hello: "world" },
      { super: "cool" },
    );

    const correctOutput: ReturnType<typeof objectsDiff> = {
      added: [],
      removed: ["hello"],
      updated: [],
    };

    expect(candidateOutput).toStrictEqual(correctOutput);
  });

  test("that the updated property is correct", () => {
    const candidateOutput = objectsDiff(
      { super: "cool", hello: "world" },
      { super: "cool", hello: "noce" },
    );

    const correctOutput: ReturnType<typeof objectsDiff> = {
      added: [],
      removed: [],
      updated: ["hello"],
    };

    expect(candidateOutput).toStrictEqual(correctOutput);
  });

  test("that all properties work together correctly", () => {
    const candidateOutput = objectsDiff(
      { super: "cool", hello: "world" },
      { hello: "noce", ok: "see" },
    );

    const correctOutput: ReturnType<typeof objectsDiff> = {
      added: ["ok"],
      removed: ["super"],
      updated: ["hello"],
    };

    expect(candidateOutput).toStrictEqual(correctOutput);
  });
});

describe("testing the arraysDiff", () => {
  test("that all the added property works correctly", () => {
    const candidateOutput = arraysDiff(["a", "b"], ["a", "1", "b"]);

    const correctOutput: ReturnType<typeof arraysDiff> = {
      added: ["1"],
      removed: [],
    };

    expect(candidateOutput).toStrictEqual(correctOutput);
  });

  test("that all the removed property works correctly", () => {
    const candidateOutput = arraysDiff(["a", "1", "b"], ["a", "b"]);

    const correctOutput: ReturnType<typeof arraysDiff> = {
      added: [],
      removed: ["1"],
    };

    expect(candidateOutput).toStrictEqual(correctOutput);
  });

  test("that all properties works correctly together", () => {
    const candidateOutput = arraysDiff(
      ["a", "1", "b", "2"],
      ["d", "a", "b", "c"],
    );

    const correctOutput: ReturnType<typeof arraysDiff> = {
      added: ["d", "c"],
      removed: ["1", "2"],
    };

    expect(candidateOutput).toStrictEqual(correctOutput);
  });
});
