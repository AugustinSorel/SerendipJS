import { addEventListeners } from "./events";
import type { H, HFragment, HString, VNodes } from "./h";

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
  const element = document.createElement(vdom.tagName);

  vdom.listeners = addEventListeners(vdom.props.on ?? {}, parentEl);
  vdom.domPointer = element;

  const { class: className, style, ...otherProps } = vdom.props;

  if (className) {
    setClass(element, className);
  }

  if (style) {
    for (const [prop, value] of Object.entries(style)) {
      setStyle(element, prop, value);
    }
  }

  for (const [name, value] of Object.entries(otherProps)) {
    setAttribute(element, name, value);
  }

  for (const children of vdom.children) {
    mountDOM(children, element);
  }

  parentEl.append(element);
};

const setClass = (element: HTMLElement, className: string | string[]) => {
  element.className = "";

  if (typeof className === "string") {
    element.className = className;
  }

  if (Array.isArray(className)) {
    element.classList.add(...className);
  }
};

const setStyle = (element: HTMLElement, prop: string, value: any) => {
  //@ts-ignore
  element.style[prop] = value;
};

const removeStyle = (element: HTMLElement, name: string) => {
  //@ts-ignore
  element.style[name] = null;
};

const setAttribute = (element: HTMLElement, name: string, value: any) => {
  if (!value) {
    removeAttribute(element, name);
  } else if (name.startsWith("data-")) {
    element.setAttribute(name, value);
  } else {
    //@ts-ignore
    element[name] = value;
  }
};

const removeAttribute = (element: HTMLElement, name: string) => {
  //@ts-ignore
  element[name] = null;
  element.removeAttribute(name);
};
