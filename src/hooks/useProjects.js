/**
 * useProjects.js — project library state + persistence.
 *
 * - Seeds from `src/data/projects.js` on a first visit.
 * - Projects you add/edit through the UI are marked `source: 'user'` and stored
 *   in localStorage, so you can grow the portfolio without touching code.
 * - Seeded projects stay editable too (edits are kept as overrides, so the
 *   original seed file remains the untouched baseline).
 * - `exportJSON()` / `importJSON()` let you move your library between browsers
 *   or paste it back into the source file for a permanent record.
 */
import { useCallback, useMemo } from 'react';
import { seedProjects } from '../data/projects.js';
import { useLocalStorage } from './useLocalStorage.js';

const STORAGE_KEY = 'Jenny-lyn-portfolio:projects:v1';

const uid = () =>
  `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export function normalizeProject(raw = {}) {
  return {
    id: raw.id || uid(),
    title: (raw.title || '').trim() || 'Untitled Project',
    description: (raw.description || '').trim(),
    image: (raw.image || '').trim(),
    category: raw.category || 'Web Development',
    technologies: Array.isArray(raw.technologies)
      ? raw.technologies.filter(Boolean).map((t) => String(t).trim()).filter(Boolean)
      : String(raw.technologies || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
    liveUrl: (raw.liveUrl || '').trim(),
    githubUrl: (raw.githubUrl || '').trim(),
    year: raw.year || new Date().getFullYear(),
    featured: Boolean(raw.featured),
    source: raw.source === 'seed' ? 'seed' : 'user',
  };
}

export function useProjects() {
  const [projects, setProjects] = useLocalStorage(STORAGE_KEY, seedProjects);

  const addProject = useCallback(
    (data) => {
      const project = normalizeProject({ ...data, id: uid(), source: 'user' });
      setProjects((prev) => [project, ...prev]);
      return project;
    },
    [setProjects]
  );

  const updateProject = useCallback(
    (id, data) => {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? normalizeProject({ ...p, ...data, id: p.id }) : p))
      );
    },
    [setProjects]
  );

  const removeProject = useCallback(
    (id) => setProjects((prev) => prev.filter((p) => p.id !== id)),
    [setProjects]
  );

  const toggleFeatured = useCallback(
    (id) =>
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
      ),
    [setProjects]
  );

  const resetToSeed = useCallback(() => setProjects(seedProjects), [setProjects]);

  const exportJSON = useCallback(
    () => JSON.stringify(projects.map(({ source, ...rest }) => rest), null, 2),
    [projects]
  );

  const featured = useMemo(() => projects.filter((p) => p.featured), [projects]);

  return {
    projects,
    featured,
    addProject,
    updateProject,
    removeProject,
    toggleFeatured,
    resetToSeed,
    exportJSON,
  };
}
