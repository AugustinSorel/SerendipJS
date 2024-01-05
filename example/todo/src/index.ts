import {
  Emit,
  Reducers,
  View,
  createApp,
  h,
  hFragment,
  hString,
} from "SerendipJS";
import "./index.css";
import { getTodos, saveTodos } from "./localStorage";

export type Todo = { id: number; title: string; isDone: boolean };

const todos = getTodos();

const header = h("header", { class: "main-header" }, [
  h("h1", { class: "main-title" }, [hString("todo list")]),
]);

const newTodoForm = (emit: Emit<typeof reducers>) => {
  return h(
    "form",
    {
      class: "new-todo-form",
      on: {
        submit: (e) => {
          e.preventDefault();
          const formElement = <HTMLFormElement>e.currentTarget;

          //FIXME: add zod
          const formData = new FormData(formElement);

          const todoTitle = formData.get("todo-title") as string;

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

const listOfTodos = (todos: Todo[], emit: Emit<typeof reducers>) => {
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
              change: (e) => {
                if ((<HTMLInputElement>e.currentTarget)?.checked) {
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

const main = (todos: Todo[], emit: Emit<typeof reducers>) => {
  return h("main", { class: "main-container" }, [
    newTodoForm(emit),
    listOfTodos(todos, emit),
  ]);
};

const View: View<typeof todos, typeof reducers> = (state, emit) =>
  hFragment([header, main(state, emit)]);

const reducers = {
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
} satisfies Reducers<Todo[]>;

createApp({ state: todos, view: View, reducers }).mount(
  document.getElementById("app")!,
);
