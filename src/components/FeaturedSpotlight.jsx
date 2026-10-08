/**
 * FeaturedSpotlight.jsx — the large "FEATURED PROJECT" card.
 * Featured projects get a roomier two-column layout with a big preview.
 */
import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { placeholderFor } from '../utils/image.js';
import { normalizeUrl, prettyUrl } from '../utils/links.js';
import { ArrowRight, ExternalLink, Github, Pencil, Star, Trash } from './Icons.jsx';

export default function FeaturedSpotlight({
  project,
  index = 0,
  onEdit,
  onDelete,
  onToggleFeatured,
  onOpenDetails,
}) {
  const { ref, inView } = useScrollReveal({ threshold: 0.12 });
  const [failed, setFailed] = useState(false);

  const liveUrl = normalizeUrl(project.liveUrl);
  const repoUrl = normalizeUrl(project.githubUrl);
  const image = project.image && !failed ? project.image : placeholderFor(project.title);

  return (
    <article
      ref={ref}
      className={`spotlight reveal reveal--scale ${inView ? 'is-visible' : ''}`}
      style={{ '--reveal-delay': `${index * 90}ms` }}
    >
      <div className="spotlight__media" onClick={() => onOpenDetails(project)} role="presentation">
        <img
          src={image}
          alt={`${project.title} preview`}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
        <span className="spotlight__shine" aria-hidden="true" />
      </div>

      <div className="spotlight__body">
        <p className="spotlight__eyebrow">
          <Star size={14} filled />
          Featured Project
        </p>

        <h3 className="spotlight__title">{project.title}</h3>

        <p className="spotlight__desc">{project.description}</p>

        <ul className="spotlight__tech" aria-label="Technologies used">
          {project.technologies.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>

        <div className="spotlight__actions">
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
          <button type="button" className="spotlight__more" onClick={() => onOpenDetails(project)}>
            Details
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="spotlight__meta">
          <span>{project.category}</span>
          <span className="project-card__dot" aria-hidden="true" />
          <span>{project.year}</span>
          {liveUrl && (
            <>
              <span className="project-card__dot" aria-hidden="true" />
              <span>{prettyUrl(liveUrl)}</span>
            </>
          )}
        </div>

        <div className="spotlight__tools">
          <button
            type="button"
            className="icon-btn"
            onClick={() => onToggleFeatured(project.id)}
            aria-label={`Unfeature ${project.title}`}
            title="Remove from featured"
          >
            <Star size={15} filled />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => onEdit(project)}
            aria-label={`Edit ${project.title}`}
            title="Edit project"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            className="icon-btn icon-btn--danger"
            onClick={() => onDelete(project)}
            aria-label={`Delete ${project.title}`}
            title="Delete project"
          >
            <Trash size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
