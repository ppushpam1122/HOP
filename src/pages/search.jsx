import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/catalogLoader';

/**
 * Fields searched (in priority order):
 * name, category, subcategory, description, material, fit, id
 * Each field gets a relevance score; results are sorted by score descending.
 */
/**
 * Splits a string into whole words.
 * Delimiters: space, comma, hyphen, dot, slash, parens, percent, underscore.
 * Returns an array of lowercase non-empty tokens.
 *
 * Examples:
 *   "Sand Dune"   → ["sand", "dune"]
 *   "100% Cotton" → ["100", "cotton"]
 *   "Slim-Fit"    → ["slim", "fit"]
 */
function tokenize(str) {
  if (!str) return [];
  return str
    .toLowerCase()
    .split(/[\s,\-./()_%+]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

/**
 * Builds a flat, searchable index from a product object.
 * Flattens nested color arrays into searchable strings so that
 * searching "rose", "pink", "dune", "beige", "XL" etc. all work.
 *
 * Returns an array of { tokens: string[], weight: number } entries.
 */
function buildProductIndex(p) {
  // Collect all color-related text into flat strings
  const colorNames      = (p.colors || []).map((c) => c.name           || '').join(' ');
  const colorPrimary    = (p.colors || []).map((c) => c.primaryColor   || '').join(' ');
  const colorSecondary  = (p.colors || []).map((c) => c.secondaryColor || '').join(' ');

  // Collect every size that is in-stock across all colors
  const availableSizes = (p.colors || [])
    .flatMap((c) => Object.entries(c.sizes || {}))
    .filter(([, inStock]) => inStock)
    .map(([size]) => size)
    .join(' ');

  return [
    { value: p.name,           weight: 6 },  // product name — highest
    { value: colorPrimary,     weight: 5 },  // common color names: "pink", "blue"
    { value: colorSecondary,   weight: 4 },  // secondary: "rose", "navy", "slate"
    { value: colorNames,       weight: 4 },  // fancy color names: "Dusty Rose", "Sand Dune"
    { value: p.category,       weight: 4 },  // "tshirts", "shirts"
    { value: p.subcategory,    weight: 3 },  // "casual", "formal"
    { value: p.fit,            weight: 3 },  // "slim fit", "oversized fit"
    { value: availableSizes,   weight: 3 },  // "S M L XL"
    { value: p.description,    weight: 2 },  // paragraph text
    { value: p.material,       weight: 2 },  // "100% Cotton, 220 GSM"
  ];
}

/**
 * Whole-word search across all product fields including colors and sizes.
 * Each query term must match a complete token in a field — no substrings.
 * Results are sorted by relevance score descending.
 */
/**
 * Finds the best-matching color for a product given the query terms.
 * Checks primaryColor, secondaryColor, and name tokens.
 * Returns the color object if matched, null otherwise.
 */
function findMatchedColor(product, queryTerms) {
  for (const color of (product.colors || [])) {
    const colorTokens = [
      ...tokenize(color.primaryColor  || ''),
      ...tokenize(color.secondaryColor || ''),
      ...tokenize(color.name          || ''),
    ];
    for (const term of queryTerms) {
      if (colorTokens.includes(term)) return color;
    }
  }
  return null;
}

function searchProducts(products, query) {
  if (!query || query.trim().length < 2) return [];

  const queryTerms = tokenize(query);
  if (queryTerms.length === 0) return [];

  const scored = products.map((p) => {
    const index = buildProductIndex(p);
    let score = 0;

    for (const term of queryTerms) {
      for (const { value, weight } of index) {
        if (!value) continue;
        const fieldTokens = tokenize(value);
        if (fieldTokens.includes(term)) {
          score += weight;
        }
      }
    }

    // Find the specific color that matched the query (if any)
    const matchedColor = findMatchedColor(p, queryTerms);

    return { product: p, score, matchedColor };
  });

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);   // return full objects, not just product
}

export default function SearchPage({ allProducts }) {
  const router  = useRouter();
  const [query,    setQuery]   = useState('');
  const [results,  setResults]  = useState([]); // each entry: { product, score, matchedColor }
  const [searched, setSearched] = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [searchKey,  setSearchKey]  = useState(0); // bumped to force re-run same query
  const inputRef = useRef(null);

  // Sync query from URL on mount and when URL changes
  useEffect(() => {
    const q = router.query.q ?? '';
    setQuery(q);
    if (q.trim().length >= 2) {
      // Small timeout so the loader is visible even for instant searches
      const t = setTimeout(() => {
        setResults(searchProducts(allProducts, q));
        setSearched(true);
        setLoading(false);
      }, 250);
      return () => clearTimeout(t);
    } else {
      setResults([]);
      setSearched(false);
      setLoading(false);
    }
  }, [router.query.q, allProducts, searchKey]);

  // Focus input on page load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;
    setLoading(true);
    const url = `/search?q=${encodeURIComponent(q)}`;
    // If same URL, router.push won't fire query change — bump key to force useEffect
    if (router.query.q === q) {
      setSearchKey((k) => k + 1);
    } else {
      router.push(url, undefined, { shallow: true });
    }
  };

  return (
    <>
      <Head>
        <title>{query ? `"${query}" — Search — HOP` : 'Search — Peacock'}</title>
        <meta name="description" content="Search HOP clothing catalog" />
      </Head>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Search bar ─────────────────────────────────────── */}
        <div className="max-w-xl mx-auto mb-10">
          <p className="section-label text-center mb-3">Catalog Search</p>
          <form onSubmit={handleSubmit} className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for t-shirts, shirts, cotton, formal…"
              maxLength={50}
              className="w-full border border-neutral-200 bg-white px-5 py-3.5 pr-14
                         text-neutral-800 placeholder-neutral-400
                         focus:outline-none focus:border-neutral-900
                         transition-colors"
              style={{ fontSize: '16px' }}
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center
                         bg-neutral-900 text-white hover:bg-hop-red transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
          </form>

          {/* Character counter — only visible near the limit */}
          {query.length >= 40 && (
            <p className="text-right text-[10px] text-neutral-400 mt-1 pr-1">
              {query.length}/50
            </p>
          )}

          {/* Suggested searches */}
          {!searched && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <p className="w-full text-center text-xs text-neutral-400 mb-1">Try searching for</p>
              {['cotton', 't-shirt', 'formal', 'linen', 'oversized', 'slim fit'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    setLoading(true);
                    router.push(`/search?q=${encodeURIComponent(term)}`, undefined, { shallow: true });
                  }}
                  className="chip hover:chip-active text-xs"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Loading spinner ───────────────────────────────── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            {/* Animated rings */}
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-neutral-100" />
              <div className="absolute inset-0 rounded-full border-2 border-t-hop-red border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            </div>
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-neutral-400">
              Searching…
            </p>
          </div>
        )}

        {/* ── Results ────────────────────────────────────────── */}
        {!loading && searched && (
          <>
            {/* Result count + back */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
              <div>
                {results.length > 0 ? (
                  <p className="text-sm text-neutral-600">
                    <span className="font-semibold text-neutral-900">{results.length}</span>
                    {' '}result{results.length !== 1 ? 's' : ''} for{' '}
                    <span className="font-semibold text-neutral-900">"{router.query.q}"</span>
                  </p>
                ) : (
                  <p className="text-sm text-neutral-600">
                    No results for{' '}
                    <span className="font-semibold text-neutral-900">"{router.query.q}"</span>
                  </p>
                )}
              </div>
              <Link
                href="/clothing"
                className="btn-ghost"
              >
                Browse All
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {results.map(({ product, matchedColor }, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={i < 4}
                    colorQuery={matchedColor?.name ?? null}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center bg-neutral-100">
                  <svg className="w-7 h-7 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <h2 className="display-heading text-xl mb-2">No products found</h2>
                <p className="text-sm text-neutral-400 mb-6 max-w-xs mx-auto">
                  Try a different keyword — like a fabric, fit, or category name.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['cotton', 't-shirt', 'formal', 'linen'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQuery(term);
                        setLoading(true);
                        router.push(`/search?q=${encodeURIComponent(term)}`, undefined, { shallow: true });
                      }}
                      className="chip"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

export async function getStaticProps() {
  const allProducts = getAllProducts();
  return { props: { allProducts } };
}
