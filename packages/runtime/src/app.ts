import { destroyDom } from "./destroy-dom";
import { Dispatcher } from "./dispatcher";
import { VNodes } from "./h";
import { mountDOM } from "./mount-dom";

export type Reducers<TState> = Record<
  string,
  (state: TState, payload?: any) => TState
>;

type RemoveFirst<T extends unknown[]> = T extends [unknown, ...infer R]
  ? R
  : never;

export type Emit<TReducers extends Reducers<any>> = (
  ...args: {
    [K in keyof TReducers]: [
      key: K,
      ...payload: RemoveFirst<Parameters<TReducers[K]>>,
    ];
  }[keyof TReducers]
) => void;

export type View<TState, TReducers extends Reducers<TState>> = (
  state: TState,
  emit: Emit<TReducers>,
) => VNodes;

type Props<TState, TReducers extends Reducers<TState>> = {
  state: TState;
  view: View<TState, TReducers>;
  reducers: TReducers;
};

export const createApp = <TState, TReducers extends Reducers<TState>>({
  state,
  view,
  reducers,
}: Props<TState, TReducers>) => {
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

    vdom = view(state, emit as Emit<any>);

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

//TODO: find something cleaner instead of satifies
