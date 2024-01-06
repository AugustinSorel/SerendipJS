import { Todo, todosSchema } from ".";

const localStorageKey = "todo";

export const saveTodos = (todos: Todo[]) => {
  localStorage.setItem(localStorageKey, JSON.stringify(todos));
};

export const getTodos = () => {
  try {
    const unsafeTodos = localStorage.getItem(localStorageKey) ?? "";
    const todos = todosSchema.parse(JSON.parse(unsafeTodos));

    return todos;
  } catch (e) {
    return [];
  }
};
