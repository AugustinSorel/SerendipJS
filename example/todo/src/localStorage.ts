import { Todo } from ".";

const localStorageKey = "todo";

export const saveTodos = (todos: Todo[]) => {
  localStorage.setItem(localStorageKey, JSON.stringify(todos));
};

export const getTodos = () => {
  const todos = localStorage.getItem(localStorageKey) ?? "";

  const parsedTodos = JSON.parse(todos) || [];

  return parsedTodos as Todo[];
};
