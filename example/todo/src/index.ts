import {
  Emit,
  Reducers,
  View,
  createApp,
  h,
  hPortal,
  hFragment,
  hString,
} from "SerendipJS";
import "./index.css";
import { Todo, todoSchema, getTodos, saveTodos } from "./todo";

const rootEl = document.getElementById("app");

if (!rootEl) {
  throw new Error("root element not found");
}

type State = {
  todos: Todo[];
  isEditModalOpened: boolean;
  isDeleteTodoAlertOpened: boolean;
  selectedTodoIdEditing: Todo["id"] | null;
  selectedTodoIdDeleting: Todo["id"] | null;
};

export const state: State = {
  todos: getTodos(),
  isEditModalOpened: false,
  isDeleteTodoAlertOpened: false,
  selectedTodoIdEditing: null,
  selectedTodoIdDeleting: null,
};

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

          const formData = new FormData(formElement);

          const todoTitle = todoSchema.shape.title.safeParse(
            formData.get("todo-title"),
          );

          if (!todoTitle.success) {
            return alert("todo title cannot be empty");
          }

          emit("addNewTodo", todoTitle.data);
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

const listOfTodos = (state: State, emit: Emit<typeof reducers>) => {
  if (!state.todos.length) {
    return h("p", {}, [hString("no todo...")]);
  }

  return hFragment([
    h(
      "ul",
      { class: "list-of-todos" },
      state.todos.map((todo) => {
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
          h(
            "button",
            {
              title: "edit",
              class: "todo-item-edit-button",
              on: {
                click: () => {
                  emit("openEditTodoModal", todo.id);
                },
              },
            },
            [hString("e")],
          ),
          h(
            "button",
            {
              title: "delete",
              class: "todo-item-delete-button",
              on: {
                click: () => {
                  emit("openDeleteTodoAlert", todo.id);
                },
              },
            },
            [hString("d")],
          ),
        ]);
      }),
    ),

    hPortal(editTodoModal(state, emit), rootEl),
    hPortal(deleteTodoAlert(state, emit), rootEl),
  ]);
};

const deleteTodoAlert = (state: State, emit: Emit<typeof reducers>) => {
  if (!state.isDeleteTodoAlertOpened) {
    return null;
  }

  const selectedTodo = state.todos.find(
    (todo) => todo.id === state.selectedTodoIdDeleting,
  );

  if (!selectedTodo) {
    throw new Error("todo not found");
  }

  return h("div", { class: "backdrop" }, [
    h("div", { class: "alert delete-todo-alert" }, [
      h("p", { class: "alert-text" }, [hString("Danger")]),
      h("p", { class: "alert-sub-text" }, [
        hString(`are you sure you want to remove ${selectedTodo.title}?`),
      ]),
      h("div", { class: "alert-actions-container" }, [
        h(
          "button",
          {
            class: "alert-cancel-button",
            on: {
              click: () => {
                emit("closeDeleteTodoAlert");
              },
            },
          },
          [hString("cancel")],
        ),
        h(
          "button",
          {
            class: "alert-submit-button",
            on: {
              click: () => {
                emit("closeDeleteTodoAlert");

                emit("deleteTodo", selectedTodo.id);
              },
            },
          },
          [hString("delete")],
        ),
      ]),
    ]),
  ]);
};

