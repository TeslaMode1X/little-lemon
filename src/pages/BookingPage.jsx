import BookingForm from '../components/BookingForm';

/**
 * Reservation page. State (available times) lives in App so it survives
 * navigation; this page only lays out the form.
 */
function BookingPage({ availableTimes, dispatch, submitForm }) {
  return (
    <section className="booking" aria-labelledby="booking-title">
      <div className="booking__banner">
        <div className="container">
          <h1 id="booking-title" className="display-title">Reserve a Table</h1>
          <p className="lead">Choose a date, time and the number of guests. We'll keep your table ready.</p>
        </div>
      </div>
      <div className="container booking__content">
        <BookingForm availableTimes={availableTimes} dispatch={dispatch} submitForm={submitForm} />
        <aside className="booking__info" aria-labelledby="booking-info-title">
          <h2 id="booking-info-title">Good to know</h2>
          <ul>
            <li>Open daily from 17:00 to 23:30.</li>
            <li>Tables are held for 15 minutes after the booking time.</li>
            <li>Bookings are accepted up to 60 days in advance.</li>
            <li>Groups larger than 10: call <a href="tel:+13125550123">(312) 555-0123</a>.</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}

export default BookingPage;
