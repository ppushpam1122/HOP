import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import ProductGallery from '@/components/ProductGallery';
import ProductCard from '@/components/ProductCard';
import Breadcrumb from '@/components/Breadcrumb';
import {
  formatPrice,
  buildBreadcrumb,
  buildWhatsAppLink,
  getDiscountLabel,
  getAvailableSizes,
  isColorInStock,
} from '@/lib/productUtils';
import { getAllSlugs, getProductBySlug, getAllProducts } from '@/lib/catalogLoader';

const WHATSAPP_NUMBER = '919999999999';
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const SIZE_GUIDE_DATA = [
  { size: 'S',   chest: '40', length: '27' },
  { size: 'M',   chest: '42', length: '28' },
  { size: 'L',   chest: '44', length: '29' },
  { size: 'XL',  chest: '46', length: '30' },
  { size: 'XXL', chest: '48', length: '31' },
];

/* ── Fit selector: radio-pill style ─────────────────────── */
function FitSelector({ fits, selectedFit, onChange }) {
  if (!fits || fits.length === 0) return null;
  return (
    <div className="mb-5">
      <p className="text-sm font-bold text-hop-black mb-3">Fit</p>
      <div className="flex flex-wrap gap-2">
        {fits.map((fit) => {
          const active = selectedFit === fit;
          return (
            <button
              key={fit}
              onClick={() => onChange(fit)}
              className={`flex items-center gap-2 px-4 py-2 border-2 text-sm font-semibold transition-all ${
                active
                  ? 'bg-hop-black border-hop-black text-white'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-500'
              }`}
            >
              {/* Radio dot */}
              <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                active ? 'border-white' : 'border-neutral-400'
              }`}>
                {active && <span className="w-2 h-2 rounded-full bg-white" />}
              </span>
              {fit}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Color selector: circle + label row ─────────────────── */
function ColorRow({ colors, selected, onChange }) {
  if (!colors || colors.length === 0) return null;
  return (
    <div className="mb-5">
      <p className="text-sm font-bold text-hop-black mb-3">Color</p>
      <div className="flex flex-wrap gap-4">
        {colors.map((color) => {
          const inStock  = isColorInStock(color);
          const active   = selected?.name === color.name;
          const isLight  = color.hex === '#ffffff' || color.hex.startsWith('#f') || color.hex.startsWith('#e') || color.hex.startsWith('#d');
          return (
            <button
              key={color.name}
              onClick={() => inStock && onChange(color)}
              disabled={!inStock}
              className={`flex items-center gap-2 transition-all ${!inStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span
                className={`w-6 h-6 rounded-full flex-shrink-0 ${isLight ? 'border border-neutral-300' : ''} ${
                  active ? 'ring-2 ring-hop-black ring-offset-1' : ''
                }`}
                style={{ backgroundColor: color.hex }}
              />
              <span className={`text-sm font-semibold ${active ? 'text-hop-black' : 'text-neutral-600'}`}>
                {color.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Size selector: square buttons ─────────────────────── */
function SizeRow({ color, selected, onChange, onSizeGuideClick }) {
  if (!color) return (
    <div className="mb-5">
      <p className="text-sm font-bold text-hop-black mb-3">Size</p>
      <p className="text-sm text-neutral-400 italic">Select a color first</p>
    </div>
  );

  const sortedSizes = Object.keys(color.sizes).sort(
    (a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b)
  );

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-hop-black">Size</span>
        <button
          onClick={onSizeGuideClick}
          className="text-sm text-neutral-600 underline underline-offset-2 hover:text-hop-red transition-colors font-medium"
        >
          Size Guide
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sortedSizes.map((size) => {
          const available  = color.sizes[size] === true;
          const isSelected = selected === size;
          return (
            <button
              key={size}
              onClick={() => available && onChange(size)}
              disabled={!available}
              className={`relative min-w-[48px] h-11 px-3 text-sm font-bold border-2 transition-all ${
                isSelected
                  ? 'bg-hop-black text-white border-hop-black'
                  : available
                  ? 'bg-white text-hop-black border-neutral-200 hover:border-hop-black'
                  : 'bg-hop-grey text-neutral-300 border-neutral-100 cursor-not-allowed'
              }`}
            >
              {size}
              {!available && (
                <span className="absolute inset-0 overflow-hidden pointer-events-none">
                  <span className="absolute top-1/2 left-0 right-0 h-px bg-neutral-300 rotate-[18deg] origin-center" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Inline Size Guide card (floating, not overlay) ─────── */
function SizeGuideCard({ onClose }) {
  return (
    <div className="bg-white border border-neutral-200 shadow-modal w-72 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
        <h3 className="font-bold text-sm">Size Guide</h3>
        <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {/* Table */}
      <div className="px-2 pt-2 pb-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-neutral-100">
              <th className="px-2 py-2 font-semibold text-neutral-700">Size</th>
              <th className="px-2 py-2 font-semibold text-neutral-700">Chest</th>
              <th className="px-2 py-2 font-semibold text-neutral-700">Length</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_GUIDE_DATA.map((row, i) => (
              <tr key={row.size} className={i % 2 === 0 ? 'bg-neutral-50' : ''}>
                <td className="px-2 py-2 font-semibold">{row.size}</td>
                <td className="px-2 py-2 text-neutral-600">{row.chest}</td>
                <td className="px-2 py-2 text-neutral-600">{row.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-neutral-100">
        <button
          onClick={onClose}
          className="w-full py-2 border border-neutral-200 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────── */
export default function ProductPage({ product, related }) {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedFit,   setSelectedFit]   = useState(null);
  const [selectedSize,  setSelectedSize]  = useState(null);
  const [orderReady,    setOrderReady]    = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [mounted,       setMounted]       = useState(false);
  const [quantity,      setQuantity]      = useState(1);
  const galleryRef    = useRef(null);
  const colorInitDone = useRef(false);
  const router        = useRouter();

  useEffect(() => { setMounted(true); }, []);

  // Init color from URL ?color= or first in-stock
  useEffect(() => {
    if (!product?.colors?.length) return;
    const queryColor = router.query.color;
    if (queryColor) {
      const matched = product.colors.find(
        (c) => c.name.toLowerCase() === decodeURIComponent(queryColor).toLowerCase()
      );
      if (matched) { setSelectedColor(matched); return; }
    }
    setSelectedColor(product.colors.find(isColorInStock) ?? product.colors[0]);
  }, [product, router.query.color]);

  // Init fit from product fits list
  useEffect(() => {
    if (product?.fit) setSelectedFit(product.fit);
  }, [product]);

  // Auto-select first available size + scroll gallery on color change
  useEffect(() => {
    if (selectedColor) {
      setSelectedSize(getAvailableSizes(selectedColor)[0] ?? null);
    }
    if (colorInitDone.current && galleryRef.current) {
      const rect = galleryRef.current.getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + rect.top - 100, behavior: 'smooth' });
    }
    colorInitDone.current = true;
  }, [selectedColor]);

  useEffect(() => {
    setOrderReady(!!selectedColor && !!selectedSize);
  }, [selectedColor, selectedSize]);

  if (!product) return null;

  const discount    = getDiscountLabel(product);
  const discountPct = discount ? parseInt(discount) : null;
  const whatsappUrl = buildWhatsAppLink({
    product,
    colorName:      selectedColor?.name ?? 'N/A',
    size:           selectedSize  ?? 'N/A',
    quantity,
    whatsappNumber: WHATSAPP_NUMBER,
    productPageUrl: mounted ? window.location.href : '',
  });
  const breadcrumbs = buildBreadcrumb(product);

  // Collect unique fits from the product (or use product.fit directly)
  const fits = product.fit ? [product.fit] : [];

  return (
    <>
      <Head>
        <title>{product.name} — House of Peacock</title>
        <meta name="description" content={`${product.name}. ${product.description?.slice(0, 140)}`} />
      </Head>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-5">
          <Breadcrumb crumbs={breadcrumbs} />
        </div>

        {/* ── Product layout ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* LEFT: Gallery */}
          <div ref={galleryRef} className="animate-fade-in">
            <ProductGallery product={product} />
          </div>

          {/* RIGHT: Details */}
          <div className="flex flex-col animate-fade-up">
            {/* Name + price */}
            <h1 className="font-display font-black text-2xl sm:text-3xl text-hop-black leading-tight mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-black text-hop-black">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-base text-neutral-400 line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="bg-hop-red text-white text-xs font-bold px-2 py-0.5">{discountPct}% OFF</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-600 leading-relaxed mb-5">
              {product.description}
            </p>

            {/* Fit selector */}
            <FitSelector
              fits={fits}
              selectedFit={selectedFit}
              onChange={setSelectedFit}
            />

            {/* Color selector */}
            <ColorRow
              colors={product.colors}
              selected={selectedColor}
              onChange={setSelectedColor}
            />

            {/* Size selector */}
            <SizeRow
              color={selectedColor}
              selected={selectedSize}
              onChange={setSelectedSize}
              onSizeGuideClick={() => setShowSizeGuide(!showSizeGuide)}
            />

            {/* Inline Size Guide card */}
            {showSizeGuide && (
              <div className="mb-5">
                <SizeGuideCard onClose={() => setShowSizeGuide(false)} />
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-0 mb-5">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center border-2 border-neutral-200 hover:border-hop-black text-hop-black font-bold text-lg transition-colors"
              >
                −
              </button>
              <span className="w-12 h-10 flex items-center justify-center border-t-2 border-b-2 border-neutral-200 text-sm font-bold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center border-2 border-neutral-200 hover:border-hop-black text-hop-black font-bold text-lg transition-colors"
              >
                +
              </button>
            </div>

            {/* CTAs — ADD TO CART + BUY NOW */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn-red w-full py-4 text-base justify-center font-black tracking-widest mb-3 ${
                !orderReady ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              ADD TO CART
            </a>
            <a
              href={`https://wa.me/919999999999?text=${encodeURIComponent(
                `Hi, I want to buy: ${product.name} — ${formatPrice(product.price)}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-black w-full py-4 text-base justify-center font-black tracking-widest mb-4"
            >
              BUY NOW
            </a>

            {!orderReady && (
              <p className="text-xs text-center text-neutral-400 -mt-2 mb-3">
                Please select a color and size first.
              </p>
            )}

            {/* Delivery */}
            <div className="flex items-center gap-2 text-sm text-neutral-700 mb-6">
              <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Delivery available in 4–7 days
            </div>

            {/* Product Details */}
            <div className="border-t border-neutral-100 pt-5">
              <h3 className="font-black text-base text-hop-black mb-4">Product Details</h3>
              <div className="space-y-1.5 text-sm text-neutral-700 mb-4">
                {product.material && (
                  <p><span className="font-semibold">Fabric:</span> {product.material}</p>
                )}
                {product.fit && (
                  <p><span className="font-semibold">Fit:</span> {product.fit}</p>
                )}
{product.design && (
                  <p><span className="font-semibold">Design:</span> {product.design}</p>
                )}
                {product.subcategory && (
                  <p><span className="font-semibold">Style:</span> {product.subcategory.charAt(0).toUpperCase() + product.subcategory.slice(1)}</p>
                )}
                <p><span className="font-semibold">SKU:</span> <span className="font-mono text-xs">{product.id}</span></p>
              </div>
              {/* Tag pills */}
              <div className="flex flex-wrap gap-2">
{product.design && (
                  <span className="border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600">
                    Design: {product.design}
                  </span>
                )}
                {product.fit && (
                  <span className="border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600">
                    Fit: {product.fit}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── You may also like ──────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-16 pt-8 border-t border-neutral-200">
            <h2 className="font-display font-black text-xl text-center text-hop-black mb-8">
              You may also like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: getAllSlugs().map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const product = getProductBySlug(params.slug);
  if (!product) return { notFound: true };
  const related = getAllProducts()
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  return { props: { product, related } };
}
