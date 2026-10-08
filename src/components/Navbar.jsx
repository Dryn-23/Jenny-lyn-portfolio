/**
 * Navbar.jsx — sticky navigation with scroll-spy, scroll progress bar and an
 * animated hamburger menu on small screens.
 */
import { useEffect, useRef, useState } from 'react';
import { navLinks, site } from '../data/site.js';
import { useScrollSpy } from '../hooks/useScrollSpy.js';
import { Close, Leaf, Menu } from './Icons.jsx';
import './Navbar.css';

const SECTION_IDS = navLinks.map((l) => l.id);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useScrollSpy(SECTION_IDS);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);

  /* condensed bar + reading progress */
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      setScrolled(y > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  /* lock the page & handle escape while the mobile menu is open */
  useEffect(() => {
    document.body.classList.toggle('no-scroll', menuOpen);
    const onKey = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
    };
  }, [menuOpen]);

  /* close the menu if the viewport grows into desktop territory */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 861px)');
    const onChange = (e) => e.matches && setMenuOpen(false);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const goTo = (id) => (event) => {
    event.preventDefault();
    setMenuOpen(false);
    const target = document.getElementById(id);
    if (!target) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    // keep the URL shareable without adding jumps to history
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${menuOpen ? 'is-open' : ''}`}>
      <div className="nav__inner container">
        <a className="nav__brand" href="#home" onClick={goTo('home')} aria-label={`${site.logo} — back to top`}>
          <span className="nav__brand-mark" aria-hidden="true">
            <Leaf size={24} />
          </span>
          <span className="nav__brand-text">{site.logo}</span>
        </a>

        <nav className="nav__links" aria-label="Main">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={goTo(link.id)}
              className={`nav__link ${active === link.id ? 'is-active' : ''}`}
              aria-current={active === link.id ? 'page' : undefined}
            >
              <span>{link.label}</span>
            </a>
          ))}
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className={`nav__toggle ${menuOpen ? 'is-active' : ''}`}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="nav__toggle-icon" aria-hidden="true">
            {menuOpen ? <Close size={22} /> : <Menu size={22} />}
          </span>
        </button>
      </div>

      <div className="nav__progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      {/* --- mobile panel --- */}
      <div
        id="mobile-menu"
        ref={panelRef}
        className={`nav__panel ${menuOpen ? 'is-open' : ''}`}
        hidden={!menuOpen}
      >
        <div className="nav__panel-inner">
          <nav aria-label="Mobile">
            <ul>
              {navLinks.map((link, i) => (
                <li key={link.id} style={{ '--i': i }}>
                  <a
                    href={`#${link.id}`}
                    onClick={goTo(link.id)}
                    className={active === link.id ? 'is-active' : ''}
                  >
                    <span className="nav__panel-index">{String(i + 1).padStart(2, '0')}</span>
                    <span className="nav__panel-label">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className="nav__panel-note hand">Every scroll tells a chapter 🌿</p>
        </div>
      </div>
      <button
        type="button"
        className={`nav__scrim ${menuOpen ? 'is-open' : ''}`}
        tabIndex={menuOpen ? 0 : -1}
        aria-hidden={!menuOpen}
        aria-label="Close menu"
        onClick={() => setMenuOpen(false)}
      />
    </header>
  );
}
