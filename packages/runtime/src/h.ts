export type H = {
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

export type VNodes = H | HString | HFragment;

export const h = (
  tagName: H["tagName"],
  props?: H["props"],
  children?: H["children"],
): H => {
  return {
    type: "element",
    tagName,
    props: props ?? {},
    children: children ?? [],
  };
};

export const hString = (value: HString["value"]): HString => {
  return {
    type: "text",
    value,
  };
};

export const hFragment = (children: HFragment["children"]): HFragment => {
  return {
    type: "fragment",
    children,
  };
};
