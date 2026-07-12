import { useState, type FormEvent } from 'react';
import { Plus } from 'lucide-react';

interface Props {
  onAdd: (text: string) => void;
}

export default function TaskInput({ onAdd }: Props) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue('');
  };

  return (
    <div className="flex-none border-t border-slate-200/70 bg-white pb-safe">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-md items-center gap-3 px-5 py-3"
      >
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="What needs to be done?"
          aria-label="Add a task"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="focus-ring min-h-[44px] flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 placeholder:text-slate-400"
        />
        <button
          type="submit"
          aria-label="Add task"
          className="focus-ring flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-slate-900 px-4 text-white transition-colors hover:bg-slate-700 active:bg-slate-800"
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
}
