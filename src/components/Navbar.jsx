import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import taxonomy from '@/data/taxonomy.json';
import HopLogo from '@/components/HopLogo';

function deriveLabelFromPath(pathname) {
  const path = pathname.split('?')[0].split('#')[0];
  const match = taxonomy.nav.find((item) => item.href === path);
  return match?.label ?? null;
}

const WA_ICON = (
  <svg className="w-[18px] h-[18px]" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  }, [router.asPath]);

  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = searchOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const currentLabel = router.isReady ? deriveLabelFromPath(router.asPath) : null;
  const isActive = (label) => currentLabel === label;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q.length < 2) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        {/* Announcement bar */}
        <div className="bg-hop-black text-white text-center py-2 text-[10px] tracking-[0.18em] uppercase font-semibold">
          Free shipping above ₹999&nbsp;&nbsp;·&nbsp;&nbsp;
          Code&nbsp;<span className="text-hop-red font-black tracking-wider">HOP10</span>
          &nbsp;for 10% off
        </div>

        {/* Main bar */}
        <div className="border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
            <Link href="/" className="flex-shrink-0 z-10">
              <HopLogo size={36} variant="full" />
            </Link>

            {/* Centered desktop nav */}
            <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {taxonomy.nav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`nav-link text-xs font-bold tracking-[0.12em] uppercase transition-colors ${
                    isActive(item.label) ? 'text-hop-red active' : 'text-neutral-700 hover:text-hop-black'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-3 z-10">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                className="w-9 h-9 flex items-center justify-center text-neutral-500 hover:text-hop-black transition-colors"
              >
                <svg className="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>

              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Order on WhatsApp"
                className="hidden md:flex w-9 h-9 items-center justify-center text-neutral-500 hover:text-[#25D366] transition-colors"
              >
                {WA_ICON}
              </a>

              <div className="w-px h-5 bg-neutral-200 hidden md:block" />

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                className="w-9 h-9 flex items-center justify-center text-neutral-700 md:hidden"
              >
                {menuOpen ? (
                  <svg className="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex justify-center" style={{ paddingTop: '92px' }}>
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
          />
          <div className="relative z-10 mt-4 w-full max-w-lg mx-4 h-fit animate-slide-up">
            <form onSubmit={handleSearchSubmit} className="bg-white shadow-modal">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100">
                <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text" value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search t-shirts, linen, oversized…"
                  maxLength={50}
                  className="flex-1 text-sm text-hop-black placeholder-neutral-400 bg-transparent border-none outline-none"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} className="text-neutral-300 hover:text-neutral-600">
                    <svg className="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="px-5 py-3 flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mr-1">Popular:</span>
                {['cotton', 't-shirt', 'formal', 'linen', 'oversized', 'slim fit'].map((term) => (
                  <button key={term} type="button"
                    onClick={() => { setSearchQuery(term); router.push(`/search?q=${encodeURIComponent(term)}`); }}
                    className="chip text-[10px] py-1"
                  >{term}</button>
                ))}
              </div>
              <div className="px-5 pb-4 flex items-center justify-between">
                <button type="submit" disabled={searchQuery.trim().length < 2}
                  className="btn-red py-2 px-5 disabled:opacity-40">
                  Search
                </button>
                <button type="button"
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-700">
                  Cancel (Esc)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
        menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
        <div className={`absolute top-0 left-0 h-full w-[300px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <HopLogo size={32} variant="full" />
            <button onClick={() => setMenuOpen(false)} className="w-8 h-8 flex items-center justify-center text-neutral-400">
              <svg className="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile search */}
          <div className="px-5 pt-8 pb-5 border-b border-neutral-100">
            <p className="section-label mb-3">Search</p>
            <button
              onClick={() => { setMenuOpen(false); setSearchOpen(true); }}
              className="w-full flex items-center gap-2.5 border border-neutral-200 px-4 py-3 text-sm text-neutral-400 hover:border-hop-black transition-colors"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Search products…
            </button>
          </div>

          <nav className="flex-1 px-5 py-5 overflow-y-auto">
            <p className="section-label mb-4">Browse</p>
            {taxonomy.nav.map((item) => (
              <Link key={item.label} href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between py-3.5 text-sm font-semibold border-b border-neutral-50 transition-colors ${
                  isActive(item.label) ? 'text-hop-red' : 'text-neutral-700 hover:text-hop-black'
                }`}
              >
                {item.label}
                <svg className="w-3.5 h-3.5 text-neutral-300" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </nav>

          <div className="p-5 border-t border-neutral-100">
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              {WA_ICON} Order on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="h-[92px]" />
    </>
  );
}
