import { useSyncExternalStore } from 'react';

import { MOCK_TODOS, type MockTodo } from '@/mocks/todoData';

export type Todo = MockTodo;

export type CreateTodoPayload = {
  title: string;
  platform: string;
  checked?: boolean;
  createdAt?: string;
};

export type UpdateTodoPayload = Partial<Omit<Todo, 'id'>>;

const cloneTodo = (todo: Todo): Todo => ({ ...todo });

const createInitialTodos = () => MOCK_TODOS.map((todo) => cloneTodo(todo));

let todos: Todo[] = createInitialTodos();

const listeners = new Set<() => void>();

const emit = () => {
  listeners.forEach((listener) => listener());
};

const getSnapshot = () => todos;

export const todoMockApi = {
  getAll: (): Todo[] => todos.map((todo) => cloneTodo(todo)),

  add: (payload: CreateTodoPayload): Todo => {
    const newTodo: Todo = {
      id: `todo-${Date.now()}`,
      title: payload.title,
      platform: payload.platform,
      checked: payload.checked ?? false,
      createdAt: payload.createdAt ?? new Date().toISOString(),
    };

    const normalized = cloneTodo(newTodo);
    todos = [normalized, ...todos];
    emit();
    return cloneTodo(normalized);
  },

  update: (id: string, updates: UpdateTodoPayload): Todo | undefined => {
    let updatedTodo: Todo | undefined;

    todos = todos.map((todo) => {
      if (todo.id !== id) {
        return todo;
      }

      updatedTodo = {
        ...todo,
        ...updates,
      };

      const normalized = cloneTodo(updatedTodo);
      updatedTodo = normalized;
      return normalized;
    });

    if (updatedTodo) {
      emit();
      return cloneTodo(updatedTodo);
    }

    return undefined;
  },

  delete: (id: string): boolean => {
    const nextTodos = todos.filter((todo) => todo.id !== id);

    if (nextTodos.length === todos.length) {
      return false;
    }

    todos = nextTodos.map((todo) => cloneTodo(todo));
    emit();
    return true;
  },

  reset: () => {
    todos = createInitialTodos();
    emit();
  },

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export const useMockTodos = () =>
  useSyncExternalStore(todoMockApi.subscribe, getSnapshot, getSnapshot);
