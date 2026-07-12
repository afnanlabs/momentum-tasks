import { describe, expect, it, vi } from 'vitest';
import { loadTasks, saveTasks, createId } from './storage';
import type { Task } from '../types';

const KEY = 'todo-app-tasks';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'abc-123',
    text: 'Buy groceries',
    createdAt: 1_700_000_000_000,
    completed: false,
    ...overrides,
  };
}

describe('storage', () => {
  describe('loadTasks', () => {
    it('returns [] when localStorage is empty', () => {
      expect(loadTasks()).toEqual([]);
    });

    it('returns parsed tasks from localStorage', () => {
      const tasks = [makeTask(), makeTask({ id: 'def-456', text: 'Walk dog' })];
      localStorage.setItem(KEY, JSON.stringify(tasks));
      expect(loadTasks()).toEqual(tasks);
    });

    it('returns [] on corrupted JSON', () => {
      localStorage.setItem(KEY, '{not valid json');
      expect(loadTasks()).toEqual([]);
    });

    it('returns [] when stored value is not an array', () => {
      localStorage.setItem(KEY, JSON.stringify({ id: 'oops' }));
      expect(loadTasks()).toEqual([]);
    });

    it('returns [] when getItem throws (security exception)', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });
      expect(loadTasks()).toEqual([]);
      spy.mockRestore();
    });
  });

  describe('saveTasks', () => {
    it('serializes tasks to localStorage', () => {
      const tasks = [makeTask()];
      saveTasks(tasks);
      expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual(tasks);
    });

    it('swallows quota-exceeded errors silently', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('QuotaExceededError');
      });
      expect(() => saveTasks([makeTask()])).not.toThrow();
      spy.mockRestore();
    });
  });

  describe('createId', () => {
    it('produces a non-empty string', () => {
      const id = createId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('produces unique values across calls', () => {
      const ids = new Set(Array.from({ length: 50 }, () => createId()));
      expect(ids.size).toBe(50);
    });
  });
});
