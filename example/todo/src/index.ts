import { h, hFragment, hString, mountDOM } from "SerendipJS";
import "./index.css";

const todos = [
  { id: 1, title: "walk the dog", isDone: false },
  { id: 2, title: "go outside", isDone: true },
  { id: 3, title: "make food", isDone: false },
];

const header = h("header", { class: "main-header" }, [
  h("h1", { class: "main-title" }, [hString("todo list")]),
]);

const newTodoForm = h("form", { class: "new-todo-form" }, [
  h(
    "input",
    {
      type: "text",
      placeholder: "new todo...",
      class: "new-todo-input",
    },
    [],
  ),
  h("button", { class: "new-todo-submit-button", title: "add new todo" }, [
    hString("+"),
  ]),
]);

const listOfTodos = h(
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
        },
        [],
      ),
      h("label", { class: "todo-item-title", for: `todo-status-${todo.id}` }, [
        hString(todo.title),
      ]),
      h("button", { title: "edit", class: "todo-item-edit-button" }, [
        hString("e"),
      ]),
      h("button", { title: "delete", class: "todo-item-delete-button" }, [
        hString("d"),
      ]),
    ]);
  }),
);

const main = h("main", { class: "main-container" }, [newTodoForm, listOfTodos]);

const app = hFragment([header, main]);

mountDOM(app, document.getElementById("app")!);
