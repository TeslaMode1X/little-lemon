import { useMemo, useState } from 'react';
import {
  MAX_GUESTS,
  MIN_GUESTS,
  OCCASIONS,
  getDateBounds,
  validateBooking,
} from '../utils/validation';

const INITIAL_VALUES = {
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  guests: '2',
  occasion: '',
  requests: '',
};

/**
 * Table reservation form.
 *
 * Validation runs on every change; an error is shown once a field has been
 * touched (blurred) or the user tried to submit. HTML5 attributes (required,
 * min, max, type) are kept as a first line of defence, but `noValidate` lets
 * us show consistent, accessible error messages instead of browser bubbles.
 *
 * @param {object} props
 * @param {string[]} props.availableTimes times available for the selected date
 * @param {Function} props.dispatch reducer dispatch, called with UPDATE_TIMES on date change
 * @param {(data: object) => boolean} props.submitForm submits the booking; returns success
 */
function BookingForm({ availableTimes = [], dispatch, submitForm }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { min, max } = getDateBounds();
  const errors = useMemo(() => validateBooking(values, availableTimes), [values, availableTimes]);
  const isValid = Object.keys(errors).length === 0;

  // Only surface an error after the user has interacted with the field.
  const errorFor = (field) => (touched[field] ? errors[field] : undefined);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSubmitError('');

    if (name === 'date') {
      // A new date means a new set of times: reset the chosen time.
      setValues((prev) => ({ ...prev, date: value, time: '' }));
      dispatch({ type: 'UPDATE_TIMES', date: value });
      return;
    }
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Mark all fields as touched so every outstanding error is displayed.
    setTouched(Object.fromEntries(Object.keys(INITIAL_VALUES).map((key) => [key, true])));
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    const booking = {
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      requests: values.requests.trim(),
      guests: Number(values.guests),
    };
    const success = submitForm(booking);
    if (!success) {
      setSubmitError('Sorry, we could not complete your booking. The time may have just been taken — please choose another time and try again.');
      // Refresh the times so a slot taken in the meantime disappears.
      dispatch({ type: 'UPDATE_TIMES', date: values.date });
      setValues((prev) => ({ ...prev, time: '' }));
    }
    setIsSubmitting(false);
  };

  /** Common accessibility props for a field and its error message. */
  const fieldProps = (field, hintId) => {
    const error = errorFor(field);
    const describedBy = [hintId, error ? `${field}-error` : null].filter(Boolean).join(' ');
    return {
      id: field,
      name: field,
      value: values[field],
      onChange: handleChange,
      onBlur: handleBlur,
      'aria-invalid': error ? 'true' : 'false',
      'aria-describedby': describedBy || undefined,
      className: error ? 'input input--error' : 'input',
    };
  };

  // Plain render helper (not a component) so messages aren't remounted every render.
  const renderError = (field) =>
    errorFor(field) ? (
      <p id={`${field}-error`} className="field__error" role="alert">
        {errorFor(field)}
      </p>
    ) : null;

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate aria-labelledby="booking-form-title">
      <h2 id="booking-form-title" className="sr-only">Reservation details</h2>
      <p className="booking-form__note">Fields marked with <span aria-hidden="true">*</span><span className="sr-only">an asterisk</span> are required.</p>

      <fieldset>
        <legend>Your details</legend>

        <div className="field">
          <label htmlFor="name">Full name <span aria-hidden="true">*</span></label>
          <input type="text" autoComplete="name" required maxLength={50} {...fieldProps('name')} />
          {renderError('name')}
        </div>

        <div className="field">
          <label htmlFor="email">Email <span aria-hidden="true">*</span></label>
          <input type="email" autoComplete="email" required {...fieldProps('email', 'email-hint')} />
          <p id="email-hint" className="field__hint">We'll send your confirmation here.</p>
          {renderError('email')}
        </div>

        <div className="field">
          <label htmlFor="phone">Phone (optional)</label>
          <input type="tel" autoComplete="tel" {...fieldProps('phone')} />
          {renderError('phone')}
        </div>
      </fieldset>

      <fieldset>
        <legend>Your reservation</legend>

        <div className="field">
          <label htmlFor="date">Choose date <span aria-hidden="true">*</span></label>
          <input type="date" required min={min} max={max} {...fieldProps('date')} />
          {renderError('date')}
        </div>

        <div className="field">
          <label htmlFor="time">Choose time <span aria-hidden="true">*</span></label>
          <select required disabled={!values.date} {...fieldProps('time', 'time-hint')}>
            <option value="">
              {!values.date ? 'Select a date first' : availableTimes.length ? 'Select a time' : 'No times available'}
            </option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          <p id="time-hint" className="field__hint" aria-live="polite">
            {values.date
              ? `${availableTimes.length} time${availableTimes.length === 1 ? '' : 's'} available on this date.`
              : 'Available times appear once you choose a date.'}
          </p>
          {renderError('time')}
        </div>

        <div className="field">
          <label htmlFor="guests">Number of guests <span aria-hidden="true">*</span></label>
          <input type="number" required min={MIN_GUESTS} max={MAX_GUESTS} step="1" inputMode="numeric" {...fieldProps('guests', 'guests-hint')} />
          <p id="guests-hint" className="field__hint">Between {MIN_GUESTS} and {MAX_GUESTS} guests. For larger groups please call us.</p>
          {renderError('guests')}
        </div>

        <div className="field">
          <label htmlFor="occasion">Occasion <span aria-hidden="true">*</span></label>
          <select required {...fieldProps('occasion')}>
            <option value="">Select an occasion</option>
            {OCCASIONS.map((occasion) => (
              <option key={occasion} value={occasion}>{occasion}</option>
            ))}
          </select>
          {renderError('occasion')}
        </div>

        <div className="field">
          <label htmlFor="requests">Special requests (optional)</label>
          <textarea rows={3} maxLength={300} {...fieldProps('requests', 'requests-hint')} />
          <p id="requests-hint" className="field__hint">{values.requests.length}/300 characters</p>
          {renderError('requests')}
        </div>
      </fieldset>

      {submitError && (
        <p className="form-error" role="alert">{submitError}</p>
      )}

      <button
        type="submit"
        className="button button--primary button--block"
        disabled={!isValid || isSubmitting}
        aria-describedby={!isValid ? 'submit-hint' : undefined}
      >
        {isSubmitting ? 'Booking…' : 'Make Your Reservation'}
      </button>
      {!isValid && (
        <p id="submit-hint" className="field__hint field__hint--center">
          Please complete all required fields to enable the button.
        </p>
      )}
    </form>
  );
}

export default BookingForm;
