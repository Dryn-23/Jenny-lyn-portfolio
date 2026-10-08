/**
 * ConfirmDialog.jsx — small confirmation sheet used before deleting a project.
 */
import { useEffect } from 'react';
import { Close, Trash } from './Icons.jsx';
import './Modal.css';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.body.classList.add('no-scroll');
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="modal__backdrop" aria-label="Cancel" onClick={onCancel} />
      <div className="modal__panel modal__panel--sm">
        <div className="modal__head">
          <div>
            <p className="modal__eyebrow hand">Careful now</p>
            <h3 className="modal__title">{title}</h3>
          </div>
          <button type="button" className="icon-btn" onClick={onCancel} aria-label="Close">
            <Close size={18} />
          </button>
        </div>
        <div className="modal__body">
          <p>{message}</p>
        </div>
        <div className="modal__foot">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Keep it
          </button>
          <button type="button" className="btn btn--danger" onClick={onConfirm}>
            <Trash size={16} />
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
