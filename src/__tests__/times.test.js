import { describe, expect, it } from 'vitest';
import { fetchAPI } from '../utils/api';
import { initializeTimes, removePastTimes, updateTimes } from '../utils/times';

describe('initializeTimes', () => {
  it("returns today's upcoming times from the API", () => {
    const now = new Date();
    expect(initializeTimes()).toEqual(removePastTimes(fetchAPI(now), now));
  });
});

describe('updateTimes', () => {
  it('returns the times for the selected date', () => {
    const result = updateTimes([], { type: 'UPDATE_TIMES', date: '2026-03-10' });
    expect(result).toEqual(fetchAPI(new Date(2026, 2, 10)));
  });

  it('returns an empty list when the date is cleared', () => {
    expect(updateTimes(['17:00'], { type: 'UPDATE_TIMES', date: '' })).toEqual([]);
  });

  it('returns the same state for unknown actions', () => {
    const state = ['17:00', '18:00'];
    expect(updateTimes(state, { type: 'UNKNOWN' })).toBe(state);
  });
});

describe('removePastTimes', () => {
  const times = ['17:00', '18:30', '20:00'];

  it('removes times that have already passed today', () => {
    const now = new Date(2026, 4, 1, 18, 45);
    expect(removePastTimes(times, new Date(2026, 4, 1), now)).toEqual(['20:00']);
  });

  it('keeps every time for future dates', () => {
    const now = new Date(2026, 4, 1, 23, 0);
    expect(removePastTimes(times, new Date(2026, 4, 2), now)).toEqual(times);
  });
});
