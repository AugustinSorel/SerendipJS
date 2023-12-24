import type { HString, VNodes } from "./h";

export const mountDOM = (vdom: VNodes, parentEl: HTMLElement) => {
  if (vdom.type === "text") {
    createTextNode(vdom, parentEl);
    return;
  }

  if (vdom.type === "fragment") {
  }

  if (vdom.type === "element") {
  }

  throw new Error(`vdom type: ${vdom.type} is not being handle`);
};

const createTextNode = (vdom: HString, parentEl: HTMLElement) => {
  const textNode = document.createTextNode(vdom.value);

  vdom.domPointer = textNode;

  parentEl.append(textNode);
};
