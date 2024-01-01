import { Reducer, View, createApp, h, hFragment, hString } from "SerendipJS";
import "./index.css";
import { getTodos, saveTodos } from "./localStorage";

export type Todo = { id: number; title: string; isDone: boolean };

const todos = getTodos();

const header = h("header", { class: "main-header" }, [
  h("h1", { class: "main-title" }, [hString("todo list")]),
]);

//FIXME: create a type for emit
const newTodoForm = (emit: any) => {
  return h(
    "form",
    {
      class: "new-todo-form",
      on: {
        submit: (e) => {
          e.preventDefault();

          //FIXME: add zod
          const formData = new FormData(e.currentTarget);

          const todoTitle = formData.get("todo-title");

          emit("addNewTodo", todoTitle);
        },
      },
    },
    [
      h(
        "input",
        {
          type: "text",
          placeholder: "new todo...",
          class: "new-todo-input",
          name: "todo-title",
        },
        [],
      ),
      h("button", { class: "new-todo-submit-button", title: "add new todo" }, [
        hString("+"),
      ]),
    ],
  );
};

//FIXME: create a type for emit
const listOfTodos = (todos: Todo[], emit: any) => {
  return h(
    "ul",
    { class: "list-of-todos" },
    todos.map((todo) => {
      return h("li", { class: "todo-item" }, [
        h(
          "input",
          {
            id: `todo-status-${todo.id}`,
            class: "todo-item-checkbox",
            type: "checkbox",
            checked: todo.isDone,
            on: {
              //FIXME: get the correct type here
              //FIXME: autocomple of events here
              change: (e: any) => {
                if (e.currentTarget.checked) {
                  emit("markAsDone", todo.id);
                } else {
                  emit("removeMarkAsDone", todo.id);
                }
              },
            },
          },
          [],
        ),
        h(
          "label",
          { class: "todo-item-title", for: `todo-status-${todo.id}` },
          [hString(todo.title)],
        ),
        h("button", { title: "edit", class: "todo-item-edit-button" }, [
          hString("e"),
        ]),
        h("button", { title: "delete", class: "todo-item-delete-button" }, [
          hString("d"),
        ]),
      ]);
    }),
  );
};

const main = (todos: Todo[], emit: any) => {
  return h("main", { class: "main-container" }, [
    newTodoForm(emit),
    listOfTodos(todos, emit),
  ]);
};

const View: View<typeof todos> = (state, emit) =>
  hFragment([header, main(state, emit)]);

const reducers: Reducer<typeof todos> = {
  //FIXME: infer the payload
  markAsDone: (state, id: number) => {
    const updatedState = state.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isDone: true };
      }
      return todo;
    });

    saveTodos(updatedState);

    return updatedState;
  },

  //FIXME: infer the payload
  removeMarkAsDone: (state, id: number) => {
    const updatedState = state.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isDone: false };
      }
      return todo;
    });

    saveTodos(updatedState);

    return updatedState;
  },

  addNewTodo: (state, newTodoTitle: string) => {
    const newTodo: Todo = {
      id: Math.random(),
      isDone: false,
      title: newTodoTitle,
    };

    const updatedState = [...state, newTodo];

    saveTodos(updatedState);

    return updatedState;
  },
};

createApp({ state: todos, view: View, reducers }).mount(
  document.getElementById("app")!,
);
