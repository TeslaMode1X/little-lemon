import { fetchAPI, toDateString } from './api';

/**
 * Reducer helpers for the list of available booking times.
 * Kept separate from components so they can be unit tested in isolation.
 */

/** Drops times that have already passed when the date is today. */
export const removePastTimes = (times, date, now = new Date()) => {
  if (toDateString(date) !== toDateString(now)) return times;
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  return times.filter((time) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m > minutesNow;
  });
};

/** Returns the bookable times for a date (API result minus past times). */
const getTimes = (date) => removePastTimes(fetchAPI(date), date);

/** Initial state: the times available today. */
export const initializeTimes = () => getTimes(new Date());

/**
 * Reducer: recalculates available times when the selected date changes.
 * @param {string[]} state current available times
 * @param {{type: string, date?: string}} action
 */
export const updateTimes = (state, action) => {
  switch (action.type) {
    case 'UPDATE_TIMES': {
      if (!action.date) return [];
      // Parse "YYYY-MM-DD" as a local date (new Date(str) would use UTC).
      const [y, m, d] = action.date.split('-').map(Number);
      return getTimes(new Date(y, m - 1, d));
    }
    default:
      return state;
  }
};
