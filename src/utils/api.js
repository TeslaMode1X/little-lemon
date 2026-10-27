/**
 * Mock booking API.
 *
 * Mirrors the API script supplied in the Coursera course (fetchAPI / submitAPI):
 * available times are generated with a seeded pseudo-random generator so the
 * same date always returns the same slots. On top of that, confirmed bookings
 * are persisted in localStorage and removed from the list of available times,
 * so a slot can't be double-booked.
 */

const STORAGE_KEY = 'littleLemonBookings';

// Deterministic pseudo-random generator seeded by the day of the month.
const seededRandom = (seed) => {
  const m = 2 ** 35 - 31;
  const a = 185852;
  let s = seed % m;
  return () => (s = (s * a) % m) / m;
};

/** Reads saved bookings; returns [] if storage is unavailable or corrupt. */
export const getStoredBookings = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/** Formats a Date as YYYY-MM-DD in local time (matches <input type="date">). */
export const toDateString = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Returns the available reservation times for a given date.
 * @param {Date} date
 * @returns {string[]} e.g. ["17:00", "18:30", ...]
 */
export const fetchAPI = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return [];

  const random = seededRandom(date.getDate());
  const result = [];
  for (let hour = 17; hour <= 23; hour++) {
    if (random() < 0.5) result.push(`${hour}:00`);
    if (random() < 0.5) result.push(`${hour}:30`);
  }

  // Remove slots that have already been booked for this date.
  const day = toDateString(date);
  const taken = getStoredBookings()
    .filter((b) => b.date === day)
    .map((b) => b.time);
  return result.filter((time) => !taken.includes(time));
};

/**
 * Submits a booking. Returns true on success, false if the data is missing
 * or the slot was taken in the meantime.
 * @param {{date: string, time: string, guests: number, occasion: string}} formData
 * @returns {boolean}
 */
export const submitAPI = (formData) => {
  if (!formData || !formData.date || !formData.time) return false;

  const bookings = getStoredBookings();
  const alreadyTaken = bookings.some(
    (b) => b.date === formData.date && b.time === formData.time
  );
  if (alreadyTaken) return false;

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...bookings, formData])
    );
  } catch {
    // Storage full/blocked: the booking is still accepted for this session.
  }
  return true;
};
