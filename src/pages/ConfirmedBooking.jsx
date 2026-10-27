import { Link, Navigate, useLocation } from 'react-router-dom';

/** Shown after a successful reservation; displays the booking summary. */
function ConfirmedBooking() {
  const { state } = useLocation();
  const booking = state?.booking;

  // Edge case: page opened directly without a booking -> send to the form.
  if (!booking) return <Navigate to="/booking" replace />;

  const [y, m, d] = booking.date.split('-').map(Number);
  const prettyDate = new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <section className="confirmation container" aria-labelledby="confirmation-title">
      <p className="confirmation__icon" aria-hidden="true">✓</p>
      <h1 id="confirmation-title" className="section-title">Your table is booked!</h1>
      <p role="status">Thank you, {booking.name}. A confirmation has been sent to {booking.email}.</p>
      <dl className="confirmation__details">
        <div><dt>Date</dt><dd>{prettyDate}</dd></div>
        <div><dt>Time</dt><dd>{booking.time}</dd></div>
        <div><dt>Guests</dt><dd>{booking.guests}</dd></div>
        <div><dt>Occasion</dt><dd>{booking.occasion}</dd></div>
        {booking.requests && <div><dt>Requests</dt><dd>{booking.requests}</dd></div>}
      </dl>
      <div className="confirmation__actions">
        <Link to="/" className="button button--primary">Back to Home</Link>
        <Link to="/booking" className="button button--secondary">Make another booking</Link>
      </div>
    </section>
  );
}

export default ConfirmedBooking;
