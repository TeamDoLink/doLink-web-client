/**
 * UI 테스트용 Todo 상태 스토어
 * - 실제 API 연결 전까지 사용
 */

import { create } from 'zustand';
import { MOCK_TODOS, type MockTodo } from '@/mocks/todoData';

export type TodoRecord = MockTodo;

export type UpdateTodoPayload = Partial<Omit<TodoRecord, 'id'>>;

export type CreateTodoPayload = Omit<TodoRecord, 'id' | 'createdAt'> & {
  id?: string;
  createdAt?: string;
};

type TodoDataState = {
  todos: TodoRecord[];
  addTodo: (payload: CreateTodoPayload) => TodoRecord;
  updateTodo: (
    id: string,
    updates: UpdateTodoPayload
  ) => TodoRecord | undefined;
  deleteTodo: (id: string) => boolean;
  resetTodos: () => void;
};

const cloneTodo = (todo: TodoRecord): TodoRecord => ({
  ...todo,
});

const createInitialTodos = (): TodoRecord[] =>
  MOCK_TODOS.map((todo) => cloneTodo(todo));

export const useTodoDataStore = create<TodoDataState>((set) => ({
  todos: createInitialTodos(),
  addTodo: (payload) => {
    const now = new Date();
    const newTodo: TodoRecord = {
      id: payload.id ?? `todo-${now.getTime()}`,
      title: payload.title,
      platform: payload.platform,
      checked: payload.checked ?? false,
      createdAt: payload.createdAt ?? now.toISOString(),
    };

    set((state) => ({
      todos: [
        cloneTodo(newTodo),
        ...state.todos.map((todo) => cloneTodo(todo)),
      ],
    }));

    return cloneTodo(newTodo);
  },
  updateTodo: (id, updates) => {
    let result: TodoRecord | undefined;

    set((state) => ({
      todos: state.todos.map((todo) => {
        if (todo.id !== id) {
          return cloneTodo(todo);
        }

        result = cloneTodo({
          ...todo,
          ...updates,
        });
        return result;
      }),
    }));

    return result ? cloneTodo(result) : undefined;
  },
  deleteTodo: (id) => {
    let removed = false;
    set((state) => {
      const nextTodos = state.todos.filter((todo) => todo.id !== id);
      removed = nextTodos.length !== state.todos.length;
      return {
        todos: nextTodos.map((todo) => cloneTodo(todo)),
      };
    });
    return removed;
  },
  resetTodos: () => {
    set({ todos: createInitialTodos() });
  },
}));
