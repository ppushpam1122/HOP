import { useState, useEffect, useRef, useCallback } from 'react';

export default function ImageLightbox({ images, initialIndex = 0, onClose }) {
  const [index,  setIndex]  = useState(initialIndex);
  const [scale,  setScale]  = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const touchStartRef   = useRef(null);
  const pinchDistRef    = useRef(null);
  const pinchScaleRef   = useRef(1);
  const isDraggingRef   = useRef(false);
  const dragStartRef    = useRef({ x: 0, y: 0 });
  const offsetRef       = useRef({ x: 0, y: 0 });

  const MIN_SCALE = 1;
  const MAX_SCALE = 1.5;

  const goTo = useCallback((i) => {
    const next = ((i % images.length) + images.length) % images.length;
    setIndex(next);
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
      const ns = Math.min(MAX_SCALE, Math.max(MIN_SCALE, pinchScaleRef.current * (dist / pinchDistRef.current)));
      setScale(ns);
      if (ns <= MIN_SCALE) {
        offsetRef.current = { x: 0, y: 0 };
        setOffset({ x: 0, y: 0 });
      }
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

  return (
    <div
      className="fixed inset-0 z-[90]"
      style={{ background: 'rgba(0,0,0,0.94)' }}
    >
      {/* ── Close button — top-right, always on top ───── */}
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: 'fixed', top: 16, right: 16, zIndex: 100,
          width: 44, height: 44,
          background: 'rgba(255,255,255,0.15)',
          border: '1.5px solid rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', borderRadius: 0,
        }}
      >
        <svg width="18" height="18" fill="none" stroke="white" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* ── Counter — top-left ────────────────────────── */}
      <div style={{ position: 'fixed', top: 24, left: 20, zIndex: 100, color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 500 }}>
        {index + 1} / {images.length}
      </div>

      {/* ── Image area — centre of screen ─────────────── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '72px 64px 80px',
          zIndex: 91,
          touchAction: 'none',
          userSelect: 'none',
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={onClose}     /* click outside image closes */
      >
        <img
          src={images[index]}
          alt={`Product image ${index + 1}`}
          onClick={(e) => e.stopPropagation()} /* don't close when clicking image */
          style={{
            maxWidth:    '100%',
            maxHeight:   '100%',
            objectFit:   'contain',
            display:     'block',
            transform:   `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`,
            transition:  'transform 0.2s ease',
            cursor:      scale > 1 ? 'grab' : 'zoom-in',
            userSelect:  'none',
            WebkitUserSelect: 'none',
            // Force SVGs to not overflow their container
            width:       'auto',
            height:      'auto',
          }}
          draggable={false}
        />
      </div>

      {/* ── Navigation ───────────────────────────────── */}
      {images.length > 1 && (
        <>
          {/* Left arrow */}
          <button
            onClick={() => goTo(index - 1)}
            aria-label="Previous"
            style={{
              position: 'fixed', left: 12, top: '50%', transform: 'translateY(-50%)',
              zIndex: 100, width: 44, height: 44,
              background: 'rgba(255,255,255,0.12)',
              border: '1.5px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg width="18" height="18" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right arrow */}
          <button
            onClick={() => goTo(index + 1)}
            aria-label="Next"
            style={{
              position: 'fixed', right: 12, top: '50%', transform: 'translateY(-50%)',
              zIndex: 100, width: 44, height: 44,
              background: 'rgba(255,255,255,0.12)',
              border: '1.5px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg width="18" height="18" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div style={{
            position: 'fixed', bottom: 20, left: 0, right: 0, zIndex: 100,
            display: 'flex', justifyContent: 'center', gap: 8,
          }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Image ${i + 1}`}
                style={{
                  height: 6, width: i === index ? 20 : 6,
                  borderRadius: 3,
                  background: i === index ? '#fff' : 'rgba(255,255,255,0.35)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
