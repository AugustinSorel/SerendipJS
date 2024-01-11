import {
  removeAttribute,
  removeStyle,
  setAttribute,
  setStyle,
} from "./attributes";
import { destroyDom } from "./destroy-dom";
import { addEventListener } from "./events";
import { mountDOM } from "./mount-dom";
import { areNodesEqual } from "./nodes-equal";
import { arraysDiff, arraysDiffSequence } from "./arrays";
import { objectsDiff } from "./objects";
import { H, HFragment, HPortal, HString, VNodes, extractChildren } from "./h";

export function isNotEmptyString(str: string) {
  return str !== "";
}

export function isNotBlankOrEmptyString(str: string) {
  return isNotEmptyString(str.trim());
}

export function patchDom(
  oldVdom: VNodes,
  newVdom: VNodes,
  parentEl: HTMLElement,
) {
  if (!areNodesEqual(oldVdom, newVdom)) {
    if (!oldVdom.domPointer) {
      throw new Error("dom pointer cannot be undefinied");
    }

    const index = findIndexInParent(parentEl, oldVdom.domPointer);
    destroyDom(oldVdom);
    mountDOM(newVdom, parentEl, index == null ? undefined : index);

    return newVdom;
  }

  newVdom.domPointer = oldVdom.domPointer;

  if (newVdom.type === "text" && oldVdom.type === "text") {
    patchText(oldVdom, newVdom);
    return newVdom;
  }

  if (newVdom.type === "element" && oldVdom.type === "element") {
    patchElement(oldVdom, newVdom);
  }

  patchChildren(oldVdom as HFragment, newVdom as HFragment);

  return newVdom;
}

function findIndexInParent(parentEl: HTMLElement, el: HTMLElement | Text) {
  const index = Array.from(parentEl.childNodes).indexOf(el);

  if (index < 0) {
    return null;
  }

  return index;
}

function patchText(oldVdom: HString, newVdom: HString) {
  const el = oldVdom.domPointer;
  const { value: oldText } = oldVdom;
  const { value: newText } = newVdom;

  if (!el) {
    throw new Error("parentel cannot be undefined");
  }

  if (oldText !== newText) {
    el.nodeValue = newText;
  }
}

function patchElement(oldVdom: H, newVdom: H) {
  const el = oldVdom.domPointer;
  const {
    class: oldClass,
    style: oldStyle,
    on: oldEvents,
    ...oldAttrs
  } = oldVdom.props;
  const {
    class: newClass,
    style: newStyle,
    on: newEvents,
    ...newAttrs
  } = newVdom.props;
  const { listeners: oldListeners } = oldVdom;

  if (!el) {
    throw new Error("el cannot be undefined");
  }

  patchAttrs(el, oldAttrs, newAttrs);
  patchClasses(el, oldClass, newClass);
  patchStyles(el, oldStyle, newStyle);
  newVdom.listeners = patchEvents(el, oldListeners, oldEvents, newEvents);
}

function patchAttrs(
  el: HTMLElement,
  oldAttrs: Record<string, any>,
  newAttrs: Record<string, any>,
) {
  const { added, removed, updated } = objectsDiff(oldAttrs, newAttrs);

  for (const attr of removed) {
    removeAttribute(el, attr);
  }

  for (const attr of added.concat(updated)) {
    setAttribute(el, attr, newAttrs[attr]);
  }
}

function patchClasses(
  el: HTMLElement,
  oldClass: string | string[],
  newClass: string | string[],
) {
  const oldClasses = toClassList(oldClass);
  const newClasses = toClassList(newClass);

  const { added, removed } = arraysDiff(oldClasses, newClasses);

  if (removed.length > 0) {
    el.classList.remove(...removed);
  }
  if (added.length > 0) {
    el.classList.add(...added);
  }
}

function toClassList(classes: string | string[] = "") {
  return Array.isArray(classes)
    ? classes.filter(isNotBlankOrEmptyString)
    : classes.split(/(\s+)/).filter(isNotBlankOrEmptyString);
}

function patchStyles(
  el: HTMLElement,
  oldStyle: Record<string, any> = {},
  newStyle: Record<string, any> = {},
) {
  const { added, removed, updated } = objectsDiff(oldStyle, newStyle);

  for (const style of removed) {
    removeStyle(el, style);
  }

  for (const style of added.concat(updated)) {
    setStyle(el, style, newStyle[style]);
  }
}

function patchEvents(
  el: HTMLElement,
  oldListeners: Record<string, any> = {},
  oldEvents: Record<string, any> = {},
  newEvents: Record<string, any> = {},
) {
  const { removed, added, updated } = objectsDiff(oldEvents, newEvents);

  for (const eventName of removed.concat(updated)) {
    el.removeEventListener(eventName, oldListeners[eventName]);
  }

  const addedListeners: Record<string, any> = {};

  for (const eventName of added.concat(updated)) {
    const listener = addEventListener(eventName, newEvents[eventName], el);
    addedListeners[eventName] = listener;
  }

  return addedListeners;
}

function patchChildren(
  oldVdom: H | HFragment | HPortal,
  newVdom: H | HFragment | HPortal,
) {
  const oldChildren = extractChildren(oldVdom);
  const newChildren = extractChildren(newVdom);
  const parentEl = oldVdom.domPointer;

  const diffSeq = arraysDiffSequence(oldChildren, newChildren, areNodesEqual);

  if (!parentEl) {
    throw new Error("dom pointer cannot be undefinied");
  }

  for (const operation of diffSeq) {
    const { index, item } = operation;

    switch (operation.op) {
      case "add": {
        mountDOM(item, parentEl, index);
        break;
      }

      case "remove": {
        destroyDom(item);
        break;
      }

      case "move": {
        const oldChild = oldChildren[operation.originalIndex];
        const newChild = newChildren[index];
        const el = oldChild.domPointer;
        const elAtTargetIndex = parentEl.childNodes[index];

        if (!el) {
          throw new Error("el cannot be undefinied");
        }

        parentEl.insertBefore(el, elAtTargetIndex);
        patchDom(oldChild, newChild, parentEl);

        break;
      }

      case "noop": {
        patchDom(
          oldChildren[operation.originalIndex],
          newChildren[index],
          parentEl,
        );
        break;
      }
    }
  }
}
