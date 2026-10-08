/**
 * Journey.jsx — the story timeline. Chapters reveal on scroll, the spine fills
 * as you read down the page, and each chapter alternates its illustration side.
 */
import { useEffect, useRef } from 'react';
import { chapters, site } from '../data/site.js';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { ArrowRight, Leaf, Sparkle } from './Icons.jsx';
import { MountainDivider, Note, Squiggle } from './Decor.jsx';
import './Journey.css';

/** One chapter card (text + optional illustration / note). */
function Chapter({ chapter, index }) {
  const { ref, inView } = useScrollReveal({ threshold: 0.2 });
  const flip = index % 2 === 1;

  const goTo = (id) => (e) => {
    e.preventDefault();
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <li
      ref={ref}
      className={`chapter ${inView ? 'is-visible' : ''} ${flip ? 'chapter--flip' : ''}`}
      style={{ '--delay': `${index * 60}ms` }}
    >
      <div className="chapter__node" aria-hidden="true">
        <span className="chapter__node-dot" />
      </div>

      <div className="chapter__card card">
        <div className="chapter__text">
          <p className="chapter__eyebrow eyebrow">
            <span className="eyebrow__dot" aria-hidden="true" />
            Chapter {chapter.number}
          </p>
          <h3 className="chapter__title">{chapter.title}</h3>
          <Squiggle width={148} className="chapter__squiggle" />
          {chapter.paragraphs.map((text) => (
            <p key={text} className="chapter__para">
              {text}
            </p>
          ))}

          {chapter.number === '02' && (
            <ul className="chapter__chips" aria-label="Technologies I am learning now">
              {['HTML', 'CSS', 'JavaScript', 'Python', 'Java', 'React'].map((t, i) => (
                <li key={t} className="tag" style={{ '--chip-delay': `${i * 60}ms` }}>
                  {t}
                </li>
              ))}
            </ul>
          )}

          {chapter.cta && (
            <a href={`#${chapter.cta.target}`} className="btn" onClick={goTo(chapter.cta.target)}>
              {chapter.cta.label}
              <span className="btn__icon btn__icon--right" aria-hidden="true">
                <ArrowRight size={17} />
              </span>
            </a>
          )}
        </div>

        <div className="chapter__media">
          {chapter.illustration ? (
            <figure className="chapter__figure">
              <img
                src={chapter.illustration}
                alt={chapter.illustrationAlt || chapter.title}
                loading="lazy"
                decoding="async"
                className="chapter__img"
              />
            </figure>
          ) : (
            <div className="chapter__quote">
              <Sparkle size={22} className="chapter__quote-icon" />
              <p className="hand">
                {chapter.number === '03'
                  ? '“Every project is a page in the journal.”'
                  : '“Still learning. Still curious. Still building.”'}
              </p>
            </div>
          )}

          {chapter.note && (
            <Note
              className={`chapter__note chapter__note--${chapter.note.position}`}
              text={chapter.note.text}
              rotate={chapter.note.rotate}
              arrow="curve"
            />
          )}
        </div>
      </div>
    </li>
  );
}

export default function Journey() {
  const { ref: headRef, inView: headIn } = useScrollReveal({ threshold: 0.4 });
  const timelineRef = useRef(null);

  /* fill the timeline spine as the reader scrolls through it */
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    let ticking = false;
    const update = () => {
      ticking = false;
      if (reduce) {
        el.style.setProperty('--journey-progress', '1');
        return;
      }
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh * 0.35;
      const passed = vh * 0.72 - rect.top;
      const p = Math.max(0, Math.min(1, passed / total));
      el.style.setProperty('--journey-progress', p.toFixed(3));
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

  return (
    <section id="journey" className="section journey">
      <MountainDivider className="journey__divider" />
      <Leaf className="decor journey__leaf decor--float" size={46} />

      <div className="container">
        <header ref={headRef} className={`section-head reveal ${headIn ? 'is-visible' : ''}`}>
          <p className="eyebrow eyebrow--outline">
            <Leaf size={16} />
            My Journey
          </p>
          <h2>Chapter by chapter, into tech</h2>
          <p className="lead">
            I keep this journey the way I keep a journal — a few honest chapters about where I
            started, what I&rsquo;m learning, what I&rsquo;ve built, and where I&rsquo;m headed next.
            Scroll on and read it with me.
          </p>
        </header>

        <ol className="timeline" ref={timelineRef}>
          <span className="timeline__spine" aria-hidden="true">
            <span className="timeline__spine-fill" />
          </span>

          {chapters.map((chapter, i) => (
            <Chapter key={chapter.number} chapter={chapter} index={i} />
          ))}
        </ol>

        <p className="journey__signoff hand">
          — written by {site.name.split(' ')[0]}, still writing new pages 🌱
        </p>
      </div>
    </section>
  );
}
