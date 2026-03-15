/**
 * HOP Logo — renders the SVG from /public/hop-logo.svg
 * Uses a plain <img> (not next/image) so basePath is not needed.
 * The src is built using NEXT_PUBLIC_BASE_PATH for GitHub Pages compatibility.
 */
export default function HopLogo({ height = 40, className = '' }) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return (
    <img
      src={`${base}/hop-logo.svg`}
      alt="HOP — House of Peacock"
      height={height}
      width={Math.round(height * 3.5)}
      style={{ height, width: 'auto', objectFit: 'contain', display: 'inline-block' }}
      className={className}
    />
  );
}
