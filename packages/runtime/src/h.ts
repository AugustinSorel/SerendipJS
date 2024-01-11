import { removeNull } from "./arrays";

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

export type HPortal = {
  type: "portal";

  children: VNodes[];
  domPointer: HTMLElement;
};

export type VNodes = H | HString | HFragment | HPortal;

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
  children?: (VNodes | null)[],
): H => {
  return {
    type: "element",
    tagName,
    props: props ?? {},
    children: children?.filter(removeNull) ?? [],
  };
};

export const hString = (value: HString["value"]): HString => {
  return {
    type: "text",
    value,
  };
};

export const hFragment = (children: (VNodes | null)[]): HFragment => {
  return {
    type: "fragment",
    children: children.filter(removeNull),
  };
};

export const hPortal = (
  children: H | HString | null,
  targetEl: HTMLElement,
): HPortal => {
  return {
    type: "portal",
    children: [children].filter(removeNull),
    domPointer: targetEl,
  };
};

export function extractChildren(vdom: HFragment | HPortal | H) {
  if (vdom.children == null) {
    return [];
  }

  const children: VNodes[] = [];

  for (const child of vdom.children) {
    if (child.type === "fragment") {
      children.push(...extractChildren(child));
    } else {
      children.push(child);
    }
  }

  return children;
}
