import { useState, useEffect } from 'react';

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function MobileFilterOverlay({
  isOpen, onClose, onApply,
  fits = [], designs = [], categories = [],
  initialFits, initialDesigns, initialCategories, initialSizes,
  filterFn, showCategories = true,
}) {
  const [draftFits,       setDraftFits]       = useState([]);
  const [draftDesigns,    setDraftDesigns]    = useState([]);
  const [draftCategories, setDraftCategories] = useState([]);
  const [draftSizes,      setDraftSizes]      = useState([]);

  useEffect(() => {
    if (isOpen) {
      setDraftFits([...initialFits]);
      setDraftDesigns([...initialDesigns]);
      setDraftCategories([...initialCategories]);
      setDraftSizes([...initialSizes]);
    }
  }, [isOpen]); // eslint-disable-line

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const toggle = (arr, set, val) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const clearAll = () => {
    setDraftFits([]); setDraftDesigns([]);
    setDraftCategories([]); setDraftSizes([]);
  };

  const draftCount = draftFits.length + draftDesigns.length + draftCategories.length + draftSizes.length;
  const previewCount = filterFn
    ? filterFn(draftFits, draftDesigns, draftCategories, draftSizes)
    : 0;

  if (!isOpen) return null;

  return (
    /* Full-screen wrapper — clicking the dark area closes the overlay */
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center"
      onClick={onClose}
    >
      {/* Dark backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/*
        Panel — stop propagation so clicks inside don't close.
        mx-3 gives space on left+right. rounded-t-2xl rounds the top corners.
      */}
      <div
        className="relative w-full mx-3 max-w-lg bg-white rounded-t-2xl max-h-[88vh]
                   flex flex-col animate-slide-up shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-neutral-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 flex-shrink-0">
          <h2 className="font-display font-black text-base">FILTERS</h2>
          <div className="flex items-center gap-4">
            {draftCount > 0 && (
              <button onClick={clearAll} className="text-xs font-bold text-hop-red uppercase tracking-wide">
                Clear All
              </button>
            )}
            <button onClick={onClose} className="text-neutral-400 hover:text-hop-black p-1">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable options */}
        <div className="flex-1 overflow-y-auto">
          {fits.length > 0 && (
            <FilterSection title="Fit">
              {fits.map((f) => (
                <FilterRow key={f} label={f}
                  checked={draftFits.includes(f)}
                  onToggle={() => toggle(draftFits, setDraftFits, f)} />
              ))}
            </FilterSection>
          )}

          {showCategories && categories.length > 0 && (
            <FilterSection title="Category">
              {categories.map((c) => (
                <FilterRow key={c.value} label={c.label}
                  checked={draftCategories.includes(c.value)}
                  onToggle={() => toggle(draftCategories, setDraftCategories, c.value)} />
              ))}
            </FilterSection>
          )}

          {designs.length > 0 && (
            <FilterSection title="Design">
              {designs.map((d) => (
                <FilterRow key={d} label={d}
                  checked={draftDesigns.includes(d)}
                  onToggle={() => toggle(draftDesigns, setDraftDesigns, d)} />
              ))}
            </FilterSection>
          )}

          <FilterSection title="Size">
            <div className="flex flex-wrap gap-2 pt-1">
              {ALL_SIZES.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => toggle(draftSizes, setDraftSizes, sz)}
                  className={`w-12 h-12 text-sm font-bold border-2 transition-all ${
                    draftSizes.includes(sz)
                      ? 'bg-hop-red text-white border-hop-red'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-hop-black'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </FilterSection>
        </div>

        {/* Apply footer */}
        <div className="flex-shrink-0 border-t border-neutral-100 px-5 py-4 bg-white rounded-b-none">
          <button
            type="button"
            onClick={() => {
              onApply(draftFits, draftDesigns, draftCategories, draftSizes);
              onClose();
            }}
            className="btn-red w-full py-4 text-sm font-black tracking-widest"
          >
            {previewCount > 0
              ? `Show ${previewCount} Product${previewCount !== 1 ? 's' : ''}`
              : draftCount > 0
                ? 'No Results — Try Different Filters'
                : 'View All Products'}
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterSection({ title, children }) {
  return (
    <div className="px-5 py-4 border-b border-neutral-50 last:border-b-0">
      <p className="font-black text-xs text-neutral-500 uppercase tracking-widest mb-3">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function FilterRow({ label, checked, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between py-3 px-1 active:bg-neutral-50 transition-colors"
    >
      <span className={`text-sm ${checked ? 'font-bold text-hop-black' : 'font-medium text-neutral-600'}`}>
        {label}
      </span>
      <span
        className={`w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          checked ? 'bg-hop-red border-hop-red' : 'border-neutral-300'
        }`}
      >
        {checked && (
          <svg width="11" height="11" fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
    </button>
  );
}
