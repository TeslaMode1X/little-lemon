import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <ScrollToTop />
      <Header />
      <Main />
      <Footer />
    </>
  );
}

export default App;
