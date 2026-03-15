import Head from 'next/head';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import { getFeaturedProducts } from '@/lib/catalogLoader';

export default function HomePage({ featured }) {
  return (
    <>
      <Head>
        <title>House of Peacock (HOP) — Premium Clothing</title>
        <meta name="description" content="House of Peacock — premium T-shirts, shirts, and more. Crafted for the bold." />
      </Head>

      <Navbar />

      <main>
        {/* ── HERO ──────────────────────────────────────── */}
        <section className="relative min-h-[85vh] flex items-end bg-hop-black overflow-hidden">
          {/* Background layering */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-hop-black via-neutral-900 to-hop-black" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-hop-red/8" />
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: 'repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 80px)' }}
            />
          </div>

          {/* Red vertical accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-hop-red" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pb-16 pt-28 w-full">
            <p className="section-label text-hop-red animate-fade-up mb-4">New Collection — 2025</p>
            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-8xl text-white mb-5 animate-fade-up animation-delay-100 leading-none">
              WEAR<br />
              <span className="text-hop-red">BOLD.</span><br />
              <span className="text-white/80 text-3xl sm:text-4xl lg:text-5xl font-bold">House of Peacock</span>
            </h1>
            <p className="text-neutral-400 text-base mb-8 max-w-sm leading-relaxed animate-fade-up animation-delay-200">
              Premium fabrics. Uncompromising quality. Designed for those who refuse the ordinary.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-up animation-delay-300">
              <Link href="/clothing" className="btn-red px-8 py-4 text-sm">
                Shop Collection
              </Link>
              <Link href="/clothing/tshirts" className="btn-outline-black border-white text-white hover:bg-white hover:text-hop-black px-8 py-4 text-sm">
                T-Shirts
              </Link>
            </div>

            <div className="flex gap-10 mt-14 pt-8 border-t border-white/10 animate-fade-up animation-delay-400">
              {[
                { value: '200+', label: 'Styles' },
                { value: '50K+', label: 'Customers' },
                { value: '100%', label: 'Cotton' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-black text-white font-display">{s.value}</p>
                  <p className="text-[10px] text-neutral-500 tracking-widest uppercase mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 right-8 text-white/20 text-[10px] tracking-widest uppercase rotate-90">
            Scroll
          </div>
        </section>

        {/* ── CATEGORY TILES ───────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="section-label text-center mb-3">Shop by Category</p>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-center mb-10">Find Your Style</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'T-Shirts',  sub: 'Casual & Oversized',     href: '/clothing/tshirts', dark: false },
              { label: 'Shirts',    sub: 'Formal & Relaxed',        href: '/clothing/shirts',  dark: true  },
            ].map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className={`group relative overflow-hidden flex flex-col justify-between min-h-[220px] p-10 sm:p-14 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${
                  cat.dark ? 'bg-hop-black' : 'bg-white'
                }`}
              >
                <div>
                  <p className={`section-label mb-3 ${cat.dark ? 'text-hop-red' : ''}`}>{cat.sub}</p>
                  <h3 className={`font-display font-black text-4xl sm:text-5xl ${cat.dark ? 'text-white' : 'text-hop-black'}`}>
                    {cat.label}
                  </h3>
                </div>
                <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest mt-8 transition-colors ${
                  cat.dark ? 'text-white/60 group-hover:text-white' : 'text-neutral-400 group-hover:text-hop-black'
                }`}>
                  Shop Now
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                {/* Red corner accent */}
                <div className={`absolute bottom-0 right-0 w-1 h-full ${cat.dark ? 'bg-hop-red' : 'bg-hop-red/20 group-hover:bg-hop-red'} transition-colors duration-300`} />
              </Link>
            ))}
          </div>
        </section>

        {/* ── FEATURED PRODUCTS ─────────────────────────── */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="section-label mb-2">Handpicked</p>
                <h2 className="font-display font-black text-2xl sm:text-3xl">Featured Pieces</h2>
              </div>
              <Link href="/clothing"
                className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-hop-red transition-colors group">
                View All
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {featured.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i < 2} />
              ))}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Link href="/clothing" className="btn-red">View All Products</Link>
            </div>
          </div>
        </section>

        {/* ── BRAND PROMISE ─────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-label mb-4">Our Promise</p>
              <h2 className="font-display font-black text-3xl sm:text-4xl leading-tight mb-5">
                Built Different.<br /><span className="text-hop-red">Worn Better.</span>
              </h2>
              <p className="text-neutral-500 text-sm leading-relaxed mb-8 max-w-md">
                Every HOP piece starts with one question: will this last? We source only the finest ring-spun cottons and natural fabrics, cut in small batches so nothing slips through.
              </p>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { icon: '🧵', title: 'Premium Fabrics',  desc: 'Ring-spun & combed cottons' },
                  { icon: '✂️', title: 'Precise Tailoring', desc: 'Engineered fits for all' },
                  { icon: '🌱', title: 'Sustainable',       desc: 'Responsible sourcing' },
                  { icon: '💬', title: 'WhatsApp Orders',   desc: 'Direct, zero hassle' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-bold text-sm text-hop-black">{item.title}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-hop-black relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display font-black text-[200px] text-white/5 select-none leading-none">H</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-hop-red/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="font-display text-3xl text-white font-bold italic leading-snug">
                    "Quality you can feel from the first touch."
                  </p>
                </div>
                {/* Red corner bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-hop-red" />
              </div>
              <div className="absolute -bottom-3 -right-3 w-full h-full border-2 border-hop-red/30 -z-10" />
            </div>
          </div>
        </section>

        {/* ── WHATSAPP CTA ──────────────────────────────── */}
        <section className="bg-[#075e54] py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[#25D366] text-[10px] font-bold tracking-widest uppercase mb-3">Easy Ordering</p>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white mb-4">
              Order Directly via WhatsApp
            </h2>
            <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">
              Browse, pick your size and colour, then message us. No accounts, no complicated checkouts.
            </p>
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1daf54] text-white font-bold px-8 py-4 text-sm uppercase tracking-wide transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat with Us on WhatsApp
            </a>
          </div>
        </section>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const featured = getFeaturedProducts();
  return { props: { featured } };
}
