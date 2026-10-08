/**
 * Footer.jsx — minimal sign-off with a tiny landscape silhouette.
 */
import { navLinks, site } from '../data/site.js';
import { CONTACT } from './Contact.jsx';
import { ArrowRight, Facebook, Github, Leaf, Linkedin, Mail } from './Icons.jsx';
import { GrassStrip, FlowerShape, LeafShape } from './Decor.jsx';
import './Footer.css';

export default function Footer() {
  const goTo = (id) => (e) => {
    e.preventDefault();
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  const year = site.year;

  return (
    <footer className="footer">
      <GrassStrip className="footer__grass" />

      <LeafShape className="footer__leaf-1" size={40} />
      <LeafShape className="footer__leaf-2" size={32} flip />
      <FlowerShape className="footer__flower" size={30} />

      <div className="container footer__inner">
        <div className="footer__brand">
          <a href="#home" className="footer__logo" onClick={goTo('home')}>
            <span className="footer__mark" aria-hidden="true">
              <Leaf size={22} />
            </span>
            {site.logo}
          </a>
          <p className="footer__tagline hand">{site.tagline}</p>
          <p className="footer__copy">© {year} {site.name}</p>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          <p className="footer__nav-title">Chapters</p>
          <ul>
            {navLinks.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} onClick={goTo(link.id)}>
                  <ArrowRight size={13} />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__elsewhere">
          <p className="footer__nav-title">Elsewhere</p>
          <ul>
            <li>
              <a href={`mailto:${CONTACT.email}`}>
                <Mail size={15} />
                Email
              </a>
            </li>
            <li>
              <a href={CONTACT.github} target="_blank" rel="noreferrer noopener">
                <Github size={15} />
                GitHub
              </a>
            </li>
            <li>
              <a href={CONTACT.facebook} target="_blank" rel="noreferrer noopener">
                <Facebook size={15} />
                Facebook
              </a>
            </li>
            <li>
              <a href={CONTACT.linkedin} target="_blank" rel="noreferrer noopener">
                <Linkedin size={15} />
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p className="footer__hint hand">Thanks for reading my story 🌿</p>
    </footer>
  );
}