const editTodoModal = (state: State, emit: Emit<typeof reducers>) => {
  if (!state.isEditModalOpened) {
    return null;
  }

  const selectedTodo = state.todos.find(
    (todo) => todo.id === state.selectedTodoIdEditing,
  );

  if (!selectedTodo) {
    throw new Error("todo not found");
  }

  return h(
    "div",
    {
      class: "backdrop",
      on: {
        click: () => {
          emit("closeEditTodoModal");
        },
      },
    },
    [
      h(
        "form",
        {
          on: {
            click: (e) => {
              e.stopPropagation();
            },
            submit: (e) => {
              e.preventDefault();

              const formElement = <HTMLFormElement>e.currentTarget;

              const formData = new FormData(formElement);

              const updateTodoTitle = todoSchema.shape.title.safeParse(
                formData.get("updated-todo-title"),
              );

              if (!updateTodoTitle.success) {
                return alert("todo updated title cannot be empty");
              }

              emit("updateTodoTitle", {
                id: selectedTodo.id,
                title: updateTodoTitle.data,
              });

              emit("closeEditTodoModal");
            },
          },
          class: "modal edit-todo-modal",
        },
        [
          h(
            "label",
            { class: "edit-todo-modal-label", for: "editTodoModalInput" },
            [hString("new todo title:")],
          ),
          h("input", {
            id: "editTodoModalInput",
            class: "edit-todo-modal-input",
            value: selectedTodo.title,
            placeholder: "new todo title",
            autofocus: true,
            name: "updated-todo-title",
          }),
          h("div", { class: "modal-actions-container" }, [
            h(
              "button",
              {
                type: "button",
                class: "modal-cancel-button",
                on: {
                  click: () => {
                    emit("closeEditTodoModal");
                  },
                },
              },
              [hString("cancel")],
            ),
            h(
              "button",
              {
                type: "submit",
                class: "modal-sumit-button",
              },
              [hString("sumbit")],
            ),
          ]),
        ],
      ),
    ],
  );
};

const main = (state: State, emit: Emit<typeof reducers>) => {
  return h("main", { class: "main-container" }, [
    newTodoForm(emit),
    listOfTodos(state, emit),
  ]);
};

const View: View<State, typeof reducers> = (state, emit) =>
  hFragment([header, main(state, emit)]);

const reducers = {
  markAsDone: (state, id: Todo["id"]) => {
    const updatedTodos = state.todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isDone: true };
      }
      return todo;
    });

    saveTodos(updatedTodos);

    return { ...state, todos: updatedTodos };
  },

  removeMarkAsDone: (state, id: Todo["id"]) => {
    const updatedTodos = state.todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isDone: false };
      }
      return todo;
    });

    saveTodos(updatedTodos);

    return { ...state, todos: updatedTodos };
  },

  addNewTodo: (state, newTodoTitle: Todo["title"]) => {
    const newTodo: Todo = {
      id: Math.random(),
      isDone: false,
      title: newTodoTitle,
    };

    const updatedTodos = [...state.todos, newTodo];

    saveTodos(updatedTodos);

    return { ...state, todos: updatedTodos };
  },

  updateTodoTitle: (state, payload: Pick<Todo, "id" | "title">) => {
    const updatedTodos = state.todos.map((todo) => {
      if (todo.id === payload.id) {
        return { ...todo, title: payload.title };
      }
      return todo;
    });

    saveTodos(updatedTodos);

    return { ...state, todos: updatedTodos };
  },

  deleteTodo: (state, todoId: Todo["id"]) => {
    const updatedTodos = state.todos.filter((todo) => todo.id !== todoId);

    saveTodos(updatedTodos);

    return {
      ...state,
      todos: updatedTodos,
    };
  },

  openEditTodoModal: (state, selectedTodoIdEditing: Todo["id"]) => {
    return { ...state, isEditModalOpened: true, selectedTodoIdEditing };
  },

  closeEditTodoModal: (state) => {
    return { ...state, isEditModalOpened: false, selectedTodoIdEditing: null };
  },

  openDeleteTodoAlert: (state, selectedTodoIdDeleting: Todo["id"]) => {
    return { ...state, isDeleteTodoAlertOpened: true, selectedTodoIdDeleting };
  },

  closeDeleteTodoAlert: (state) => {
    return {
      ...state,
      isDeleteTodoAlertOpened: false,
      selectedTodoIdDeleting: null,
    };
  },
} satisfies Reducers<State>;

createApp({ state, view: View, reducers }).mount(rootEl);
