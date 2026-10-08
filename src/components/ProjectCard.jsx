/**
 * ProjectCard.jsx — interactive project card.
 *
 * Hover behaviour: card lifts, the thumbnail zooms, the shadow deepens, tags
 * nudge upward and the corner arrow slides toward the project link.
 * The whole card is keyboard accessible: title opens details, buttons stay
 * individually focusable.
 */
import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { placeholderFor } from '../utils/image.js';
import { normalizeUrl, prettyUrl } from '../utils/links.js';
import { ArrowRight, ExternalLink, Github, Pencil, Star, Trash } from './Icons.jsx';

export default function ProjectCard({
  project,
  index = 0,
  onEdit,
  onDelete,
  onToggleFeatured,
  onOpenDetails,
}) {
  const { ref, inView } = useScrollReveal({ threshold: 0.15 });
  const [imgFailed, setImgFailed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const hasImage = Boolean(project.image) && !imgFailed;
  const liveUrl = normalizeUrl(project.liveUrl);
  const repoUrl = normalizeUrl(project.githubUrl);

  return (
    <article
      ref={ref}
      className={`project-card reveal ${inView ? 'is-visible' : ''}`}
      style={{ '--reveal-delay': `${Math.min(index, 8) * 85}ms` }}
    >
      {/* --- media --- */}
      <div className="project-card__media" style={{ background: `url("${placeholderFor(project.title)}") center/cover` }}>
        {hasImage && (
          <img
            src={project.image}
            alt={`${project.title} preview`}
            loading="lazy"
            decoding="async"
            className={`project-card__img ${imgLoaded ? 'is-loaded' : ''}`}
            onError={() => setImgFailed(true)}
            onLoad={() => setImgLoaded(true)}
          />
        )}

        <span className="project-card__badge">{project.category}</span>

        {project.featured && (
          <span className="project-card__featured" title="Featured project">
            <Star size={13} filled />
            Featured
          </span>
        )}

        {/* manage actions */}
        <div className="project-card__tools">
          <button
            type="button"
            className="icon-btn"
            onClick={() => onToggleFeatured(project.id)}
            title={project.featured ? 'Remove from featured' : 'Mark as featured'}
            aria-label={project.featured ? `Unfeature ${project.title}` : `Feature ${project.title}`}
          >
            <Star size={15} filled={project.featured} />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => onEdit(project)}
            title="Edit project"
            aria-label={`Edit ${project.title}`}
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            className="icon-btn icon-btn--danger"
            onClick={() => onDelete(project)}
            title="Delete project"
            aria-label={`Delete ${project.title}`}
          >
            <Trash size={15} />
          </button>
        </div>

        <button
          type="button"
          className="project-card__peek"
          onClick={() => onOpenDetails(project)}
          aria-label={`Preview details of ${project.title}`}
        >
          <span>Preview</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* --- body --- */}
      <div className="project-card__body">
        <p className="project-card__meta">
          <span>{project.year}</span>
          <span className="project-card__dot" aria-hidden="true" />
          <span>{project.technologies.length} tech</span>
          {liveUrl && (
            <>
              <span className="project-card__dot" aria-hidden="true" />
              <span className="project-card__host">{prettyUrl(liveUrl)}</span>
            </>
          )}
        </p>

        <h3 className="project-card__title">
          <button type="button" onClick={() => onOpenDetails(project)} className="project-card__title-btn">
            {project.title}
            <ArrowRight size={16} className="project-card__title-arrow" />
          </button>
        </h3>

        {project.description && <p className="project-card__desc">{project.description}</p>}

        {project.technologies.length > 0 && (
          <ul className="project-card__tags">
            {project.technologies.map((tech, i) => (
              <li key={tech} className="tag" style={{ '--tag-i': i }}>
                {tech}
              </li>
            ))}
          </ul>
        )}

        <div className="project-card__actions">
          {liveUrl && (
            <a
              className="btn btn--sm"
              href={liveUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`Open the live demo of ${project.title}`}
            >
              Live Demo
              <span className="btn__icon btn__icon--right" aria-hidden="true">
                <ExternalLink size={15} />
              </span>
            </a>
          )}
          {repoUrl && (
            <a
              className="btn btn--sm btn--ghost"
              href={repoUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`Open the GitHub repository of ${project.title}`}
            >
              <Github size={15} />
              GitHub
            </a>
          )}
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => onOpenDetails(project)}>
            View Project
          </button>
        </div>
      </div>
    </article>
  );
}
