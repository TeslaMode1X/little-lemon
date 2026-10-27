import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="page container placeholder" aria-labelledby="not-found-title">
      <h1 id="not-found-title" className="section-title">Page not found</h1>
      <p>Sorry, the page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="button button--primary">Back to Home</Link>
    </section>
  );
}

export default NotFoundPage;
