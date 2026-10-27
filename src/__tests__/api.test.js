import { describe, expect, it } from 'vitest';
import { fetchAPI, getStoredBookings, submitAPI, toDateString } from '../utils/api';

describe('fetchAPI', () => {
  it('returns a non-empty list of HH:MM times', () => {
    const times = fetchAPI(new Date(2026, 0, 15));
    expect(times.length).toBeGreaterThan(0);
    times.forEach((t) => expect(t).toMatch(/^\d{2}:\d{2}$/));
  });

  it('is deterministic for the same date', () => {
    expect(fetchAPI(new Date(2026, 0, 15))).toEqual(fetchAPI(new Date(2026, 0, 15)));
  });

  it('returns an empty list for an invalid date', () => {
    expect(fetchAPI(new Date('not a date'))).toEqual([]);
    expect(fetchAPI(undefined)).toEqual([]);
  });

  it('removes times that are already booked', () => {
    const date = new Date(2026, 0, 15);
    const [first] = fetchAPI(date);
    submitAPI({ date: toDateString(date), time: first, guests: 2, occasion: 'Birthday' });
    expect(fetchAPI(date)).not.toContain(first);
  });
});

describe('submitAPI', () => {
  const booking = { date: '2026-01-15', time: '17:00', guests: 2, occasion: 'Birthday' };

  it('returns true and stores the booking', () => {
    expect(submitAPI(booking)).toBe(true);
    expect(getStoredBookings()).toEqual([booking]);
  });

  it('rejects a double booking of the same slot', () => {
    submitAPI(booking);
    expect(submitAPI({ ...booking, guests: 4 })).toBe(false);
  });

  it('rejects missing data', () => {
    expect(submitAPI(null)).toBe(false);
    expect(submitAPI({ date: '2026-01-15' })).toBe(false);
  });

  it('survives corrupt data in storage', () => {
    window.localStorage.setItem('littleLemonBookings', '{oops');
    expect(getStoredBookings()).toEqual([]);
    expect(submitAPI(booking)).toBe(true);
  });
});
