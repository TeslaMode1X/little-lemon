import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scrolls to the top on every route change (SPA navigation keeps scroll otherwise). */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo?.(0, 0);
  }, [pathname]);
  return null;
}

export default ScrollToTop;
