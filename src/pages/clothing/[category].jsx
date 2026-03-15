import Head from 'next/head';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import Breadcrumb from '@/components/Breadcrumb';
import FilterSidebar from '@/components/FilterSidebar';
import MobileFilterOverlay from '@/components/MobileFilterOverlay';
import { getAllProducts } from '@/lib/catalogLoader';
import taxonomy from '@/data/taxonomy.json';

const SORT_OPTIONS = [
  { value: 'default',    label: 'Featured'          },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc',   label: 'Name: A–Z'          },
];

function findNode(nodes, idOrSlug) {
  for (const node of nodes) {
    if (node.id === idOrSlug || node.slug === idOrSlug) return node;
    if (node.children) {
      const found = findNode(node.children, idOrSlug);
      if (found) return found;
    }
  }
  return null;
}

function collectLeafIds(node) {
  if (!node.children || node.children.length === 0) return [node.id];
  return node.children.flatMap((child) => collectLeafIds(child));
}

function collectAllSlugs(nodes) {
  return nodes.flatMap((node) => {
    const children = node.children ? collectAllSlugs(node.children) : [];
    return [node.slug, ...children];
  });
}

function buildCategoryBreadcrumb(categoryId) {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Clothing', href: '/clothing' }];
  function walk(nodes, chain) {
    for (const node of nodes) {
      const current = [...chain, node];
      if (node.id === categoryId) return current;
      if (node.children) { const f = walk(node.children, current); if (f) return f; }
    }
    return null;
  }
  const chain = walk(taxonomy.categories, []);
  if (chain) chain.forEach((n) => { if (!crumbs.find((c) => c.label === n.label)) crumbs.push({ label: n.label, href: `/clothing/${n.slug}` }); });
  return crumbs;
}

export default function CategoryPage({ category, products, categoryNode, isIntermediate, fits, designs }) {
  const [sort,          setSort]          = useState('default');
  const [activeFits,    setActiveFits]    = useState([]);
  const [activeDesigns, setActiveDesigns] = useState([]);
  const [activeSizes,   setActiveSizes]   = useState([]);
  const [mobileOpen,    setMobileOpen]    = useState(false);

  const toggle = (arr, key, val) => {
    const s = { fits: setActiveFits, designs: setActiveDesigns, sizes: setActiveSizes };
    s[key]?.(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const clearAll    = () => { setActiveFits([]); setActiveDesigns([]); setActiveSizes([]); };
  const activeCount = activeFits.length + activeDesigns.length + activeSizes.length;

  const applyFilters = (prods, aFits, aDesigns, _, aSizes) =>
    prods.filter((p) => {
      if (aFits.length    && !aFits.includes(p.fit))       return false;
      if (aDesigns.length && !aDesigns.includes(p.design)) return false;
      if (aSizes.length) {
        const ok = p.colors.some((c) => aSizes.some((sz) => c.sizes?.[sz] === true));
        if (!ok) return false;
      }
      return true;
    });

  const filtered = useMemo(() =>
    applyFilters(products, activeFits, activeDesigns, [], activeSizes)
      .slice()
      .sort((a, b) => {
        if (sort === 'price-asc')  return a.price - b.price;
        if (sort === 'price-desc') return b.price - a.price;
        if (sort === 'name-asc')   return a.name.localeCompare(b.name);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }),
  [products, activeFits, activeDesigns, activeSizes, sort]);

  const mobilePreviewCount = (dF, dD, _dC, dS) =>
    applyFilters(products, dF, dD, [], dS).length;

  const crumbs      = buildCategoryBreadcrumb(category);
  const displayName = categoryNode?.label ?? category;

  return (
    <>
      <Head>
        <title>{displayName} — House of Peacock</title>
        <meta name="description" content={`Shop our ${displayName} collection.`} />
      </Head>

      <Navbar />

      {/* Page header */}
      <div className="bg-white border-b border-neutral-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb crumbs={crumbs} />
          <h1 className="display-heading text-2xl sm:text-3xl mt-3">{displayName}</h1>
          <p className="text-neutral-500 text-sm mt-1">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            {isIntermediate && <span className="text-neutral-400 ml-1">across all {displayName.toLowerCase()} styles</span>}
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Sub-category pills */}
        {isIntermediate && categoryNode?.children?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 self-center mr-1">Browse:</span>
            {categoryNode.children.map((child) => (
              <Link key={child.id} href={`/clothing/${child.slug}`} className="chip">{child.label}</Link>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <Link href="/clothing" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">
            ← All Clothing
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex items-center gap-2 border-2 border-neutral-200 hover:border-hop-black px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 8h12M9 12h6" />
            </svg>
            Filters {activeCount > 0 && `(${activeCount})`}
          </button>
          <div className="ml-auto flex items-center gap-3">
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="select-clean">
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Body */}
        {/* Inline style grid — 100% reliable, never purged by Tailwind */}
        <div
          className="block lg:grid items-start"
          style={{
            '--grid-template': '224px 1fr',
            gridTemplateColumns: 'var(--grid-template)',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          <aside className="hidden lg:block" style={{ position: 'sticky', top: '96px' }}>
            <FilterSidebar
              fits={fits} designs={designs} categories={[]}
              activeFits={activeFits} activeDesigns={activeDesigns}
              activeCategories={[]} activeSizes={activeSizes}
              toggle={toggle} clearAll={clearAll} activeCount={activeCount}
              showCategories={false}
            />
          </aside>

          {/* Grid — takes all 1fr space, min-height prevents collapse */}
          <div className="min-h-[400px]">
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

      <MobileFilterOverlay
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onApply={(dF, dD, _dC, dS) => {
          setActiveFits(dF); setActiveDesigns(dD); setActiveSizes(dS);
        }}
        fits={fits} designs={designs} categories={[]}
        initialFits={activeFits} initialDesigns={activeDesigns}
        initialCategories={[]} initialSizes={activeSizes}
        filterFn={mobilePreviewCount}
        showCategories={false}
      />
    </>
  );
}

export async function getStaticPaths() {
  const slugs  = collectAllSlugs(taxonomy.categories);
  const unique = [...new Set(slugs)];
  return { paths: unique.map((slug) => ({ params: { category: slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const { category } = params;
  const allProducts  = getAllProducts();
  const categoryNode = findNode(taxonomy.categories, category) ?? null;
  const isIntermediate = !!(categoryNode?.children?.length);

  let products;
  if (isIntermediate && categoryNode) {
    const leafIds = collectLeafIds(categoryNode);
    products = allProducts.filter((p) => leafIds.includes(p.category));
  } else {
    products = allProducts.filter((p) => p.category === category);
  }

  // Build filter options from products in THIS category only
  const fits    = [...new Set(products.map((p) => p.fit).filter(Boolean))].sort();
  const designs = [...new Set(products.map((p) => p.design).filter(Boolean))].sort();

  return { props: { category, products, categoryNode, isIntermediate, fits, designs } };
}
