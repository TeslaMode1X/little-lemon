import { Link } from 'react-router-dom';
import Nav from './Nav';

/** Page header: logo + main navigation. */
function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__logo" aria-label="Little Lemon home page">
          <img src="/logo.svg" alt="" width="40" height="40" />
          <span>LITTLE LEMON</span>
        </Link>
        <Nav />
      </div>
    </header>
  );
}

export default Header;
