import { destroyDom } from "./destroy-dom";
import { Dispatcher } from "./dispatcher";
import { VNodes } from "./h";
import { mountDOM } from "./mount-dom";

export type Reducers<TState> = Record<
  string,
  (state: TState, payload?: any) => TState
>;

export type Emit<TReducers extends Reducers<any>> = <
  TKey extends keyof TReducers,
>(
  key: TKey,
  payload?: Parameters<TReducers[TKey]>[1],
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

  const emit: Emit<TReducers> = (eventName, payload) => {
    dispatcher.dispatch(eventName as string, payload);
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

//TODO: make emit 2nd parameter trully optional
//TODO: find something cleaner instead of satifies
