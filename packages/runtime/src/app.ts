import { destroyDom } from "./destroy-dom";
import { Dispatcher } from "./dispatcher";
import { VNodes } from "./h";
import { mountDOM } from "./mount-dom";

export type Reducer<TState> = Record<
  string,
  (state: TState, payload?: any) => TState
>;

export type View<TState> = (
  state: TState,
  emit: <TPayload = unknown>(name: string, payload?: TPayload) => void,
) => VNodes;

type Props<TState, TReducers extends Reducer<TState>> = {
  state: TState;
  view: View<TState>;
  reducers: TReducers;
};

export const createApp = <TState, TReducers extends Reducer<TState>>({
  state,
  view,
  reducers,
}: Props<TState, TReducers>) => {
  let parentEl: HTMLElement | null = null;
  let vdom: VNodes | null = null;

  const dispatcher = new Dispatcher();

  const emit = <TPayload extends unknown>(
    eventName: string,
    payload?: TPayload,
  ) => {
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
};
