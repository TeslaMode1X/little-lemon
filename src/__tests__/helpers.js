import { toDateString } from '../utils/api';

/** Returns a YYYY-MM-DD string `offset` days from today. */
export const daysFromToday = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return toDateString(date);
};
