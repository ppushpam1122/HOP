import { useState, useRef, useEffect } from 'react';

/**
 * SortDropdown — custom dropdown that looks and behaves consistently on all
 * platforms, including mobile where native <select> opens a system sheet.
 */
export default function SortDropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value) ?? options[0];

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('touchstart', handler); };
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block', minWidth: 160 }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="select-clean flex items-center justify-between gap-3 w-full"
        style={{ fontSize: 13 }}
      >
        <span>{selected.label}</span>
        <svg
          width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s ease', flexShrink: 0 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Menu */}
      {open && (
        <div
          className="bg-white border border-neutral-200 shadow-modal"
          style={{
            position: 'absolute', top: '100%', right: 0, marginTop: 4,
            zIndex: 200, minWidth: '100%', overflow: 'hidden',
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                opt.value === value
                  ? 'bg-hop-red text-white font-semibold'
                  : 'text-neutral-700 hover:bg-neutral-50'
              }`}
              style={{ fontSize: 13 }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
