import { useState } from 'react';
import Image from 'next/image';
import { getGalleryImages, getFullImages } from '@/lib/productUtils';
import ImageLightbox from '@/components/ImageLightbox';

export default function ProductGallery({ product }) {
  const thumbImages = getGalleryImages(product);   // small — fast page load
  const fullImages  = getFullImages(product);       // large — loaded only on lightbox open
  const [activeIdx,   setActiveIdx]   = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState(null); // null = closed

  const openLightbox = (i) => setLightboxIdx(i);
  const closeLightbox = () => setLightboxIdx(null);

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4">
        {/* Thumbnail strip */}
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[600px]
                        pb-1 md:pb-0 md:w-20 flex-shrink-0">
          {thumbImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`relative flex-shrink-0 w-16 h-20 md:w-20 md:h-24 border-2 overflow-hidden transition-all ${
                activeIdx === i ? 'border-hop-black' : 'border-transparent hover:border-neutral-300'
              }`}
            >
              <Image src={src} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>

        {/* Main image — click opens lightbox */}
        <div className="flex-1 relative">
          <div
            className="relative w-full aspect-[3/4] bg-neutral-100 overflow-hidden cursor-zoom-in group"
            onClick={() => openLightbox(activeIdx)}
          >
            <Image
              key={thumbImages[activeIdx]}
              src={thumbImages[activeIdx]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-cover animate-fade-in"
            />

            {/* Zoom hint */}
            <div className="absolute top-3 right-3 w-8 h-8 bg-white/80 flex items-center justify-center
                            opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
              </svg>
            </div>

            {/* Nav arrows */}
            {thumbImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveIdx((p) => (p === 0 ? thumbImages.length - 1 : p - 1)); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white
                             flex items-center justify-center shadow transition-all"
                  aria-label="Previous"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveIdx((p) => (p === thumbImages.length - 1 ? 0 : p + 1)); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white
                             flex items-center justify-center shadow transition-all"
                  aria-label="Next"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Counter */}
            {thumbImages.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5">
                {activeIdx + 1}/{thumbImages.length}
              </div>
            )}
          </div>

          {/* Dot indicators */}
          {thumbImages.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-3">
              {thumbImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${activeIdx === i ? 'w-4 bg-hop-black' : 'w-1.5 bg-neutral-300'}`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox — only mounts when open, loads full-res images lazily */}
      {lightboxIdx !== null && (
        <ImageLightbox
          images={fullImages}
          initialIndex={lightboxIdx}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}
