const dateFmt = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
});

const timeFmt = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
});

export function formatTimestamp(epochMs: number): string {
  return `${dateFmt.format(epochMs)} · ${timeFmt.format(epochMs)}`;
}
