/**
 * ProjectDetails.jsx — full preview sheet for a single project.
 */
import { useEffect, useState } from 'react';
import { placeholderFor } from '../utils/image.js';
import { normalizeUrl, prettyUrl } from '../utils/links.js';
import { Close, ExternalLink, Github, Pencil, Star, Trash } from './Icons.jsx';
import './Modal.css';

export default function ProjectDetails({ project, onClose, onEdit, onDelete, onToggleFeatured }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!project) return;
    setFailed(false);
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.body.classList.add('no-scroll');
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('keydown', onKey);
    };
  }, [project, onClose]);

  if (!project) return null;

  const liveUrl = normalizeUrl(project.liveUrl);
  const repoUrl = normalizeUrl(project.githubUrl);
  const image = project.image && !failed ? project.image : placeholderFor(project.title);

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={`${project.title} details`}>
      <button type="button" className="modal__backdrop" aria-label="Close" onClick={onClose} />

      <div className="modal__panel">
        <header className="modal__head">
          <div>
            <p className="modal__eyebrow hand">{project.category}</p>
            <h3 className="modal__title">{project.title}</h3>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close details">
            <Close size={18} />
          </button>
        </header>

        <div className="details__hero">
          <img src={image} alt={`${project.title} preview`} onError={() => setFailed(true)} />
          <div className="details__badges">
            <span className="project-card__badge">{project.year}</span>
            {project.featured && (
              <span className="project-card__featured">
                <Star size={13} filled />
                Featured
              </span>
            )}
          </div>
        </div>

        <div className="modal__body">
          <div className="details__body">
            <p className="details__meta">
              {project.technologies.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </p>

            <p className="details__desc">{project.description || 'No description added yet.'}</p>

            {(liveUrl || repoUrl) && (
              <dl className="details__links">
                {liveUrl && (
                  <div>
                    <dt>Live</dt>
                    <dd>{prettyUrl(liveUrl)}</dd>
                  </div>
                )}
                {repoUrl && (
                  <div>
                    <dt>Source</dt>
                    <dd>{prettyUrl(repoUrl)}</dd>
                  </div>
                )}
              </dl>
            )}

            <div className="details__actions">
              {liveUrl && (
                <a className="btn" href={liveUrl} target="_blank" rel="noreferrer noopener">
                  View Live Demo
                  <span className="btn__icon btn__icon--right" aria-hidden="true">
                    <ExternalLink size={16} />
                  </span>
                </a>
              )}
              {repoUrl && (
                <a className="btn btn--ghost" href={repoUrl} target="_blank" rel="noreferrer noopener">
                  <Github size={16} />
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>

        <footer className="modal__foot">
          <div className="details__actions">
            <button type="button" className="btn btn--sm btn--sand" onClick={() => onToggleFeatured(project.id)}>
              <Star size={15} filled={project.featured} />
              {project.featured ? 'Unfeature' : 'Feature'}
            </button>
            <button type="button" className="btn btn--sm btn--sand" onClick={() => onEdit(project)}>
              <Pencil size={15} />
              Edit
            </button>
            <button type="button" className="btn btn--sm btn--danger" onClick={() => onDelete(project)}>
              <Trash size={15} />
              Delete
            </button>
          </div>
          <button type="button" className="btn btn--sm btn--ghost" onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}
