import { createApp, h, hString, Reducer, View } from "SerendipJS";
import "./index.css";

const state = { count: 0 };

const View: View<typeof state> = (state, emit) => {
  return h("main", { class: "main-container" }, [
    h(
      "button",
      {
        class: "btn text-massive tooltip",
        "data-tooltip": "decrement",
        on: { click: () => emit("sub") },
      },
      [hString("-")],
    ),
    h("span", { class: "text-massive truncate" }, [
      hString(state.count.toString()),
    ]),
    h(
      "button",
      {
        class: "btn text-massive tooltip",
        "data-tooltip": "increment",
        on: { click: () => emit("add", 100) },
      },
      [hString("+")],
    ),
  ]);
};

const reducers: Reducer<typeof state> = {
  add: (state) => ({ count: state.count + 1 }),
  sub: (state) => ({ count: state.count - 1 }),
};

createApp({ state, view: View, reducers }).mount(
  document.getElementById("app")!,
);
