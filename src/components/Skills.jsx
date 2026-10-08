/**
 * Skills.jsx — rounded skill cards + tags. Deliberately not a progress-bar
 * template: each group is a little "journal card" with softly animating tags.
 */
import { skillGroups, softSkills } from '../data/site.js';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { Code, Git, Layers, Layout, Sparkle } from './Icons.jsx';
import { LeafShape, SprigShape } from './Decor.jsx';
import './Skills.css';

const ICONS = { layout: Layout, code: Code, layers: Layers, git: Git };

export default function Skills() {
  const { ref: headRef, inView: headIn } = useScrollReveal({ threshold: 0.4 });

  return (
    <section id="skills" className="section section--tint skills">
      <LeafShape className="decor skills__leaf decor--float" size={50} />
      <SprigShape className="decor skills__sprig decor--float-slow" size={68} />

      <div className="container">
        <header ref={headRef} className={`section-head section-head--center reveal ${headIn ? 'is-visible' : ''}`}>
          <p className="eyebrow eyebrow--outline">
            <Sparkle size={16} />
            Skills
          </p>
          <h2>Tools I keep in my bag</h2>
          <p className="lead">
            I&rsquo;m a student, so think of these as &ldquo;comfortable&rdquo; versus &ldquo;currently
            learning&rdquo; rather than finished — every card here is something I&rsquo;m actively using
            in class or in a personal build.
          </p>
          <ul className="skills__legend" aria-label="How to read these labels">
            <li>
              <span className="skill-tag__level skill-tag__level--comfortable">Comfortable</span>
              <span>I can build with it without much looking-up</span>
            </li>
            <li>
              <span className="skill-tag__level skill-tag__level--learning">Learning</span>
              <span>Studying it now / used in recent projects</span>
            </li>
            <li>
              <span className="skill-tag__level skill-tag__level--exploring">Exploring</span>
              <span>Just getting started — excited about it</span>
            </li>
          </ul>
        </header>

        <div className="skills__grid">
          {skillGroups.map((group, gi) => {
            const Icon = ICONS[group.icon] || Sparkle;
            const { ref, inView } = useScrollReveal({ threshold: 0.25 });
            return (
              <article
                key={group.id}
                ref={ref}
                className={`skill-card reveal reveal--scale ${inView ? 'is-visible' : ''}`}
                style={{ '--reveal-delay': `${gi * 90}ms` }}
              >
                <span className="skill-card__wash" aria-hidden="true" />
                <header className="skill-card__head">
                  <span className="skill-card__icon" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <div>
                    <h3 className="skill-card__title">{group.label}</h3>
                    <p className="skill-card__caption">{group.caption}</p>
                  </div>
                </header>

                <ul className="skill-card__tags">
                  {group.skills.map((skill, si) => (
                    <li
                      key={skill.name}
                      className="skill-tag"
                      style={{ '--tag-delay': `${si * 70}ms` }}
                    >
                      <span className="skill-tag__name">{skill.name}</span>
                      <span className="sr-only">{skill.level}</span>
                      <span
                        className={`skill-tag__level skill-tag__level--${skill.level.toLowerCase()}`}
                        aria-hidden="true"
                      >
                        {skill.level}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="skills__soft">
          <p className="skills__soft-label hand">Beyond the code</p>
          <ul className="skills__soft-list">
            {softSkills.map((s, i) => (
              <li key={s} className="tag tag--muted" style={{ '--chip-delay': `${i * 45}ms` }}>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
