import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Task } from './types';
import { createId, loadTasks, saveTasks } from './utils/storage';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const task: Task = {
      id: createId(),
      text: trimmed,
      createdAt: Date.now(),
      completed: false,
    };
    setTasks((prev) => [task, ...prev]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }, []);

  const hasCompleted = useMemo(
    () => tasks.some((t) => t.completed),
    [tasks],
  );

  return (
    <div className="flex h-dvh flex-col bg-slate-50 font-sans text-slate-900">
      <header className="flex-none border-b border-slate-200/70 pt-safe">
        <div className="mx-auto flex max-w-md items-center justify-between px-5 py-4">
          <h1 className="text-xl font-semibold tracking-tight">To-Do</h1>
          {hasCompleted && (
            <button
              type="button"
              onClick={clearCompleted}
              className="focus-ring -mr-2 rounded-md px-2 py-2 text-sm text-slate-400 transition-colors hover:text-slate-600 active:text-slate-700"
            >
              Clear completed
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col">
        <TaskList tasks={tasks} onToggle={toggleTask} />
        <TaskInput onAdd={addTask} />
      </main>
    </div>
  );
}
