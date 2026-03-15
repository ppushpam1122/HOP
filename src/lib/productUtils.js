/**
 * productUtils.js
 * Pure utility functions for product data manipulation.
 */

import taxonomy from '@/data/taxonomy.json';

/**
 * The base path prefix — empty in dev, '/Peacock' in production.
 * Must match basePath in next.config.js.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

/**
 * Resolves the public path to a product image.
 * @param {string} productId  e.g. "TSHIRT-001"
 * @param {string} filename   e.g. "1.jpg"
 * @returns {string}
 */
export function getImagePath(productId, filename) {
  return `${BASE}/products/${productId}/${filename}`;
}

/**
 * Returns the first image path for a product (thumbnail on cards).
 * @param {Object} product
 * @returns {string}
 */
export function getThumbnail(product) {
  if (product.images && product.images.length > 0) {
    return getImagePath(product.id, product.images[0]);
  }
  return `https://placehold.co/600x750/f5f5f5/a3a3a3?text=${encodeURIComponent(product.name)}`;
}

/**
 * Returns all image paths for a product gallery.
 * @param {Object} product
 * @returns {string[]}
 */
export function getGalleryImages(product) {
  if (!product.images || product.images.length === 0) {
    return [`https://placehold.co/600x750/f5f5f5/a3a3a3?text=${encodeURIComponent(product.name)}`];
  }
  return product.images.map((f) => getImagePath(product.id, f));
}

/**
 * Returns full-resolution image paths for the lightbox.
 * Falls back to regular gallery images if fullImages not set.
 * @param {Object} product
 * @returns {string[]}
 */
export function getFullImages(product) {
  const fullArr = product.fullImages || product.images || [];
  if (fullArr.length === 0) return getGalleryImages(product);
  return fullArr.map((f) => getImagePath(product.id, f));
}

/**
 * Formats a price in Indian Rupees.
 * @param {number} price
 * @returns {string}
 */
export function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`;
}

export function isColorInStock(color) {
  return Object.values(color.sizes).some(Boolean);
}

export function getAvailableSizes(color) {
  return Object.entries(color.sizes)
    .filter(([, inStock]) => inStock)
    .map(([size]) => size);
}

export function isSizeAvailable(color, size) {
  return color?.sizes?.[size] === true;
}

/**
 * Builds a WhatsApp order URL with a pre-filled message.
 * Includes the product page link so the seller can see the product image.
 *
 * @param {Object} options
 * @param {Object} options.product
 * @param {string} options.colorName
 * @param {string} options.size
 * @param {string} options.whatsappNumber   — international format, no +
 * @param {string} [options.productPageUrl] — full URL of the product page (window.location.href)
 * @returns {string} WhatsApp URL
 */
export function buildWhatsAppLink({
  product,
  colorName,
  size,
  quantity = 1,
  whatsappNumber = '919999999999',
  productPageUrl = '',
}) {
  const lines = [
    'Hi, I want to order:',
    `Product: ${product.name}`,
    `Color: ${colorName}`,
    `Size: ${size}`,
    `Quantity: ${quantity}`,
    `Price: ${formatPrice(product.price * quantity)}`,
  ];

  if (productPageUrl) {
    lines.push('');
    lines.push(`Product Link: ${productPageUrl}`);
  }

  const message = lines.join('\n');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encoded}`;
}

/**
 * Builds breadcrumb trail for a product using taxonomy.
 * @param {Object} product
 * @returns {Array<{ label: string, href: string }>}
 */
export function buildBreadcrumb(product) {
  const crumbs = [{ label: 'Home', href: '/' }];

  function walk(nodes, chain) {
    for (const node of nodes) {
      const current = [...chain, node];
      if (node.id === product.category) return current;
      if (node.children) {
        const found = walk(node.children, current);
        if (found) return found;
      }
    }
    return null;
  }

  const chain = walk(taxonomy.categories, []);
  if (chain) {
    chain.forEach((node) => {
      crumbs.push({ label: node.label, href: `/clothing/${node.slug}` });
    });
  }

  crumbs.push({ label: product.name, href: `/product/${product.slug}` });
  return crumbs;
}

/**
 * Returns a discount percentage label or null.
 * @param {Object} product
 * @returns {string|null}
 */
export function getDiscountLabel(product) {
  if (!product.originalPrice || product.originalPrice <= product.price) return null;
  const pct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  return `${pct}% OFF`;
}
