import { destroyDom } from "./destroy-dom";
import { Dispatcher } from "./dispatcher";
import { VNodes } from "./h";
import { mountDOM } from "./mount-dom";

type Props = {
  state: any;
  view: (state: any, emit: any) => VNodes;
  reducers: Record<string, Function>;
};

export function createApp({ state, view, reducers }: Props) {
  let parentEl: HTMLElement | null = null;
  let vdom: VNodes | null = null;

  const dispatcher = new Dispatcher();

  const emit = (eventName: string, payload: any) => {
    dispatcher.dispatch(eventName, payload);
  };

  const renderApp = () => {
    if (vdom) {
      destroyDom(vdom);
    }

    vdom = view(state, emit);

    if (vdom && parentEl) {
      mountDOM(vdom, parentEl);
    }
  };

  const subscriptions = [dispatcher.afterEveryCommand(renderApp)];

  for (const actionName in reducers) {
    const reducer = reducers[actionName];
    const subs = dispatcher.subscribe(actionName, (payload: any) => {
      state = reducer(state, payload);
    });
    subscriptions.push(subs);
  }

  return {
    mount: (_parentEl: HTMLElement) => {
      parentEl = _parentEl;
      renderApp();
    },

    unmount: () => {
      if (vdom) {
        destroyDom(vdom);
      }

      vdom = null;

      for (const subscription of subscriptions) {
        subscription();
      }
    },
  };
}
