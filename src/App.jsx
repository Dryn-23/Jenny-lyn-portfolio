/**
 * App.jsx — page composition.
 * Each section is a self-contained component; content lives in src/data.
 */
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Journey from './components/Journey.jsx';
import Skills from './components/Skills.jsx';
import Projects from './components/Projects.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import BackToTop from './components/BackToTop.jsx';
import { ToastProvider } from './components/Toast.jsx';
import './styles/site.css';

export default function App() {
  return (
    <ToastProvider>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Journey />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </ToastProvider>
  );
}
