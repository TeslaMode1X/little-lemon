import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingForm from '../components/BookingForm';
import { daysFromToday } from './helpers';

const times = ['17:00', '18:30', '20:00'];

const setup = (props = {}) => {
  const dispatch = vi.fn();
  const submitForm = vi.fn(() => true);
  const user = userEvent.setup();
  render(<BookingForm availableTimes={times} dispatch={dispatch} submitForm={submitForm} {...props} />);
  return { dispatch, submitForm, user };
};

/** Fills every required field with valid data. */
const fillForm = async (user, date = daysFromToday(1)) => {
  await user.type(screen.getByLabelText(/full name/i), 'Anna Smith');
  await user.type(screen.getByLabelText(/email/i), 'anna@example.com');
  fireEvent.change(screen.getByLabelText(/choose date/i), { target: { value: date } });
  await user.selectOptions(screen.getByLabelText(/choose time/i), '18:30');
  await user.clear(screen.getByLabelText(/number of guests/i));
  await user.type(screen.getByLabelText(/number of guests/i), '4');
  await user.selectOptions(screen.getByLabelText(/occasion/i), 'Anniversary');
};

describe('BookingForm', () => {
  it('renders every field with an accessible label', () => {
    setup();
    ['Full name', 'Email', 'Phone (optional)', 'Choose date', 'Choose time', 'Number of guests', 'Occasion', 'Special requests (optional)']
      .forEach((label) => expect(screen.getByLabelText(new RegExp(label.replace(/[()]/g, '\\$&'), 'i'))).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /make your reservation/i })).toBeInTheDocument();
  });

  it('applies HTML5 validation attributes', () => {
    setup();
    expect(screen.getByLabelText(/full name/i)).toBeRequired();
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email');
    const date = screen.getByLabelText(/choose date/i);
    expect(date).toBeRequired();
    expect(date).toHaveAttribute('min', daysFromToday(0));
    expect(date).toHaveAttribute('max', daysFromToday(60));
    const guests = screen.getByLabelText(/number of guests/i);
    expect(guests).toHaveAttribute('min', '1');
    expect(guests).toHaveAttribute('max', '10');
    expect(screen.getByLabelText(/occasion/i)).toBeRequired();
  });

  it('shows the available times as options', () => {
    setup();
    times.forEach((t) => expect(screen.getByRole('option', { name: t })).toBeInTheDocument());
  });

  it('disables the time select until a date is chosen', () => {
    setup();
    const time = screen.getByLabelText(/choose time/i);
    expect(time).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/choose date/i), { target: { value: daysFromToday(2) } });
    expect(time).toBeEnabled();
  });

  it('dispatches UPDATE_TIMES when the date changes', () => {
    const { dispatch } = setup();
    const date = daysFromToday(3);
    fireEvent.change(screen.getByLabelText(/choose date/i), { target: { value: date } });
    expect(dispatch).toHaveBeenCalledWith({ type: 'UPDATE_TIMES', date });
  });

  it('keeps the submit button disabled while the form is invalid', () => {
    setup();
    expect(screen.getByRole('button', { name: /make your reservation/i })).toBeDisabled();
    expect(screen.getByText(/complete all required fields/i)).toBeInTheDocument();
  });

  it('shows an accessible error message after leaving an invalid field', async () => {
    const { user } = setup();
    const email = screen.getByLabelText(/email/i);
    await user.type(email, 'not-an-email');
    await user.tab();
    const error = screen.getByRole('alert');
    expect(error).toHaveTextContent(/valid email address/i);
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email.getAttribute('aria-describedby')).toContain('email-error');
  });

  it('shows an error for a past date', async () => {
    const { user } = setup();
    const date = screen.getByLabelText(/choose date/i);
    fireEvent.change(date, { target: { value: daysFromToday(-1) } });
    await user.click(date);
    await user.tab();
    expect(screen.getByText('The date cannot be in the past.')).toBeInTheDocument();
  });

  it('shows an error when guests are out of range', async () => {
    const { user } = setup();
    const guests = screen.getByLabelText(/number of guests/i);
    await user.clear(guests);
    await user.type(guests, '12');
    await user.tab();
    expect(screen.getByText('Number of guests must be between 1 and 10.')).toBeInTheDocument();
  });

  it('enables the button and submits the trimmed data when valid', async () => {
    const { user, submitForm } = setup();
    await fillForm(user);
    const button = screen.getByRole('button', { name: /make your reservation/i });
    expect(button).toBeEnabled();
    await user.click(button);
    expect(submitForm).toHaveBeenCalledWith({
      name: 'Anna Smith',
      email: 'anna@example.com',
      phone: '',
      date: daysFromToday(1),
      time: '18:30',
      guests: 4,
      occasion: 'Anniversary',
      requests: '',
    });
  });

  it('shows a meaningful error if the booking fails', async () => {
    const submitForm = vi.fn(() => false);
    const { user, dispatch } = setup({ submitForm });
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /make your reservation/i }));
    expect(screen.getByText(/could not complete your booking/i)).toBeInTheDocument();
    expect(dispatch).toHaveBeenLastCalledWith({ type: 'UPDATE_TIMES', date: daysFromToday(1) });
  });

  it('tells the user when no times are available', () => {
    setup({ availableTimes: [] });
    fireEvent.change(screen.getByLabelText(/choose date/i), { target: { value: daysFromToday(1) } });
    expect(screen.getByRole('option', { name: 'No times available' })).toBeInTheDocument();
    expect(screen.getByText('0 times available on this date.')).toBeInTheDocument();
  });
});
