import { memo } from 'react';
import { Check } from 'lucide-react';
import type { Task } from '../types';
import { formatTimestamp } from '../utils/formatDate';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
}

function TaskItem({ task, onToggle }: Props) {
  const { id, text, createdAt, completed } = task;

  return (
    <li className="animate-slide-up">
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-pressed={completed}
        aria-label={completed ? `Mark "${text}" as not done` : `Mark "${text}" as done`}
        className="focus-ring flex w-full items-start gap-3 rounded-lg py-3 text-left"
      >
        <span
          className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border transition-colors ${
            completed
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'border-slate-300 bg-white'
          }`}
        >
          {completed && <Check size={13} strokeWidth={3} />}
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={`block break-words text-base leading-snug ${
              completed ? 'text-slate-400 line-through' : 'text-slate-900'
            }`}
          >
            {text}
          </span>
          <span className="mt-0.5 block text-xs text-slate-400">
            {formatTimestamp(createdAt)}
          </span>
        </span>
      </button>
    </li>
  );
}

export default memo(TaskItem);
