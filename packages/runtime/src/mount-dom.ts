import { setAttributes } from "./attributes";
import { addEventListeners } from "./events";
import { HString, VNodes, H, HFragment } from "./h";

export const mountDOM = (
  vdom: VNodes,
  parentEl: HTMLElement,
  index?: number,
) => {
  if (vdom.type === "text") {
    createTextNode(vdom, parentEl, index);
    return;
  }

  if (vdom.type === "fragment") {
    createFragmentNode(vdom, parentEl, index);
    return;
  }

  if (vdom.type === "element") {
    createElementNode(vdom, parentEl, index);
    return;
  }

  if (vdom.type === "portal") {
    vdom.children.forEach((children, i) => {
      mountDOM(children, parentEl, index ? index + i : undefined);
    });
    return;
  }

  throw new Error(`vdom type: ${JSON.stringify(vdom)} is not being handle`);
};

const createTextNode = (
  vdom: HString,
  parentEl: HTMLElement,
  index?: number,
) => {
  const textNode = document.createTextNode(vdom.value);

  vdom.domPointer = textNode;

  insert(textNode, parentEl, index);
};

const createFragmentNode = (
  vdom: HFragment,
  parentEl: HTMLElement,
  index?: number,
) => {
  vdom.domPointer = parentEl;

  vdom.children.forEach((children, i) => {
    mountDOM(children, parentEl, index ? index + i : undefined);
  });
};

const createElementNode = (vdom: H, parentEl: HTMLElement, index?: number) => {
  const { tagName, props, children } = vdom;
  const { on: events, ...attrs } = props;

  const element = document.createElement(tagName);

  vdom.listeners = addEventListeners(events ?? {}, element);
  setAttributes(element, attrs);

  vdom.domPointer = element;

  for (const child of children) {
    mountDOM(child, element);
  }

  insert(element, parentEl, index);
};

export const insert = (
  el: HTMLElement | Text,
  parentEl: HTMLElement,
  index?: number,
) => {
  if (index == null) {
    parentEl.append(el);
    return;
  }

  if (index < 0) {
    throw new Error(`Index must be a positive integer, got ${index}`);
  }

  const children = parentEl.childNodes;

  if (index >= children.length) {
    parentEl.append(el);
  } else {
    parentEl.insertBefore(el, children[index]);
  }
};
