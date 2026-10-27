import { toDateString } from './api';

/** Booking form rules shared by the form and the unit tests. */
export const MIN_GUESTS = 1;
export const MAX_GUESTS = 10;
export const MAX_DAYS_AHEAD = 60;
export const OCCASIONS = ['Birthday', 'Anniversary', 'Engagement', 'Business', 'Other'];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[0-9\s\-()]{7,20}$/;

/** Returns today's date and the latest bookable date as YYYY-MM-DD strings. */
export const getDateBounds = (today = new Date()) => {
  const max = new Date(today);
  max.setDate(max.getDate() + MAX_DAYS_AHEAD);
  return { min: toDateString(today), max: toDateString(max) };
};

/**
 * Validates every booking field.
 * @param {object} values form values
 * @param {string[]} availableTimes times currently offered for the chosen date
 * @param {Date} [today]
 * @returns {Record<string, string>} map of field name -> error message (empty when valid)
 */
export const validateBooking = (values, availableTimes = [], today = new Date()) => {
  const errors = {};
  const { min, max } = getDateBounds(today);
  const name = (values.name || '').trim();
  const email = (values.email || '').trim();
  const phone = (values.phone || '').trim();
  const guests = Number(values.guests);

  if (!name) errors.name = 'Please enter your full name.';
  else if (name.length < 2) errors.name = 'Name must be at least 2 characters.';
  else if (name.length > 50) errors.name = 'Name must be 50 characters or fewer.';

  if (!email) errors.email = 'Please enter your email address.';
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Please enter a valid email address, e.g. name@example.com.';

  // Phone is optional, but must look like a phone number if provided.
  if (phone && !PHONE_PATTERN.test(phone)) errors.phone = 'Please enter a valid phone number.';

  if (!values.date) errors.date = 'Please choose a date.';
  else if (values.date < min) errors.date = 'The date cannot be in the past.';
  else if (values.date > max) errors.date = `Bookings can be made up to ${MAX_DAYS_AHEAD} days in advance.`;

  if (!values.time) {
    errors.time = availableTimes.length
      ? 'Please choose a time.'
      : 'No tables are available on this date. Please choose another date.';
  } else if (!availableTimes.includes(values.time)) {
    errors.time = 'This time is no longer available. Please choose another time.';
  }

  if (values.guests === '' || values.guests === undefined || Number.isNaN(guests)) {
    errors.guests = 'Please enter the number of guests.';
  } else if (!Number.isInteger(guests)) {
    errors.guests = 'Number of guests must be a whole number.';
  } else if (guests < MIN_GUESTS || guests > MAX_GUESTS) {
    errors.guests = `Number of guests must be between ${MIN_GUESTS} and ${MAX_GUESTS}.`;
  }

  if (!values.occasion) errors.occasion = 'Please choose an occasion.';
  else if (!OCCASIONS.includes(values.occasion)) errors.occasion = 'Please choose a valid occasion.';

  if ((values.requests || '').length > 300) errors.requests = 'Special requests must be 300 characters or fewer.';

  return errors;
};
