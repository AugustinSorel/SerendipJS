import { setAttributes } from "./attributes";
import { addEventListeners } from "./events";
import { HString, VNodes, H, HFragment } from "./h";

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
    createElementNode(vdom, parentEl);
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

const createElementNode = (vdom: H, parentEl: HTMLElement) => {
  const { tagName, props, children } = vdom;
  const { on: events, ...attrs } = props;

  const element = document.createElement(tagName);

  vdom.listeners = addEventListeners(events ?? {}, element);
  setAttributes(element, attrs);

  vdom.domPointer = element;

  for (const child of children) {
    mountDOM(child, element);
  }

  parentEl.append(element);
};
