import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * ImageLightbox
 * - Uses z-index 9999 so it always appears above everything on the product page
 * - Frosted glass dark backdrop (rgba 20% opacity + backdrop-filter blur)
 * - All controls use position:fixed with very high z-index
 * - Click outside image to close
 * - Swipe left/right on mobile to navigate
 * - Pinch to zoom (1x–1.5x only)
 */
export default function ImageLightbox({ images, initialIndex = 0, onClose }) {
  const [index,  setIndex]  = useState(initialIndex);
  const [scale,  setScale]  = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const touchStartRef  = useRef(null);
  const pinchDistRef   = useRef(null);
  const pinchScaleRef  = useRef(1);
  const offsetRef      = useRef({ x: 0, y: 0 });
  const isDraggingRef  = useRef(false);
  const dragStartRef   = useRef({ x: 0, y: 0 });

  const goTo = useCallback((i) => {
    const n = ((i % images.length) + images.length) % images.length;
    setIndex(n);
    setScale(1);
    setOffset({ x: 0, y: 0 });
    offsetRef.current = { x: 0, y: 0 };
  }, [images.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowLeft')  goTo(index - 1);
      if (e.key === 'ArrowRight') goTo(index + 1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, goTo, onClose]);

  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      isDraggingRef.current = scale > 1;
      dragStartRef.current  = {
        x: e.touches[0].clientX - offsetRef.current.x,
        y: e.touches[0].clientY - offsetRef.current.y,
      };
    } else if (e.touches.length === 2) {
      pinchDistRef.current  = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchScaleRef.current = scale;
    }
  };

  const onTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 2 && pinchDistRef.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ns = Math.min(1.5, Math.max(1, pinchScaleRef.current * (dist / pinchDistRef.current)));
      setScale(ns);
      if (ns <= 1) { offsetRef.current = { x: 0, y: 0 }; setOffset({ x: 0, y: 0 }); }
    } else if (e.touches.length === 1 && scale > 1 && isDraggingRef.current) {
      const nx = e.touches[0].clientX - dragStartRef.current.x;
      const ny = e.touches[0].clientY - dragStartRef.current.y;
      offsetRef.current = { x: nx, y: ny };
      setOffset({ x: nx, y: ny });
    }
  };

  const onTouchEnd = (e) => {
    pinchDistRef.current = null;
    if (e.changedTouches.length === 1 && touchStartRef.current && scale === 1) {
      const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartRef.current.y);
      if (Math.abs(dx) > 50 && dy < 80) dx < 0 ? goTo(index + 1) : goTo(index - 1);
    }
    touchStartRef.current = null;
    isDraggingRef.current = false;
  };

  // Shared button style
  const btnStyle = (extra = {}) => ({
    position: 'fixed',
    zIndex: 10001,
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.18)',
    border: '1.5px solid rgba(255,255,255,0.35)',
    cursor: 'pointer',
    ...extra,
  });

  return (
    <>
      {/*
        Backdrop: frosted glass — only 20% black opacity + blur
        The user can dimly see the page behind it.
        z-index 9998 so it's above ALL product page content.
      */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          background: 'rgba(0,0,0,0.20)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      />

      {/* Close button — top right */}
      <button onClick={onClose} aria-label="Close" style={btnStyle({ top: 16, right: 16, zIndex: 10001 })}>
        <svg width="18" height="18" fill="none" stroke="white" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Counter — top left */}
      <div style={{ position: 'fixed', top: 22, left: 20, zIndex: 10001, color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
        {index + 1} / {images.length}
      </div>

      {/* Image area — centred, with padding to leave space around viewport */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '72px 56px 72px',
          touchAction: 'none',
          userSelect: 'none',
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={onClose}
      >
        <img
          src={images[index]}
          alt={`Product image ${index + 1}`}
          onClick={(e) => e.stopPropagation()}
          draggable={false}
          style={{
            maxWidth:    '100%',
            maxHeight:   '100%',
            objectFit:   'contain',
            display:     'block',
            width:       'auto',
            height:      'auto',
            transform:   `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`,
            transition:  'transform 0.2s ease',
            cursor:      scale > 1 ? 'grab' : 'zoom-in',
            // Rounded shadow to separate from frosted backdrop
            boxShadow:   '0 8px 48px rgba(0,0,0,0.55)',
          }}
        />
      </div>

      {/* Left/right arrows */}
      {images.length > 1 && (
        <>
          <button onClick={() => goTo(index - 1)} aria-label="Previous"
            style={btnStyle({ left: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 10001 })}>
            <svg width="18" height="18" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={() => goTo(index + 1)} aria-label="Next"
            style={btnStyle({ right: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 10001 })}>
            <svg width="18" height="18" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <div style={{ position: 'fixed', bottom: 18, left: 0, right: 0, zIndex: 10001, display: 'flex', justifyContent: 'center', gap: 8 }}>
          {images.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Image ${i + 1}`}
              style={{
                height: 6, width: i === index ? 20 : 6, borderRadius: 3, padding: 0, border: 'none', cursor: 'pointer',
                background: i === index ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s ease',
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
