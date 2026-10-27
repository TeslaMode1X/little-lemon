# Little Lemon — Table Booking Web App

Front-End Developer Capstone project (Meta / Coursera).
A responsive, accessible React web app for **Little Lemon**, a family-owned
Mediterranean restaurant in Chicago, with a fully validated table reservation form.

## Features

- **Home page** following the Little Lemon UX/UI design: hero with call to action,
  weekly specials, testimonials and the "About" section.
- **Reservation form** (`/booking`)
  - Name, email, phone (optional), date, time, number of guests, occasion, special requests.
  - Available times are loaded from the booking API and **update whenever the date changes**
    (`useReducer` + `UPDATE_TIMES` action).
  - Times already booked, and times that have already passed today, are not offered.
  - Client-side validation with clear error messages (HTML5 attributes + JavaScript validation).
  - Submit button stays disabled until the form is valid.
- **Confirmation page** (`/confirmed`) with a booking summary.
- Menu, About, Order Online, Login and 404 pages, so every link works.

## Where to find each rubric item (for reviewers)

| Rubric question | Where to look |
| --- | --- |
| UI/UX matches the Figma mockup and wireframe | Run `npm run dev`: header, hero, specials, testimonials, about, footer and the booking page |
| Semantic HTML | DevTools → Elements: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, `address`, `fieldset`/`legend` |
| Mobile and desktop layout | DevTools → device toolbar: hamburger menu and one column on mobile, grid layout from 960px (`src/index.css`) |
| Meta and Open Graph tags | `index.html`: `description`, `keywords`, `og:*` and `twitter:*` tags |
| BookingForm is a child component | `src/components/BookingForm.jsx`, rendered by `src/pages/BookingPage.jsx` |
| Available times state managed by the parent | `src/components/Main.jsx`: `useReducer(updateTimes, [], initializeTimes)`, passed down as `availableTimes` and `dispatch` |
| Client-side validation | `src/utils/validation.js` + HTML5 attributes (`required`, `min`, `max`, `type`) in `BookingForm.jsx` |
| Unit tests for the form and validation | `src/__tests__/BookingForm.test.jsx`, `src/__tests__/validation.test.js` (+ reducer, API and app tests) |
| Unit tests pass | `npm test` → 47 passed |

## Accessibility

- Semantic HTML landmarks: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, `address`.
- "Skip to main content" link and visible focus styles.
- Every input has a `<label>`; related fields grouped with `<fieldset>` / `<legend>`.
- Errors use `aria-invalid`, `aria-describedby` and `role="alert"` so screen readers announce them.
- Mobile menu button uses `aria-expanded`, `aria-controls` and an `aria-label`.
- Meaningful `alt` text on images, decorative icons hidden with `aria-hidden`.
- Colour contrast follows the style guide; `prefers-reduced-motion` is respected.

## Edge cases handled

| Case | Behaviour |
| --- | --- |
| Date in the past / more than 60 days ahead | Error message, booking blocked |
| Date with no free tables | "No tables are available on this date…" |
| Today selected late in the day | Past times are hidden |
| Time already booked (double booking) | Slot hidden; if taken during submit an error is shown and times are refreshed |
| Guests < 1, > 10 or not a whole number | Error message with the allowed range |
| Invalid email / phone, too short name | Specific error message |
| `/confirmed` opened directly | Redirected to the booking form |
| Corrupt or blocked `localStorage` | App keeps working |
| Unknown URL | 404 page |

## Tech stack

React 18 · React Router 6 · Vite 5 · Vitest + React Testing Library · plain CSS (mobile first).

## Getting started

Requirements: **Node.js 18+** and npm.

```bash
# 1. Clone the repository
git clone https://github.com/TeslaMode1X/little-lemon.git
cd little-lemon

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open the URL printed in the terminal (usually http://localhost:5173).

### Other scripts

| Command | Description |
| --- | --- |
| `npm test` | Run all unit tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |

## Tests

47 unit and integration tests in `src/__tests__/`:

- `BookingForm.test.jsx` — labels, HTML5 attributes, time options, `dispatch` on date change,
  error messages, disabled/enabled submit button, submitted data, API failure message.
- `times.test.js` — `initializeTimes`, `updateTimes` reducer, removal of past times.
- `validation.test.js` — every validation rule and boundary value.
- `api.test.js` — `fetchAPI` / `submitAPI`, double booking, corrupt storage.
- `App.test.jsx` — landmarks, navigation, mobile menu, full booking flow, redirects, 404.

## Project structure

```
src/
├── components/      # Header, Nav, Footer, Hero, Specials, Testimonials, About, BookingForm, Main
├── pages/           # HomePage, BookingPage, ConfirmedBooking, MenuPage, AboutPage, ...
├── utils/
│   ├── api.js        # fetchAPI / submitAPI (mock booking API from the course)
│   ├── times.js      # initializeTimes / updateTimes reducer
│   └── validation.js # booking validation rules and messages
├── __tests__/       # unit tests
├── App.jsx
├── main.jsx
└── index.css        # styles based on the Little Lemon style guide
```

## Notes

The booking API is the mock API provided in the course (`fetchAPI`, `submitAPI`),
extended to store bookings in `localStorage` so booked slots disappear.
Images are lightweight SVG illustrations bundled with the project.
