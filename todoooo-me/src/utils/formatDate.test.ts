import { describe, expect, it } from 'vitest';
import { formatTimestamp } from './formatDate';

describe('formatTimestamp', () => {
  it('produces the expected format pattern', () => {
    // Use a fixed epoch that maps to a known local date/time.
    // The exact weekday/time depends on timezone, so we assert on structure.
    const out = formatTimestamp(new Date('2025-07-13T10:30:00').getTime());
    // Pattern: "ddd, MMM D · h:mm AM/PM"
    expect(out).toMatch(/^[A-Z][a-z]{2}, [A-Z][a-z]{2} \d{1,2} · \d{1,2}:\d{2} (AM|PM)$/);
  });

  it('includes a separator dot', () => {
    expect(formatTimestamp(Date.now())).toContain('·');
  });

  it('handles midnight rollover (00:00)', () => {
    const midnight = new Date('2025-01-01T00:00:00').getTime();
    const out = formatTimestamp(midnight);
    expect(out).toMatch(/12:00 AM$/);
  });

  it('handles noon (12:00 PM)', () => {
    const noon = new Date('2025-01-01T12:00:00').getTime();
    const out = formatTimestamp(noon);
    expect(out).toMatch(/12:00 PM$/);
  });
});
