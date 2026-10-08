/**
 * Hero.jsx — full-bleed painted landscape, parallax drift, floating leaves and
 * a staggered text reveal on load.
 */
import { site } from '../data/site.js';
import { useParallax } from '../hooks/useParallax.js';
import { ArrowDown, ArrowRight, Leaf } from './Icons.jsx';
import { FlowerShape, LeafShape, SprigShape, GrassStrip } from './Decor.jsx';
import './Hero.css';

export default function Hero() {
  const bgRef = useParallax({ speed: 0.34 });
  const cloudRef = useParallax({ speed: 0.12 });

  const goTo = (id) => (e) => {
    e.preventDefault();
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <section id="home" className="hero">
      {/* painted scenery */}
      <div className="hero__bg" aria-hidden="true">
        <div ref={bgRef} className="hero__bg-image" />
        <div ref={cloudRef} className="hero__clouds" />
      </div>
      <div className="hero__scrim" aria-hidden="true" />

      {/* floating decorations */}
      <LeafShape className="decor hero__leaf hero__leaf--1 decor--float" size={54} />
      <LeafShape className="decor hero__leaf hero__leaf--2 decor--float-slow" size={40} flip />
      <SprigShape className="decor hero__sprig decor--float" size={62} />
      <FlowerShape className="decor hero__flower decor--float-slow" size={36} />

      <div className="hero__inner container">
        <div className="hero__content">
          <p className="hero__eyebrow hero__anim" style={{ '--d': '80ms' }}>
            <span className="hero__eyebrow-leaf" aria-hidden="true">
              <Leaf size={18} />
            </span>
            This is my story
          </p>

          <h1 className="hero__title">
            <span className="hero__line" style={{ '--d': '180ms' }}>
              Hi, I&rsquo;m <span className="hero__name">Jenny-lyn</span>.
            </span>
          </h1>

          <h2 className="hero__role">
            <span className="hero__line" style={{ '--d': '320ms' }}>
              {site.role}
            </span>
          </h2>

          <p className="hero__intro hero__anim" style={{ '--d': '460ms' }}>
            I&rsquo;m passionate about building websites, applications, and digital experiences while
            continuously learning new technologies.
          </p>

          <div className="hero__actions hero__anim" style={{ '--d': '600ms' }}>
            <a href="#journey" className="btn" onClick={goTo('journey')}>
              Explore My Journey
              <span className="btn__icon btn__icon--down" aria-hidden="true">
                <ArrowDown size={17} />
              </span>
            </a>
            <a href="#projects" className="btn btn--ghost" onClick={goTo('projects')}>
              View My Projects
              <span className="btn__icon btn__icon--right" aria-hidden="true">
                <ArrowRight size={17} />
              </span>
            </a>
          </div>

          <dl className="hero__facts hero__anim" style={{ '--d': '740ms' }}>
            <div>
              <dt>Focus</dt>
              <dd>Web &amp; Software Development</dd>
            </div>
            <div>
              <dt>Currently</dt>
              <dd>BSIT Student</dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>{site.location}</dd>
            </div>
          </dl>
        </div>
      </div>

      <a href="#journey" className="hero__scroll" onClick={goTo('journey')} aria-label="Scroll to my journey">
        <span className="hero__scroll-dot" aria-hidden="true" />
        <span className="hero__scroll-label">scroll to explore</span>
      </a>

      <GrassStrip className="hero__grass" />
    </section>
  );
}
