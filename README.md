# SerendipJS
Attempt to write a frontend framework from scratchas a learning opportunity

> [!Important]
> This project has a lot of missing parts/features as this as this is learning project

## Features
* Diffing and patching Algorithm for minimal re render 
* Vdom tree with 4 nodes (portal, element, string and fragment)
* Full typescript support

## Counter app Example

### Defining  the state

```ts
const state = { count: 0 };
```

### Defining the actions
```ts
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
)
```

### Ouput
![2024-01-01 17-26-54 (online-video-cutter com)](https://github.com/AugustinSorel/SerendipJS/assets/48162609/ed9f7e42-c710-4f93-a453-0da159eb381a)

## Project structur
* `/packages/runtime`: core library
* `/example/counter`: counter app example
* `/example/todo`: todo app example

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
