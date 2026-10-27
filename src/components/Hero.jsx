import { Link } from 'react-router-dom';

/** Home page hero banner with call to action to reserve a table. */
function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__inner">
        <div className="hero__text">
          <h1 id="hero-title" className="display-title">Little Lemon</h1>
          <p className="subtitle">Chicago</p>
          <p className="lead">
            We are a family owned Mediterranean restaurant, focused on traditional
            recipes served with a modern twist.
          </p>
          <Link to="/booking" className="button button--primary">Reserve a Table</Link>
        </div>
        <img className="hero__image" src="/hero.svg" alt="A plate of Little Lemon's signature Mediterranean dish" width="400" height="260" />
      </div>
    </section>
  );
}

export default Hero;
