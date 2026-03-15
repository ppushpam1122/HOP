import Head from 'next/head';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import MobileFilterOverlay from '@/components/MobileFilterOverlay';
import { getAllProducts } from '@/lib/catalogLoader';

const SORT_OPTIONS = [
  { value: 'default',    label: 'Featured'          },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc',   label: 'Name: A–Z'          },
];

export default function AllClothingPage({ products, fits, designs, categories }) {
  const [sort,             setSort]             = useState('default');
  const [activeFits,       setActiveFits]       = useState([]);
  const [activeDesigns,    setActiveDesigns]    = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [activeSizes,      setActiveSizes]      = useState([]);
  const [mobileOpen,       setMobileOpen]       = useState(false);

  /* Universal toggle: key tells us which setter to use */
  const toggle = (arr, key, val) => {
    const setters = { fits: setActiveFits, designs: setActiveDesigns, categories: setActiveCategories, sizes: setActiveSizes };
    setters[key](arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const clearAll = () => { setActiveFits([]); setActiveDesigns([]); setActiveCategories([]); setActiveSizes([]); };
  const activeCount = activeFits.length + activeDesigns.length + activeCategories.length + activeSizes.length;

  /* Filter function reused by both the grid and the mobile preview count */
  const applyFilters = (prods, aFits, aDesigns, aCats, aSizes) =>
    prods.filter((p) => {
      if (aFits.length    && !aFits.includes(p.fit))       return false;
      if (aDesigns.length && !aDesigns.includes(p.design)) return false;
      if (aCats.length    && !aCats.includes(p.category))  return false;
      if (aSizes.length) {
        const ok = p.colors.some((c) => aSizes.some((sz) => c.sizes?.[sz] === true));
        if (!ok) return false;
      }
      return true;
    });

  const filtered = useMemo(() =>
    applyFilters(products, activeFits, activeDesigns, activeCategories, activeSizes)
      .slice()
      .sort((a, b) => {
        if (sort === 'price-asc')  return a.price - b.price;
        if (sort === 'price-desc') return b.price - a.price;
        if (sort === 'name-asc')   return a.name.localeCompare(b.name);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }),
  [products, activeFits, activeDesigns, activeCategories, activeSizes, sort]);

  /* Mobile overlay: preview count function */
  const mobilePreviewCount = (dF, dD, dC, dS) =>
    applyFilters(products, dF, dD, dC, dS).length;

  return (
    <>
      <Head>
        <title>Shop All — House of Peacock</title>
        <meta name="description" content="Browse the full HOP collection." />
      </Head>

      <Navbar />

      {/* Hero banner */}
      <section className="relative w-full bg-[#e8e0d8] overflow-hidden" style={{ minHeight: '260px' }}>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-12 flex items-center">
          <div className="max-w-sm z-10">
            <h1 className="font-display font-black text-3xl sm:text-5xl text-hop-black leading-tight mb-4">
              Premium Tees <em className="font-normal not-italic">for the Bold</em>
            </h1>
            <Link href="/clothing/tshirts" className="btn-red px-7 py-3 inline-flex text-sm">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ── Toolbar ──────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {/* Mobile: FILTERS button only */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex items-center gap-2 border-2 border-neutral-200 hover:border-hop-black px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 4h18M6 8h12M9 12h6" />
            </svg>
            Filters {activeCount > 0 && `(${activeCount})`}
          </button>

          {/* Desktop: sort on the right */}
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-neutral-400 hidden lg:block">
              {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            </span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="select-clean">
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* ── Layout: inline style grid so it's 100% reliable across builds.
             Tailwind arbitrary values like grid-cols-[224px_1fr] can be
             purged. Inline style is never purged. Sidebar is always 224px,
             content always fills the rest — layout NEVER jumps. */}
        <div
          className="block lg:grid items-start"
          style={{
            '--grid-template': '224px 1fr',
            gridTemplateColumns: 'var(--grid-template)',
            gap: '24px',
            alignItems: 'start',
          }}
        >

          {/* Sidebar — always 224px, visually hidden on mobile via CSS */}
          <aside className="hidden lg:block" style={{ position: 'sticky', top: '96px' }}>
            <FilterSidebar
              fits={fits} designs={designs} categories={categories}
              activeFits={activeFits} activeDesigns={activeDesigns}
              activeCategories={activeCategories} activeSizes={activeSizes}
              toggle={toggle} clearAll={clearAll} activeCount={activeCount}
              showCategories={true}
            />
          </aside>

          {/* Grid — takes all 1fr space */}
          <div className="min-h-[400px]">
            <p className="text-xs text-neutral-500 mb-3 lg:hidden">
              {filtered.length} product{filtered.length !== 1 ? 's' : ''}
              {activeCount > 0 && (
                <button onClick={clearAll} className="ml-2 text-hop-red font-bold">(clear)</button>
              )}
            </p>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4" style={{minWidth:0}}>
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} priority={i < 6} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-neutral-400 mb-4">No products match your filters.</p>
                <button onClick={clearAll} className="btn-red">Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile filter overlay */}
      <MobileFilterOverlay
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onApply={(dF, dD, dC, dS) => {
          setActiveFits(dF); setActiveDesigns(dD);
          setActiveCategories(dC); setActiveSizes(dS);
        }}
        fits={fits} designs={designs} categories={categories}
        initialFits={activeFits} initialDesigns={activeDesigns}
        initialCategories={activeCategories} initialSizes={activeSizes}
        filterFn={mobilePreviewCount}
        showCategories={true}
      />
    </>
  );
}

export async function getStaticProps() {
  const products   = getAllProducts();
  const fits       = [...new Set(products.map((p) => p.fit).filter(Boolean))].sort();
  const designs    = [...new Set(products.map((p) => p.design).filter(Boolean))].sort();
  const categories = [...new Set(products.map((p) => p.category))].map((cat) => ({
    value: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
  }));
  return { props: { products, fits, designs, categories } };
}
