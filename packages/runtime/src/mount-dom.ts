import type { HFragment, HString, VNodes } from "./h";

export const mountDOM = (vdom: VNodes, parentEl: HTMLElement) => {
  if (vdom.type === "text") {
    createTextNode(vdom, parentEl);
    return;
  }

  if (vdom.type === "fragment") {
    createFragmentNode(vdom, parentEl);
    return;
  }

  if (vdom.type === "element") {
    return;
  }

  throw new Error(`vdom type: ${vdom} is not being handle`);
};

const createTextNode = (vdom: HString, parentEl: HTMLElement) => {
  const textNode = document.createTextNode(vdom.value);

  vdom.domPointer = textNode;

  parentEl.append(textNode);
};

const createFragmentNode = (vdom: HFragment, parentEl: HTMLElement) => {
  vdom.domPointer = parentEl;

  for (const children of vdom.children) {
    mountDOM(children, parentEl);
  }
};
