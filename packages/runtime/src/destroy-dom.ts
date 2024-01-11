import { removeEventListeners } from "./events";
import { H, HFragment, HString, VNodes, HPortal } from "./h";

export const destroyDom = (vdom: VNodes) => {
  if (vdom.type === "text") {
    destroyTextNode(vdom);
    return;
  }

  if (vdom.type === "element") {
    destroyElement(vdom);
    return;
  }

  if (vdom.type === "fragment") {
    destroyFragmentNode(vdom);
    return;
  }

  if (vdom.type === "portal") {
    destroyPortalNode(vdom);
    return;
  }

  throw new Error(`vdom type: ${vdom} is not being handle`);
};

const destroyTextNode = (textNode: HString) => {
  textNode.domPointer?.remove();

  delete textNode.domPointer;
};

const destroyElement = (elementNode: H) => {
  elementNode.domPointer?.remove();

  for (const children of elementNode.children) {
    destroyDom(children);
  }

  if (elementNode.listeners && elementNode.domPointer) {
    removeEventListeners(elementNode.listeners, elementNode.domPointer);
    delete elementNode.listeners;
  }

  delete elementNode.domPointer;
};

const destroyFragmentNode = (fragmentNode: HFragment) => {
  for (const children of fragmentNode.children) {
    destroyDom(children);
  }

  delete fragmentNode.domPointer;
};

const destroyPortalNode = (portalNode: HPortal) => {
  for (const children of portalNode.children) {
    destroyDom(children);
  }
};
