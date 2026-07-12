import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

const KEY = 'todo-app-tasks';

async function addTask(text: string) {
  const user = userEvent.setup();
  const input = screen.getByPlaceholderText('What needs to be done?');
  await user.type(input, text);
  await user.keyboard('{Enter}');
}

function taskRows() {
  return screen.getAllByRole('button', { name: /^Mark / });
}

describe('App integration', () => {
  it('adds a task via Enter key', async () => {
    render(<App />);
    await addTask('Buy groceries');
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  it('does not add whitespace-only tasks', async () => {
    render(<App />);
    await addTask('   ');
    expect(screen.queryByText('   ')).not.toBeInTheDocument();
    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
  });

  it('clears input after successful add', async () => {
    render(<App />);
    await addTask('Read a book');
    expect(screen.getByPlaceholderText('What needs to be done?')).toHaveValue('');
  });

  it('toggles a task to completed and back', async () => {
    const user = userEvent.setup();
    render(<App />);
    await addTask('Walk the dog');
    const row = taskRows()[0];
    expect(row).toHaveAttribute('aria-pressed', 'false');
    await user.click(row);
    expect(row).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Walk the dog')).toHaveClass('line-through');
    await user.click(row);
    expect(row).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('Walk the dog')).not.toHaveClass('line-through');
  });

  it('toggling one task does not affect others (idempotent, isolated)', async () => {
    const user = userEvent.setup();
    render(<App />);
    await addTask('Task A');
    await addTask('Task B');
    const [rowA, rowB] = taskRows();
    await user.click(rowA);
    expect(rowA).toHaveAttribute('aria-pressed', 'true');
    expect(rowB).toHaveAttribute('aria-pressed', 'false');
  });

  it('clear completed removes only completed tasks', async () => {
    const user = userEvent.setup();
    render(<App />);
    await addTask('Keep me');
    await addTask('Remove me');
    const [rowRemove] = taskRows();
    await user.click(rowRemove);
    await user.click(screen.getByRole('button', { name: /clear completed/i }));
    expect(screen.getByText('Keep me')).toBeInTheDocument();
    expect(screen.queryByText('Remove me')).not.toBeInTheDocument();
  });

  it('clear completed button only appears when a task is completed', async () => {
    const user = userEvent.setup();
    render(<App />);
    await addTask('Task one');
    expect(screen.queryByRole('button', { name: /clear completed/i })).not.toBeInTheDocument();
    await user.click(taskRows()[0]);
    expect(screen.getByRole('button', { name: /clear completed/i })).toBeInTheDocument();
  });

  it('persists tasks to localStorage on every change', async () => {
    render(<App />);
    await addTask('Persisted task');
    const stored = JSON.parse(localStorage.getItem(KEY)!);
    expect(stored).toHaveLength(1);
    expect(stored[0].text).toBe('Persisted task');
  });

  it('loads tasks from localStorage on mount', () => {
    const tasks = [
      { id: 'pre-1', text: 'Pre-existing', createdAt: 1_700_000_000_000, completed: false },
    ];
    localStorage.setItem(KEY, JSON.stringify(tasks));
    render(<App />);
    expect(screen.getByText('Pre-existing')).toBeInTheDocument();
  });

  it('survives a refresh (unmount/remount) with data intact', async () => {
    const { unmount } = render(<App />);
    await addTask('Survive refresh');
    unmount();
    render(<App />);
    expect(screen.getByText('Survive refresh')).toBeInTheDocument();
  });

  it('renders the empty-state when no tasks', () => {
    render(<App />);
    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    expect(screen.getByText('Add one below to get started.')).toBeInTheDocument();
  });

  it('renders a timestamp for each task', async () => {
    render(<App />);
    await addTask('Timed task');
    const row = taskRows()[0];
    expect(within(row).getByText(/^[A-Z][a-z]{2}, [A-Z][a-z]{2} \d{1,2} · /)).toBeInTheDocument();
  });
});
