"use client";

export default function LegalModal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal legal-modal" role="dialog" aria-modal="true" aria-label={title}>
        <button className="modal-close" aria-label="Close" onClick={onClose}>
          ✕
        </button>
        <h2>{title}</h2>
        <div className="legal-body">{children}</div>
      </div>
    </div>
  );
}
