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
