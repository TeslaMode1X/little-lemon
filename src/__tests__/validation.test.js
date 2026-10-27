import { describe, expect, it } from 'vitest';
import { validateBooking } from '../utils/validation';
import { daysFromToday } from './helpers';

const times = ['17:00', '18:30'];
const valid = {
  name: 'Anna Smith',
  email: 'anna@example.com',
  phone: '',
  date: daysFromToday(1),
  time: '17:00',
  guests: '4',
  occasion: 'Birthday',
  requests: '',
};

describe('validateBooking', () => {
  it('returns no errors for valid data', () => {
    expect(validateBooking(valid, times)).toEqual({});
  });

  it('requires all mandatory fields', () => {
    const errors = validateBooking({ guests: '' }, times);
    expect(Object.keys(errors).sort()).toEqual(['date', 'email', 'guests', 'name', 'occasion', 'time']);
  });

  it.each([
    ['name', ' ', 'Please enter your full name.'],
    ['name', 'A', 'Name must be at least 2 characters.'],
    ['email', 'anna@', 'Please enter a valid email address, e.g. name@example.com.'],
    ['phone', 'abc', 'Please enter a valid phone number.'],
    ['guests', '0', 'Number of guests must be between 1 and 10.'],
    ['guests', '11', 'Number of guests must be between 1 and 10.'],
    ['guests', '2.5', 'Number of guests must be a whole number.'],
    ['occasion', 'Party', 'Please choose a valid occasion.'],
    ['time', '20:00', 'This time is no longer available. Please choose another time.'],
  ])('rejects %s = "%s"', (field, value, message) => {
    expect(validateBooking({ ...valid, [field]: value }, times)[field]).toBe(message);
  });

  it('rejects dates in the past', () => {
    expect(validateBooking({ ...valid, date: daysFromToday(-1) }, times).date).toBe('The date cannot be in the past.');
  });

  it('rejects dates too far in the future', () => {
    expect(validateBooking({ ...valid, date: daysFromToday(61) }, times).date).toMatch(/up to 60 days/);
  });

  it('accepts today and the boundary values for guests', () => {
    expect(validateBooking({ ...valid, date: daysFromToday(0) }, times)).toEqual({});
    expect(validateBooking({ ...valid, guests: '1' }, times)).toEqual({});
    expect(validateBooking({ ...valid, guests: '10' }, times)).toEqual({});
  });

  it('explains when no times are available on the chosen date', () => {
    expect(validateBooking({ ...valid, time: '' }, []).time).toMatch(/No tables are available/);
  });
});
