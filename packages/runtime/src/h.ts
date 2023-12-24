export type HElement = {
  type: "element";
  tagName: string;
  props: Record<string, any>;
  children: VNodes[];
};

export type HString = {
  type: "text";
  value: string;
};

export type HFragment = {
  type: "fragment";
  children: VNodes[];
};

export type VNodes = HElement | HString | HFragment;

export const h = (node: VNodes) => {
  return { ...node };
};
