import React from 'react';
import { Product } from '@/lib/types';

interface ProductJsonLdProps {
  product: Product;
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.gallery.length > 0 ? product.gallery : [product.mainImage],
    description: product.shortDesc,
    sku: product.sku,
    mpn: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand.name,
    },
    offers: {
      '@type': 'Offer',
      url: `https://geosurvey.vn/products/${product.slug}`,
      priceCurrency: 'VND',
      price: product.salePrice || product.basePrice,
      priceValidUntil: '2027-12-31',
      itemCondition:
        product.condition === 'NEW_100'
          ? 'https://schema.org/NewCondition'
          : 'https://schema.org/RefurbishedCondition',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/PreOrder',
      seller: {
        '@type': 'Organization',
        name: 'GeoSurvey Pro Việt Nam',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: Math.max(product.reviewCount, 1).toString(),
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FaqJsonLdProps {
  faqs: { question: string; answer: string }[];
}

export function FaqJsonLd({ faqs }: FaqJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GeoSurvey Pro Việt Nam',
    url: 'https://geosurvey.vn',
    logo: 'https://geosurvey.vn/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+84-988-355-688',
      contactType: 'technical support',
      areaServed: 'VN',
      availableLanguage: ['Vietnamese', 'English'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Tòa nhà Hateco Apollo, Đ. Xuân Phương, Nam Từ Liêm',
      addressLocality: 'Hà Nội',
      addressCountry: 'VN',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
