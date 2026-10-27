import { useReducer } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { submitAPI } from '../utils/api';
import { initializeTimes, updateTimes } from '../utils/times';
import HomePage from '../pages/HomePage';
import BookingPage from '../pages/BookingPage';
import ConfirmedBooking from '../pages/ConfirmedBooking';
import MenuPage from '../pages/MenuPage';
import AboutPage from '../pages/AboutPage';
import PlaceholderPage from '../pages/PlaceholderPage';
import NotFoundPage from '../pages/NotFoundPage';

/**
 * Main content area: defines the routes and owns the booking state.
 * The available times are managed here with useReducer (parent of BookingPage
 * -> BookingForm) and passed down as props together with `dispatch`, so the
 * state survives navigation and BookingForm stays a presentational child.
 */
function Main() {
  const [availableTimes, dispatch] = useReducer(updateTimes, [], initializeTimes);
  const navigate = useNavigate();

  /** Sends the booking to the API and navigates to the confirmation on success. */
  const submitForm = (formData) => {
    const success = submitAPI(formData);
    if (success) navigate('/confirmed', { state: { booking: formData } });
    return success;
  };

  return (
    <main id="main-content" tabIndex={-1}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route
          path="/booking"
          element={<BookingPage availableTimes={availableTimes} dispatch={dispatch} submitForm={submitForm} />}
        />
        <Route path="/confirmed" element={<ConfirmedBooking />} />
        <Route path="/order-online" element={<PlaceholderPage title="Order Online" />} />
        <Route path="/login" element={<PlaceholderPage title="Login" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  );
}

export default Main;
