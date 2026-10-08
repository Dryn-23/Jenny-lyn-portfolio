/**
 * Projects.jsx — "Things I Create".
 *
 * Owns the project library UI: filters, featured spotlights, the card grid and
 * the add/edit/details/delete flows. Projects live in localStorage (see
 * useProjects), so the portfolio grows without touching source code.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { PROJECT_CATEGORIES } from '../data/projects.js';
import { useProjects } from '../hooks/useProjects.js';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { Download, Folder, Leaf, Plus, Sparkle, Wand } from './Icons.jsx';
import { LeafShape, Note, Squiggle } from './Decor.jsx';
import { useToast } from './Toast.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import FeaturedSpotlight from './FeaturedSpotlight.jsx';
import ProjectCard from './ProjectCard.jsx';
import ProjectDetails from './ProjectDetails.jsx';
import ProjectFilter from './ProjectFilter.jsx';
import ProjectModal from './ProjectModal.jsx';
import './Projects.css';

export default function Projects() {
  const {
    projects,
    addProject,
    updateProject,
    removeProject,
    toggleFeatured,
    resetToSeed,
    exportJSON,
  } = useProjects();

  const toast = useToast();
  const { ref: headRef, inView: headIn } = useScrollReveal({ threshold: 0.3 });

  const [filter, setFilter] = useState('All');
  const [modal, setModal] = useState({ open: false, mode: 'add', project: null });
  const [details, setDetails] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [manageOpen, setManageOpen] = useState(false);
  const importedRef = useRef(null);
  const manageRef = useRef(null);

  /* --- derived data ------------------------------------------------------- */
  const counts = useMemo(() => {
    const base = { All: projects.length };
    PROJECT_CATEGORIES.forEach((c) => {
      base[c] = projects.filter((p) => p.category === c).length;
    });
    return base;
  }, [projects]);

  const visible = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)),
    [projects, filter]
  );

  const featured = useMemo(() => visible.filter((p) => p.featured), [visible]);
  const rest = useMemo(() => visible.filter((p) => !p.featured), [visible]);

  /* --- click-outside for the manage menu ---------------------------------- */
  useEffect(() => {
    if (!manageOpen) return;
    const onClick = (e) => {
      if (!manageRef.current?.contains(e.target)) setManageOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, [manageOpen]);

  /* --- actions ------------------------------------------------------------ */
  const handleSubmit = (data) => {
    if (modal.mode === 'edit' && modal.project) {
      updateProject(modal.project.id, data);
      toast('Project updated 🌿');
    } else {
      addProject(data);
      toast('Project added to your journal ✨');
    }
    setModal({ open: false, mode: 'add', project: null });
  };

  const handleDelete = (project) => setPendingDelete(project);

  const confirmDelete = () => {
    if (pendingDelete) {
      removeProject(pendingDelete.id);
      toast(`“${pendingDelete.title}” removed`, 'info');
    }
    setPendingDelete(null);
    setDetails(null);
  };

  const handleExport = () => {
    const blob = new Blob([exportJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Jenny-lyn-projects.json';
    a.click();
    URL.revokeObjectURL(url);
    setManageOpen(false);
    toast('Exported your project library 📦', 'info');
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data)) throw new Error('That file does not contain a project list.');
      data.forEach((p) => addProject(p));
      toast(`Imported ${data.length} project${data.length === 1 ? '' : 's'} 🌱`);
    } catch (error) {
      toast(error.message || 'Could not read that file.', 'info');
    } finally {
      if (importedRef.current) importedRef.current.value = '';
      setManageOpen(false);
    }
  };

  const handleReset = () => {
    resetToSeed();
    setManageOpen(false);
    toast('Restored the starter projects', 'info');
  };

  return (
    <section id="projects" className="section projects">
      <LeafShape className="decor projects__leaf decor--float-slow" size={44} />

      <div className="container">
        <header ref={headRef} className={`section-head reveal ${headIn ? 'is-visible' : ''}`}>
          <p className="eyebrow eyebrow--outline">
            <Folder size={16} />
            Projects
          </p>
          <h2>Things I Create</h2>
          <Squiggle width={190} />
          <p className="lead">
            Every project teaches me something new. From simple designs to functional systems — these
            are the pages I&rsquo;m proudest of so far. Add your own with the button below; the
            portfolio keeps them for you.
          </p>
        </header>

        {/* ---------------- toolbar ---------------- */}
        <div className="projects__toolbar">
          <ProjectFilter
            categories={PROJECT_CATEGORIES}
            active={filter}
            counts={counts}
            onChange={setFilter}
          />

          <div className="projects__tools">
            <button type="button" className="btn" onClick={() => setModal({ open: true, mode: 'add', project: null })}>
              <Plus size={17} />
              Add Project
            </button>

            <div className="manage" ref={manageRef}>
              <button
                type="button"
                className={`btn btn--ghost manage__toggle ${manageOpen ? 'is-open' : ''}`}
                aria-expanded={manageOpen}
                aria-haspopup="true"
                onClick={() => setManageOpen((v) => !v)}
              >
                Manage
                <span className={`manage__chev ${manageOpen ? 'is-open' : ''}`} aria-hidden="true">
                  ▾
                </span>
              </button>

              {manageOpen && (
                <div className="manage__menu" role="menu">
                  <button type="button" role="menuitem" onClick={handleExport}>
                    <Download size={15} />
                    Export as JSON
                  </button>
                  <button type="button" role="menuitem" onClick={() => importedRef.current?.click()}>
                    <Wand size={15} />
                    Import a JSON file
                  </button>
                  <button type="button" role="menuitem" onClick={handleReset} className="manage__danger">
                    <Sparkle size={15} />
                    Restore starter projects
                  </button>
                  <p className="manage__note">
                    Saved in this browser · {projects.length} project{projects.length === 1 ? '' : 's'}
                  </p>
                </div>
              )}
              <input
                ref={importedRef}
                type="file"
                accept="application/json"
                className="sr-only"
                onChange={handleImport}
              />
            </div>
          </div>
        </div>

        {/* ---------------- content ---------------- */}
        <div className="projects__content" key={filter}>
          {featured.length > 0 && (
            <div className="projects__featured">
              {featured.map((project, i) => (
                <FeaturedSpotlight
                  key={project.id}
                  project={project}
                  index={i}
                  onEdit={(p) => setModal({ open: true, mode: 'edit', project: p })}
                  onDelete={handleDelete}
                  onToggleFeatured={toggleFeatured}
                  onOpenDetails={setDetails}
                />
              ))}
            </div>
          )}

          {rest.length > 0 ? (
            <div className="projects__grid">
              {rest.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  onEdit={(p) => setModal({ open: true, mode: 'edit', project: p })}
                  onDelete={handleDelete}
                  onToggleFeatured={toggleFeatured}
                  onOpenDetails={setDetails}
                />
              ))}
            </div>
          ) : (
            featured.length === 0 && (
              <div className="projects__empty">
                <Leaf size={30} />
                <h3 className="hand">This chapter is still blank</h3>
                <p>
                  No projects in <strong>{filter}</strong> yet. Add one and it will appear right here.
                </p>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setModal({ open: true, mode: 'add', project: null })}
                >
                  <Plus size={16} />
                  Add your first project
                </button>
              </div>
            )
          )}

          {rest.length === 0 && featured.length > 0 && (
            <p className="projects__hint hand">
              Switch to &ldquo;All&rdquo; to see the rest of the journal.
            </p>
          )}
        </div>

        <Note
          className="projects__note"
          text={'Add, edit,\nor delete —\nno code needed.'}
          rotate={-7}
          arrow="curve"
        />
      </div>

      {/* ---------------- overlays ---------------- */}
      <ProjectModal
        open={modal.open}
        mode={modal.mode}
        initial={modal.project}
        onClose={() => setModal({ open: false, mode: 'add', project: null })}
        onSubmit={handleSubmit}
      />

      <ProjectDetails
        project={details}
        onClose={() => setDetails(null)}
        onEdit={(p) => {
          setDetails(null);
          setModal({ open: true, mode: 'edit', project: p });
        }}
        onDelete={handleDelete}
        onToggleFeatured={toggleFeatured}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete “${pendingDelete?.title ?? ''}”?`}
        message="This removes the project card from your portfolio. It only affects this browser — the starter projects can always be restored from the Manage menu."
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
}
