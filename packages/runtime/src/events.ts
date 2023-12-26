import { H } from "./h";

export const addEventListener = (
  eventName: keyof HTMLElementEventMap,
  handler: Parameters<HTMLElement["addEventListener"]>[1],
  el: HTMLElement,
) => {
  el.addEventListener(eventName, handler);

  return handler;
};

export const addEventListeners = (
  listeners: NonNullable<H["listeners"]>,
  el: HTMLElement,
) => {
  return Object.entries(listeners).reduce((acc, [eventName, handler]) => {
    const listener = addEventListener(
      eventName as keyof HTMLElementEventMap,
      handler,
      el,
    );

    return { ...acc, [eventName]: listener };
  }, {});
};

export const removeEventListeners = (
  listeners: NonNullable<H["listeners"]>,
  el: HTMLElement,
) => {
  for (const [eventName, handler] of Object.entries(listeners)) {
    el.removeEventListener(eventName, handler);
  }
};
