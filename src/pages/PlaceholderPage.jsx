import { Link } from 'react-router-dom';

/** Generic page for features outside the capstone scope (e.g. Order Online, Login). */
function PlaceholderPage({ title }) {
  return (
    <section className="page container placeholder" aria-labelledby="placeholder-title">
      <h1 id="placeholder-title" className="section-title">{title}</h1>
      <p>This feature is coming soon. In the meantime you can reserve a table online.</p>
      <Link to="/booking" className="button button--primary">Reserve a Table</Link>
    </section>
  );
}

export default PlaceholderPage;
