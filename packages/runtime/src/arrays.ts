export const arraysDiff = <T extends any[], K extends any[]>(
  oldArray: T,
  newArray: K,
) => {
  return {
    added: newArray.filter((newItem) => !oldArray.includes(newItem)),
    removed: oldArray.filter((oldItem) => !newArray.includes(oldItem)),
  };
};

export const removeNull = <TValue,>(value: TValue | null): value is TValue => {
  return value !== null;
};

type RemoveOperation = {
  op: "remove";
  index: number;
  item: any;
};

type NoopOperation = {
  op: "noop";
  index: number;
  originalIndex: number;
  item: any;
};

type AddOperation = {
  op: "add";
  index: number;
  item: any;
};

type MoveOperation = {
  op: "move";
  index: number;
  from: number;
  originalIndex: number;
  item: any;
};

export type Operation =
  | RemoveOperation
  | NoopOperation
  | AddOperation
  | MoveOperation;

export class ArrayWithOriginalIndices {
  private array: any[] = ["idk"];
  private originalIndices: number[] = [];
  private equalsFn: Function;

  public constructor(array: any[], equalsFn: Function) {
    this.array = array;
    this.originalIndices = array.map((_, i) => i);
    this.equalsFn = equalsFn;
  }

  public isRemoval = (index: number, newArray: any[]) => {
    if (index < 0 || index >= this.length) {
      return false;
    }

    const item = this.array[index];
    const indexInNewArray = newArray.findIndex((newItem) =>
      this.equalsFn(item, newItem),
    );

    return indexInNewArray === -1;
  };

  public removeItem = (index: number) => {
    const operation: RemoveOperation = {
      op: "remove",
      index,
      item: this.array[index],
    };

    this.array.splice(index, 1);
    this.originalIndices.splice(index, 1);

    return operation;
  };

  public isNoop = (index: number, newArray: any[]) => {
    if (index < 0 || index >= this.length) {
      return false;
    }

    const item = this.array[index];
    const newItem = newArray[index];

    return this.equalsFn(item, newItem);
  };

  public originalIndexAt = (index: number) => {
    return this.originalIndices[index];
  };

  public noopItem = (index: number) => {
    const operation: NoopOperation = {
      op: "noop",
      index,
      originalIndex: this.originalIndexAt(index),
      item: this.array[index],
    };

    return operation;
  };

  public isAddition = (item: any, fromIdx: number) => {
    return this.findIndexFrom(item, fromIdx) === -1;
  };

  public findIndexFrom = (item: any, fromIndex: number) => {
    for (let i = fromIndex; i < this.length; ++i) {
      if (this.equalsFn(item, this.array[i])) {
        return i;
      }
    }

    return -1;
  };

  public addItem = (item: any, index: number) => {
    const operation: AddOperation = {
      op: "add",
      index,
      item,
    };

    this.array.splice(index, 0, item);
    this.originalIndices.splice(index, 0, -1);

    return operation;
  };

  public moveItem = (item: any, toIndex: number) => {
    const fromIndex = this.findIndexFrom(item, toIndex);

    const operation: MoveOperation = {
      op: "move",
      originalIndex: this.originalIndexAt(fromIndex),
      from: fromIndex,
      index: toIndex,
      item: this.array[fromIndex],
    };

    const [_item] = this.array.splice(fromIndex, 1);
    this.array.splice(toIndex, 0, _item);

    const [originalIndex] = this.originalIndices.splice(fromIndex, 1);
    this.originalIndices.splice(toIndex, 0, originalIndex);

    return operation;
  };

  public removeItemsAfter = (index: number) => {
    const operations: Operation[] = [];

    while (this.length > index) {
      operations.push(this.removeItem(index));
    }

    return operations;
  };

  public get length() {
    return this.array.length;
  }
}

export const arraysDiffSequence = (
  oldArray: any[],
  newArray: any[],
  equalsFn: Function = (a: string, b: string) => a === b,
) => {
  const sequences: Operation[] = [];
  const array = new ArrayWithOriginalIndices(oldArray, equalsFn);

  for (let index = 0; index < newArray.length; ++index) {
    if (array.isRemoval(index, newArray)) {
      sequences.push(array.removeItem(index));
      index--;
      continue;
    }

    if (array.isNoop(index, newArray)) {
      sequences.push(array.noopItem(index));
      continue;
    }

    const item = newArray[index];

    if (array.isAddition(item, index)) {
      sequences.push(array.addItem(item, index));
      continue;
    }

    sequences.push(array.moveItem(item, index));
  }

  sequences.push(...array.removeItemsAfter(newArray.length));

  return sequences;
};
