export type H = {
  type: "element";
  tagName: keyof HTMLElementTagNameMap;
  props: Record<string, any> & {
    on?: Record<string, any>;
  };
  children: VNodes[];

  domPointer?: HTMLElement;
  listeners?: Record<string, any>;
};

export type HString = {
  type: "text";
  value: string;

  domPointer?: Text;
};

export type HFragment = {
  type: "fragment";
  children: VNodes[];

  domPointer?: HTMLElement;
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
