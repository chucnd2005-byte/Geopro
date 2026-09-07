import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getAllProducts } from '@/lib/db-service';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import { ProductJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { ChevronRight, Home } from 'lucide-react';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return {
      title: 'Không Tìm Thấy Thiết Bị | GeoSurvey Pro',
    };
  }

  return {
    title: `${product.name} | GeoSurvey Pro`,
    description: product.shortDesc,
    openGraph: {
      title: `${product.name} - Thiết Bị Đo Đạc Chính Hãng`,
      description: product.shortDesc,
      images: [
        {
          url: product.mainImage,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  const allProducts = await getAllProducts();
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category.slug === product.category.slug || p.brand.slug === product.brand.slug))
    .slice(0, 3);

  const breadcrumbItems = [
    { name: 'Trang chủ', url: 'https://geosurvey.vn' },
    { name: product.category.name, url: `https://geosurvey.vn/products?category=${product.category.slug}` },
    { name: product.name, url: `https://geosurvey.vn/products/${product.slug}` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Structured Data (Schema.org) */}
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd items={breadcrumbItems} />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto pb-1">
        <Link href="/" className="hover:text-slate-900 flex items-center gap-1 shrink-0">
          <Home className="w-3.5 h-3.5" />
          <span>Trang chủ</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <Link
          href={`/products?category=${product.category.slug}`}
          className="hover:text-slate-900 shrink-0"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="font-semibold text-slate-900 truncate">{product.name}</span>
      </nav>

      {/* Main Interactive Product Detail */}
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </div>
  );
}
