/**
 * FilterSidebar — desktop sticky left sidebar.
 * All filter state is controlled by the parent; this is purely presentational.
 */
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function FilterSidebar({
  fits = [], designs = [], categories = [],
  activeFits, activeDesigns, activeCategories, activeSizes,
  toggle, clearAll, activeCount,
  showCategories = true,
}) {
  return (
    <div className="bg-white shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
        <h2 className="font-display font-black text-sm uppercase tracking-widest">Filter By</h2>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-[10px] font-bold text-hop-red uppercase tracking-wide hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* Fit */}
        {fits.length > 0 && (
          <Section title="Fit">
            {fits.map((f) => (
              <CheckItem
                key={f} label={f}
                checked={activeFits.includes(f)}
                onChange={() => toggle(activeFits, 'fits', f)}
              />
            ))}
          </Section>
        )}

        {/* Category */}
        {showCategories && categories.length > 0 && (
          <>
            <hr className="border-neutral-100" />
            <Section title="Category">
              {categories.map((c) => (
                <CheckItem
                  key={c.value} label={c.label}
                  checked={activeCategories.includes(c.value)}
                  onChange={() => toggle(activeCategories, 'categories', c.value)}
                />
              ))}
            </Section>
          </>
        )}

        {/* Design */}
        {designs.length > 0 && (
          <>
            <hr className="border-neutral-100" />
            <Section title="Design">
              {designs.map((d) => (
                <CheckItem
                  key={d} label={d}
                  checked={activeDesigns.includes(d)}
                  onChange={() => toggle(activeDesigns, 'designs', d)}
                />
              ))}
            </Section>
          </>
        )}

        {/* Sizes */}
        <hr className="border-neutral-100" />
        <Section title="Sizes">
          <div className="flex flex-wrap gap-2 pt-1">
            {ALL_SIZES.map((sz) => (
              <button
                key={sz}
                onClick={() => toggle(activeSizes, 'sizes', sz)}
                className={`w-11 h-11 text-xs font-bold border-2 transition-all ${
                  activeSizes.includes(sz)
                    ? 'bg-hop-red text-white border-hop-red'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-hop-black'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <p className="font-bold text-sm text-hop-black mb-3">{title}</p>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function CheckItem({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="filter-checkbox"
      />
      <span className="text-sm text-neutral-700 group-hover:text-hop-black transition-colors">
        {label}
      </span>
    </label>
  );
}
