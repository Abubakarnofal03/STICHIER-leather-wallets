// Generate structured data (JSON-LD) for different content types

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Stichéra",
  "alternateName": "Stichera",
  "url": "https://stichera.shop",
  "logo": "https://stichera.shop/logo.jpg",
  "description": "Stichéra curates exquisite handcrafted leather wallets, premium home décor, and refined lifestyle accessories. Artisanal craftsmanship meets timeless sophistication.",
  "sameAs": [
    "https://facebook.com/stichera",
    "https://instagram.com/stichera"
  ]
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Stichéra",
  "url": "https://stichera.shop",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://stichera.shop/shop?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const productSchema = (product: {
  name: string;
  description: string;
  price: number;
  images: string[];
  sku?: string;
  stock_quantity?: number;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description || product.name,
  "image": product.images.map(img => img.startsWith('http') ? img : `https://stichera.shop${img}`),
  "sku": product.sku || product.name,
  "brand": {
    "@type": "Brand",
    "name": "Stichéra"
  },
  "offers": {
    "@type": "Offer",
    "url": typeof window !== 'undefined' ? window.location.href : '',
    "priceCurrency": "PKR",
    "price": product.price,
    "availability": product.stock_quantity && product.stock_quantity > 0 
      ? "https://schema.org/InStock" 
      : "https://schema.org/OutOfStock",
    "seller": {
      "@type": "Organization",
      "name": "Stichéra"
    }
  }
});

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url.startsWith('http') ? item.url : `https://stichera.shop${item.url}`
  }))
});

export const blogPostSchema = (post: {
  title: string;
  excerpt: string;
  author: string;
  created_at: string;
  featured_image_url?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "description": post.excerpt,
  "author": {
    "@type": "Person",
    "name": post.author
  },
  "publisher": {
    "@type": "Organization",
    "name": "Stichéra",
    "logo": {
      "@type": "ImageObject",
      "url": "https://stichera.shop/logo.jpg"
    }
  },
  "datePublished": post.created_at,
  "image": post.featured_image_url 
    ? (post.featured_image_url.startsWith('http') ? post.featured_image_url : `https://stichera.shop${post.featured_image_url}`)
    : "https://stichera.shop/logo.jpg"
});
