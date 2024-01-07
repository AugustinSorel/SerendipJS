import { z } from "zod";

export const todoSchema = z.object({
  id: z.number(),
  title: z.string().trim().min(1),
  isDone: z.boolean(),
});
export const todosSchema = todoSchema.array();

export type Todo = z.infer<typeof todoSchema>;

const localStorageKey = "todo";

export const saveTodos = (todos: Todo[]) => {
  localStorage.setItem(localStorageKey, JSON.stringify(todos));
};

export const getTodos = (): Todo[] => {
  try {
    const unsafeTodos = localStorage.getItem(localStorageKey) ?? "";
    const todos = todosSchema.parse(JSON.parse(unsafeTodos));

    return todos;
  } catch (e) {
    return [];
  }
};
