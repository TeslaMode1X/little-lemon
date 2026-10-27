import { Link } from 'react-router-dom';
import { NAV_LINKS } from './Nav';

/** Site footer with doormat navigation, contact details and social links. */
function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <img src="/logo.svg" alt="Little Lemon logo" width="72" height="72" />

        <nav aria-label="Footer navigation">
          <h2 className="footer__title">Navigation</h2>
          <ul>
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}><Link to={to}>{label}</Link></li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="footer-contact">
          <h2 id="footer-contact" className="footer__title">Contact</h2>
          <address>
            <p>678 Pisa Ave, Chicago, IL 60611</p>
            <p><a href="tel:+13125550123">(312) 555-0123</a></p>
            <p><a href="mailto:hello@littlelemon.com">hello@littlelemon.com</a></p>
          </address>
        </section>

        <section aria-labelledby="footer-social">
          <h2 id="footer-social" className="footer__title">Social Media</h2>
          <ul>
            <li><a href="https://www.facebook.com" target="_blank" rel="noreferrer">Facebook<span className="sr-only"> (opens in a new tab)</span></a></li>
            <li><a href="https://www.instagram.com" target="_blank" rel="noreferrer">Instagram<span className="sr-only"> (opens in a new tab)</span></a></li>
            <li><a href="https://www.x.com" target="_blank" rel="noreferrer">X / Twitter<span className="sr-only"> (opens in a new tab)</span></a></li>
          </ul>
        </section>
      </div>
      <p className="footer__copy">© {new Date().getFullYear()} Little Lemon. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
