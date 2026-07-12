import { useEffect, useRef } from 'react';
import type { Task } from '../types';
import TaskItem from './TaskItem';

interface Props {
  tasks: Task[];
  onToggle: (id: string) => void;
}

export default function TaskList({ tasks, onToggle }: Props) {
  const scrollRef = useRef<HTMLUListElement>(null);
  const prevCount = useRef(tasks.length);

  // Newest-first: a newly added task appears at the top. If the user had
  // scrolled down, scroll back to the top so the new item is visible.
  useEffect(() => {
    if (tasks.length > prevCount.current && scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0 });
    }
    prevCount.current = tasks.length;
  }, [tasks.length]);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <p className="text-base font-medium text-slate-400">No tasks yet</p>
        <p className="mt-1 text-sm text-slate-400">
          Add one below to get started.
        </p>
      </div>
    );
  }

  return (
    <ul
      ref={scrollRef}
      className="min-h-0 flex-1 divide-y divide-slate-100 overflow-y-auto px-5"
    >
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} />
      ))}
    </ul>
  );
}
