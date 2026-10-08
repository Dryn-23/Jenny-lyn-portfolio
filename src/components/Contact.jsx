/**
 * Contact.jsx — "Let's Connect": channel cards + a friendly contact form.
 *
 * There is no backend in a static portfolio, so the form validates locally and
 * then hands the message to the visitor's mail client (mailto). Swap
 * `handleSubmit` for a fetch() to Formspree/Getform/your own API when you have
 * an endpoint — the payload is already shaped for it.
 */
import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useToast } from './Toast.jsx';
import { Check, Facebook, Github, Linkedin, Mail, Sparkle } from './Icons.jsx';
import { LeafShape, Note, SprigShape } from './Decor.jsx';
import './Contact.css';

/** Change these to your real profiles — they are the only details to update. */
export const CONTACT = {
  email: 'Jenny-lyn.Ibañez @example.com',
  github: 'https://github.com/Jenny-lyn Ibañez ',
  facebook: 'https://facebook.com/Jenny-lyn Ibañez ',
  linkedin: 'https://linkedin.com/in/Jenny-lyn Ibañez ',
};

const CHANNELS = [
  { key: 'email', label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}`, Icon: Mail },
  { key: 'github', label: 'GitHub', value: 'github.com/Jenny-lyn Ibañez ', href: CONTACT.github, Icon: Github },
  { key: 'facebook', label: 'Facebook', value: 'facebook.com/Jenny-lyn Ibañez ', href: CONTACT.facebook, Icon: Facebook },
  { key: 'linkedin', label: 'LinkedIn', value: 'linkedin.com/in/Jenny-lyn Ibañez ', href: CONTACT.linkedin, Icon: Linkedin },
];

const EMPTY = { name: '', email: '', message: '' };

export default function Contact() {
  const toast = useToast();
  const { ref: headRef, inView: headIn } = useScrollReveal({ threshold: 0.35 });
  const { ref: formRef, inView: formIn } = useScrollReveal({ threshold: 0.15 });
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const set = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'Please tell me your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = 'A valid email helps me reply.';
    if (form.message.trim().length < 10) next.message = 'A few more words, please (10+ characters).';
    setErrors(next);
    if (Object.keys(next).length) return;

    const subject = encodeURIComponent(`Hello Jenny-lyn — from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`);
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;

    setSent(true);
    setForm(EMPTY);
    toast('Opening your email app — thanks for reaching out 🌿');
    window.setTimeout(() => setSent(false), 6000);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      toast('Email address copied 📋', 'info');
    } catch {
      toast('Copy failed — the address is shown below.', 'info');
    }
  };

  return (
    <section id="contact" className="section contact">
      <LeafShape className="decor contact__leaf decor--float" size={48} />
      <SprigShape className="decor contact__sprig decor--float-slow" size={58} />

      <div className="container">
        <header
          ref={headRef}
          className={`section-head section-head--center reveal ${headIn ? 'is-visible' : ''}`}
        >
          <p className="eyebrow eyebrow--outline">
            <Sparkle size={16} />
            Contact
          </p>
          <h2>Let&rsquo;s Connect</h2>
          <p className="lead">
            Have a project, idea, or opportunity? I&rsquo;d love to hear from you — whether it&rsquo;s
            an internship, a group project, or just a note about something I built.
          </p>
        </header>

        <div className="contact__grid">
          {/* --- channels --- */}
          <div className="contact__channels">
            {CHANNELS.map(({ key, label, value, href, Icon }, i) => (
              <a
                key={key}
                className="channel"
                href={href}
                target={key === 'email' ? undefined : '_blank'}
                rel="noreferrer noopener"
                style={{ '--reveal-delay': `${i * 70}ms` }}
              >
                <span className="channel__icon" aria-hidden="true">
                  <Icon size={19} />
                </span>
                <span className="channel__text">
                  <strong>{label}</strong>
                  <em>{value}</em>
                </span>
                <span className="channel__arrow" aria-hidden="true">
                  →
                </span>
              </a>
            ))}

            <button type="button" className="btn btn--sand contact__copy" onClick={copyEmail}>
              <Mail size={16} />
              Copy my email address
            </button>

            <Note
              className="contact__note"
              text={'Say hi —\nI always reply.'}
              rotate={-5}
              arrow="curve"
            />
          </div>

          {/* --- form --- */}
          <form
            ref={formRef}
            className={`contact__form card reveal reveal--right ${formIn ? 'is-visible' : ''}`}
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="field">
              <label htmlFor="c-name">Name</label>
              <input
                id="c-name"
                type="text"
                autoComplete="name"
                placeholder="Juan Dela Cruz"
                value={form.name}
                onChange={(e) => set({ name: e.target.value })}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <p className="field__error">{errors.name}</p>}
            </div>

            <div className="field">
              <label htmlFor="c-email">Email</label>
              <input
                id="c-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => set({ email: e.target.value })}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && <p className="field__error">{errors.email}</p>}
            </div>

            <div className="field">
              <label htmlFor="c-message">Message</label>
              <textarea
                id="c-message"
                rows={5}
                placeholder="Tell me about your project or idea…"
                value={form.message}
                onChange={(e) => set({ message: e.target.value })}
                aria-invalid={Boolean(errors.message)}
              />
              {errors.message && <p className="field__error">{errors.message}</p>}
            </div>

            <button type="submit" className="btn btn--block">
              Send Message
              <span className="btn__icon btn__icon--right" aria-hidden="true">
                <Mail size={17} />
              </span>
            </button>

            {sent && (
              <p className="contact__sent" role="status">
                <Check size={15} />
                Thank you! Your email app should be open now.
              </p>
            )}

            <p className="contact__form-note">
              This is a static portfolio, so the form opens your email app with the message ready to
              send. Prefer typing directly? Write to{' '}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
