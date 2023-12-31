export function setAttributes(el: HTMLElement, attrs: any) {
  const { class: className, style, ...otherAttrs } = attrs;

  delete otherAttrs.key;

  if (className) {
    setClass(el, className);
  }

  if (style) {
    Object.entries(style).forEach(([prop, value]) => {
      setStyle(el, prop, value);
    });
  }

  for (const [name, value] of Object.entries(otherAttrs)) {
    setAttribute(el, name, value);
  }
}

export function setAttribute(el: HTMLElement, name: string, value: any) {
  if (!value) {
    removeAttribute(el, name);
  } else {
    el.setAttribute(name, value);
  }
}

export function removeAttribute(el: HTMLElement, name: string) {
  try {
    //@ts-expect-error
    el[name] = null;
  } catch {
    console.warn(`Failed to set "${name}" to null on ${el.tagName}`);
  }

  el.removeAttribute(name);
}

export function setStyle(el: HTMLElement, name: any, value: any) {
  el.style[name] = value;
}

export function removeStyle(el: HTMLElement, name: string) {
  //@ts-expect-error
  el.style[name] = null;
}

function setClass(el: HTMLElement, className: string | string[]) {
  el.className = "";

  if (typeof className === "string") {
    el.className = className;
  }

  if (Array.isArray(className)) {
    el.classList.add(...className);
  }
}
