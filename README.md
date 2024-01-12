# SerendipJS

> [!CAUTION]
> This framework should not be use in production as this is a learning project.

## Counter app Example

### Defining  the state

```ts
const state = { count: 0 };
```

### Defining the actions
```tsx
const reducers = {
  add: (state) => ({ count: state.count + 1 }),
  sub: (state) => ({ count: state.count - 1 }),
} satisfies Reducers<typeof state>;
```

### Defining the view

```ts
const View: View<typeof state, typeof reducers> = (state, emit) => {
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
        on: { click: () => emit("add") },
      },
      [hString("+")],
    ),
  ]);
};
```

### Mounting the app
```ts
createApp({ state, view: View, reducers }).mount(
  document.getElementById("app")!,
)```

## TODOS

- [ ] syntatic sugar in jsx (for loop, if stmt...)
- [ ] jsx
- [ ] error boundaries
- [ ] component fn
- [x] diffing algorithm
- [x] add portal virtual nodes
- [x] rerender node on state changes
- [x] add state
- [x] Mounting vnode to dom
- [x] Create virtual nodes
