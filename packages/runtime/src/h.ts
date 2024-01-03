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

type On<TOn extends Record<keyof HTMLElementEventMap, Function>> = {
  [Key in keyof TOn]: Key extends keyof HTMLElementEventMap
    ? Parameters<typeof document.addEventListener<Key>>[1]
    : never;
};

export const h = <TOn extends Record<keyof HTMLElementEventMap, Function>>(
  tagName: H["tagName"],
  props?: Record<string, any> & {
    on?: Partial<On<TOn>>;
  },
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
