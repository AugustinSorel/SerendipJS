import { describe, test, expect } from "vitest";
import { arraysDiffSequence, Operation } from "../src/arrays";

describe("testing the remove operation", () => {
  test("the removing an item correctly", () => {
    const candidateOperations = arraysDiffSequence([1, 2, 3], [1, 2]);

    const correctOperations: Operation[] = [
      { op: "noop", item: 1, index: 0, originalIndex: 0 },
      { op: "noop", item: 2, index: 1, originalIndex: 1 },
      { op: "remove", item: 3, index: 2 },
    ];

    expect(candidateOperations).toStrictEqual(correctOperations);
  });

  test("the removing of mulitple items correctly", () => {
    const candidateOperations = arraysDiffSequence([1, 2, 3], [2]);

    const correctOperations: Operation[] = [
      { op: "remove", item: 1, index: 0 },
      { op: "noop", item: 2, index: 0, originalIndex: 1 },
      { op: "remove", item: 3, index: 1 },
    ];

    expect(candidateOperations).toStrictEqual(correctOperations);
  });
});

describe("testing the noop operation", () => {
  test("with the same item", () => {
    const candidateOperations = arraysDiffSequence([1, 2, 3], [1, 2, 3]);

    const correctOperations: Operation[] = [
      { op: "noop", item: 1, index: 0, originalIndex: 0 },
      { op: "noop", item: 2, index: 1, originalIndex: 1 },
      { op: "noop", item: 3, index: 2, originalIndex: 2 },
    ];

    expect(candidateOperations).toStrictEqual(correctOperations);
  });
});

describe("testing the add operation", () => {
  test("the add operation with one item", () => {
    const candidateOperations = arraysDiffSequence([1, 2, 3], [1, 2, 3, 10]);

    const correctOperations: Operation[] = [
      { op: "noop", item: 1, index: 0, originalIndex: 0 },
      { op: "noop", item: 2, index: 1, originalIndex: 1 },
      { op: "noop", item: 3, index: 2, originalIndex: 2 },
      { op: "add", item: 10, index: 3 },
    ];

    expect(candidateOperations).toStrictEqual(correctOperations);
  });

  test("the add operation with two items", () => {
    const candidateOperations = arraysDiffSequence(
      [1, 2, 3],
      [11, 1, 2, 3, 10],
    );

    const correctOperations: Operation[] = [
      { op: "add", item: 11, index: 0 },
      { op: "noop", item: 1, index: 1, originalIndex: 0 },
      { op: "noop", item: 2, index: 2, originalIndex: 1 },
      { op: "noop", item: 3, index: 3, originalIndex: 2 },
      { op: "add", item: 10, index: 4 },
    ];

    expect(candidateOperations).toStrictEqual(correctOperations);
  });
});

describe("testing the move operation", () => {
  test("the move operation with one item", () => {
    const candidateOperations = arraysDiffSequence([1, 2, 3], [1, 3, 2]);

    const correctOperations: Operation[] = [
      { op: "noop", item: 1, index: 0, originalIndex: 0 },
      { op: "move", item: 3, index: 1, originalIndex: 2, from: 2 },
      { op: "noop", item: 2, index: 2, originalIndex: 1 },
    ];

    expect(candidateOperations).toStrictEqual(correctOperations);
  });

  test("the move operation with mulitple items", () => {
    const candidateOperations = arraysDiffSequence([1, 2, 3], [3, 1, 2]);

    const correctOperations: Operation[] = [
      { op: "move", item: 3, index: 0, originalIndex: 2, from: 2 },
      { op: "noop", item: 1, index: 1, originalIndex: 0 },
      { op: "noop", item: 2, index: 2, originalIndex: 1 },
    ];

    expect(candidateOperations).toStrictEqual(correctOperations);
  });
});
