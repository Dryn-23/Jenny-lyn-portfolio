/**
 * ProjectModal.jsx — "Add / Edit Project" form.
 *
 * Paste a Project URL and the form tries to fill itself in (title, description,
 * preview image, favicon, host) using `fetchUrlMetadata`. If the site blocks
 * cross-origin reads, the same fields stay editable by hand — nothing breaks.
 * Everything is saved to localStorage, so no source editing is ever required.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PROJECT_CATEGORIES } from '../data/projects.js';
import { fetchGithubRepoInfo, fetchUrlMetadata } from '../utils/metadata.js';
import { fileToCompressedDataUrl, placeholderFor } from '../utils/image.js';
import { normalizeUrl, prettyUrl, safeHost } from '../utils/links.js';
import { Check, Close, Image as ImageIcon, Info, Plus, Star, Wand } from './Icons.jsx';
import './Modal.css';

const EMPTY = {
  title: '',
  description: '',
  image: '',
  category: PROJECT_CATEGORIES[0],
  technologies: [],
  liveUrl: '',
  githubUrl: '',
  year: new Date().getFullYear(),
  featured: false,
};

const SUGGESTED_TECHS = [
  'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB',
  'Python', 'Java', 'C#', 'PHP', 'MySQL', 'Tailwind', 'Git',
];

export default function ProjectModal({ open, mode = 'add', initial, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const [techDraft, setTechDraft] = useState('');
  const [status, setStatus] = useState({ state: 'idle', message: '', tried: [] });
  const [errors, setErrors] = useState({});
  const [linkInput, setLinkInput] = useState('');
  const firstFieldRef = useRef(null);
  const fetchedFor = useRef('');
  const fileRef = useRef(null);

  /* reset whenever the sheet opens */
  useEffect(() => {
    if (!open) return;
    setErrors({});
    setTechDraft('');
    setStatus({ state: 'idle', message: '', tried: [] });
    fetchedFor.current = '';
    if (mode === 'edit' && initial) {
      setForm({ ...EMPTY, ...initial, technologies: [...(initial.technologies || [])] });
      setLinkInput(initial.liveUrl || initial.githubUrl || '');
    } else {
      setForm(EMPTY);
      setLinkInput('');
    }
    const timer = window.setTimeout(() => firstFieldRef.current?.focus(), 120);
    return () => window.clearTimeout(timer);
  }, [open, mode, initial]);

  /* escape + scroll lock */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.classList.add('no-scroll');
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const set = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  /* ---------------------------------------------------- auto metadata ---- */
  const autofill = useCallback(
    async (rawUrl) => {
      const url = normalizeUrl(rawUrl);
      if (!url || fetchedFor.current === url) return;
      fetchedFor.current = url;
      setStatus({ state: 'loading', message: `Looking up ${prettyUrl(url)}…`, tried: [] });

      // GitHub repos first — its API is CORS-friendly and gives clean data.
      if (safeHost(url).includes('github.com')) {
        const repo = await fetchGithubRepoInfo(url);
        if (repo) {
          setForm((prev) => ({
            ...prev,
            title: prev.title || repo.title,
            description: prev.description || repo.description,
            liveUrl: prev.liveUrl || repo.liveUrl,
            githubUrl: url,
            image: prev.image || repo.image,
            technologies: prev.technologies.length ? prev.technologies : repo.technologies,
          }));
          setLinkInput((prev) => prev || url);
          setStatus({ state: 'success', message: 'Filled from GitHub 🌿', tried: [] });
          return;
        }
      }

      const result = await fetchUrlMetadata(url);
      if (result.ok) {
        const meta = result.meta;
        setForm((prev) => ({
          ...prev,
          title: prev.title || meta.title?.slice(0, 90) || '',
          description: prev.description || meta.description?.slice(0, 300) || '',
          image: prev.image || meta.image || '',
          liveUrl: prev.liveUrl || url,
        }));
        setLinkInput((prev) => prev || url);
        setStatus({ state: 'success', message: 'Preview details detected ✨', tried: result.tried });
      } else {
        setStatus({
          state: 'error',
          message: 'This site blocked the preview lookup — fill the fields manually.',
          tried: result.tried,
        });
      }
    },
    []
  );

  /* debounce: look up shortly after typing/pasting a link */
  useEffect(() => {
    if (!open) return;
    const url = linkInput.trim();
    if (!/\./.test(url) || url.length < 8) return;
    const timer = window.setTimeout(() => autofill(url), 850);
    return () => window.clearTimeout(timer);
  }, [linkInput, open, autofill]);

  /* ------------------------------------------------------------ techs ---- */
  const addTech = (raw) => {
    const parts = String(raw)
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    if (!parts.length) return;
    setForm((prev) => {
      const next = [...prev.technologies];
      parts.forEach((p) => {
        if (!next.some((t) => t.toLowerCase() === p.toLowerCase())) next.push(p);
      });
      return { ...prev, technologies: next };
    });
    setTechDraft('');
  };

  const removeTech = (tech) =>
    setForm((prev) => ({ ...prev, technologies: prev.technologies.filter((t) => t !== tech) }));

  /* ------------------------------------------------------------ image ---- */
  const onPickFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      set({ image: dataUrl });
    } catch (error) {
      setStatus({ state: 'error', message: error.message, tried: [] });
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  /* ----------------------------------------------------------- submit ---- */
  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Give your project a title.';
    if (!form.description.trim()) nextErrors.description = 'A short description helps visitors.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      liveUrl: form.liveUrl.trim() ? normalizeUrl(form.liveUrl) : '',
      githubUrl: form.githubUrl.trim() ? normalizeUrl(form.githubUrl) : '',
      year: Number(form.year) || new Date().getFullYear(),
    });
  };

  const preview = useMemo(
    () => ({
      image: form.image || placeholderFor(form.title || 'New project'),
      host: form.liveUrl ? prettyUrl(form.liveUrl) : form.githubUrl ? prettyUrl(form.githubUrl) : '',
    }),
    [form.image, form.title, form.liveUrl, form.githubUrl]
  );

  if (!open) return null;

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
      <button type="button" className="modal__backdrop" aria-label="Close" onClick={onClose} />

      <div className="modal__panel">
        <header className="modal__head">
          <div>
            <p className="modal__eyebrow hand">{mode === 'edit' ? 'Editing a page' : 'A new page in the journal'}</p>
            <h3 id="project-modal-title" className="modal__title">
              {mode === 'edit' ? 'Edit project' : 'Add a project'}
            </h3>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close form">
            <Close size={18} />
          </button>
        </header>

        <form className="modal__form" onSubmit={submit}>
          <div className="modal__body">
          {/* ---------- link autofill ---------- */}
          <div className="field field--hero">
            <label htmlFor="pf-link">
              Project URL <span className="field__hint">— paste a link and I&rsquo;ll try to fill the rest</span>
            </label>
            <div className="field__row">
              <input
                id="pf-link"
                type="text"
                inputMode="url"
                placeholder="https://amfaye-bites.vercel.app"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onBlur={() => autofill(linkInput)}
              />
              <button
                type="button"
                className="btn btn--sm btn--sand"
                onClick={() => autofill(linkInput)}
                disabled={!linkInput.trim() || status.state === 'loading'}
              >
                <Wand size={15} />
                {status.state === 'loading' ? 'Checking…' : 'Auto-fill'}
              </button>
            </div>
            {status.state !== 'idle' && status.state !== 'loading' && (
              <p className={`field__status field__status--${status.state}`}>
                {status.state === 'success' ? <Check size={14} /> : <Info size={14} />}
                {status.message}
              </p>
            )}
            {status.state === 'loading' && <p className="field__status field__status--loading">{status.message}</p>}
          </div>

          <div className="form-grid">
            {/* ---------- title ---------- */}
            <div className="field field--full">
              <label htmlFor="pf-title">Project title *</label>
              <input
                id="pf-title"
                ref={firstFieldRef}
                type="text"
                placeholder="Amfaye Bites"
                value={form.title}
                onChange={(e) => set({ title: e.target.value })}
                aria-invalid={Boolean(errors.title)}
              />
              {errors.title && <p className="field__error">{errors.title}</p>}
            </div>

            {/* ---------- description ---------- */}
            <div className="field field--full">
              <label htmlFor="pf-desc">Short description *</label>
              <textarea
                id="pf-desc"
                rows={3}
                placeholder="A web-based pastry and fruit shake ordering and POS system."
                value={form.description}
                onChange={(e) => set({ description: e.target.value })}
                aria-invalid={Boolean(errors.description)}
              />
              {errors.description && <p className="field__error">{errors.description}</p>}
            </div>

            {/* ---------- urls ---------- */}
            <div className="field">
              <label htmlFor="pf-live">Live demo URL</label>
              <input
                id="pf-live"
                type="text"
                inputMode="url"
                placeholder="https://…"
                value={form.liveUrl}
                onChange={(e) => set({ liveUrl: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="pf-github">GitHub URL</label>
              <input
                id="pf-github"
                type="text"
                inputMode="url"
                placeholder="https://github.com/…"
                value={form.githubUrl}
                onChange={(e) => set({ githubUrl: e.target.value })}
              />
            </div>

            {/* ---------- category + year ---------- */}
            <div className="field">
              <label htmlFor="pf-category">Category</label>
              <select id="pf-category" value={form.category} onChange={(e) => set({ category: e.target.value })}>
                {PROJECT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="pf-year">Year</label>
              <input
                id="pf-year"
                type="number"
                min="2000"
                max="2100"
                value={form.year}
                onChange={(e) => set({ year: e.target.value })}
              />
            </div>

            {/* ---------- technologies ---------- */}
            <div className="field field--full">
              <label htmlFor="pf-tech">
                Technologies <span className="field__hint">— press Enter or comma to add</span>
              </label>
              <div className="chip-input">
                {form.technologies.map((tech) => (
                  <span key={tech} className="chip">
                    {tech}
                    <button type="button" onClick={() => removeTech(tech)} aria-label={`Remove ${tech}`}>
                      <Close size={13} />
                    </button>
                  </span>
                ))}
                <input
                  id="pf-tech"
                  type="text"
                  placeholder={form.technologies.length ? 'Add another…' : 'React, Node.js, MongoDB'}
                  value={techDraft}
                  onChange={(e) => {
                    if (e.target.value.endsWith(',')) addTech(e.target.value);
                    else setTechDraft(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTech(techDraft);
                    }
                    if (e.key === 'Backspace' && !techDraft && form.technologies.length) {
                      removeTech(form.technologies[form.technologies.length - 1]);
                    }
                  }}
                  onBlur={() => addTech(techDraft)}
                />
              </div>
              <div className="chip-suggest">
                {SUGGESTED_TECHS.filter((t) => !form.technologies.includes(t)).slice(0, 7).map((t) => (
                  <button key={t} type="button" className="chip chip--ghost" onClick={() => addTech(t)}>
                    <Plus size={11} />
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* ---------- image ---------- */}
            <div className="field field--full">
              <label htmlFor="pf-image">
                Project image <span className="field__hint">— paste a URL or upload a screenshot</span>
              </label>
              <div className="field__row">
                <input
                  id="pf-image"
                  type="text"
                  placeholder="https://…/preview.png"
                  value={/^data:/.test(form.image) ? '' : form.image}
                  onChange={(e) => set({ image: e.target.value })}
                />
                <button type="button" className="btn btn--sm btn--sand" onClick={() => fileRef.current?.click()}>
                  <ImageIcon size={15} />
                  Upload
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={onPickFile} />
              {(form.image || form.title) && (
                <div className="img-preview">
                  <img src={preview.image} alt="Project preview" />
                  {form.image && (
                    <button
                      type="button"
                      className="img-preview__clear"
                      onClick={() => set({ image: '' })}
                      aria-label="Remove image"
                    >
                      <Close size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ---------- featured ---------- */}
            <div className="field field--full">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set({ featured: e.target.checked })}
                />
                <span className="switch__track" aria-hidden="true">
                  <span className="switch__thumb" />
                </span>
                <span className="switch__label">
                  <Star size={14} filled={form.featured} />
                  Feature this project
                  <em>Featured projects get a larger spotlight card.</em>
                </span>
              </label>
            </div>
          </div>

          {/* ---------- live card preview ---------- */}
          <section className="mini-preview" aria-label="Card preview">
            <p className="mini-preview__label hand">How it will look</p>
            <div className="mini-preview__card">
              <img src={preview.image} alt="" />
              <div>
                <span className="mini-preview__badge">{form.category}</span>
                <h4>{form.title || 'Untitled project'}</h4>
                <p>{form.description || 'Your short description appears here.'}</p>
                <ul className="mini-preview__tags">
                  {form.technologies.slice(0, 4).map((t) => (
                    <li key={t} className="tag">
                      {t}
                    </li>
                  ))}
                </ul>
                {preview.host && <span className="mini-preview__host">{preview.host}</span>}
              </div>
            </div>
          </section>

          </div>

          <footer className="modal__foot">
            <p className="modal__note">
              Saved in this browser. Use <strong>Export</strong> in the projects toolbar to move your
              library into code later.
            </p>
            <div className="modal__foot-actions">
              <button type="button" className="btn btn--ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn">
                {mode === 'edit' ? 'Save changes' : 'Add project'}
                <span className="btn__icon btn__icon--right" aria-hidden="true">
                  <Plus size={16} />
                </span>
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}
