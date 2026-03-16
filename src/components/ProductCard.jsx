import Link from 'next/link';
import Image from 'next/image';
import { getThumbnail, formatPrice, getDiscountLabel } from '@/lib/productUtils';

export default function ProductCard({ product, priority = false, colorQuery = null }) {
  const thumbnail   = getThumbnail(product);
  const discount    = getDiscountLabel(product);
  const discountPct = discount ? parseInt(discount) : null;

  const href = colorQuery
    ? `/product/${product.slug}?color=${encodeURIComponent(colorQuery)}`
    : `/product/${product.slug}`;

  // Build tag string — e.g. "Casual | Regular Fit"
  const tag = [product.subcategory, product.fit]
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' | ');

  return (
    <Link href={href} className="group block bg-white shadow-card hover:shadow-card-hover transition-shadow duration-200">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-hop-grey overflow-hidden img-zoom">
        <Image
          src={thumbnail}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 280px"
          className="object-cover"
          priority={priority}
        />

        {/* Discount badge */}
        {discountPct && (
          <span className="absolute top-2.5 left-2.5 bg-hop-red text-white text-[10px] font-bold px-2 py-0.5">
            {discountPct}% OFF
          </span>
        )}

        {/* Wishlist — desktop hover only */}
        <button
          onClick={(e) => e.preventDefault()}
          aria-label="Save"
          className="absolute top-2.5 right-2.5 w-8 h-8 items-center justify-center
                     bg-white/90 text-neutral-400 hover:text-hop-red
                     transition-all duration-200
                     hidden md:flex opacity-0 group-hover:opacity-100"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>

      {/* Info — min-height so all cards are same total height */}
      <div className="p-3" style={{ minHeight: 120 }}>
        {/* Tag */}
        {tag && <p className="product-tag mb-1">{tag}</p>}

        {/* Name */}
        <h3 className="text-xs sm:text-sm font-bold text-hop-black leading-snug line-clamp-2 mb-1">
          {product.name}
        </h3>

        {/* Price row */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xs sm:text-sm font-bold text-hop-black">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <>
              <span className="text-xs text-neutral-400 line-through">{formatPrice(product.originalPrice)}</span>
              <span className="text-xs font-bold text-hop-red">{discountPct}% off</span>
            </>
          )}
        </div>

        {/* Shop Now button */}
        <div className="btn-red w-full text-center py-2.5 text-[11px]">
          Shop Now
        </div>
      </div>
    </Link>
  );
}
