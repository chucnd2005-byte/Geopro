import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllProducts, getCategories, getBrands } from '@/lib/db-service';
import ProductFilterClient from '@/components/products/ProductFilterClient';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { ChevronRight, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Danh Mục Thiết Bị Đo Đạc, Máy Định Vị RTK & Toàn Đạc Chính Hãng',
  description:
    'Bảng giá và thông số kỹ thuật các dòng máy định vị vệ tinh GNSS RTK 1408 kênh, máy toàn đạc điện tử 1", máy thủy bình tự động Leica, Trimble, Topcon, CHCNAV chính hãng.',
};

interface Props {
  searchParams: {
    category?: string;
    q?: string;
    quote?: string;
  };
}

export default async function ProductsPage({ searchParams }: Props) {
  const products = await getAllProducts();
  const categories = await getCategories();
  const brands = await getBrands();

  const breadcrumbItems = [
    { name: 'Trang chủ', url: 'https://geosurvey.vn' },
    { name: 'Thiết bị đo đạc', url: 'https://geosurvey.vn/products' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <BreadcrumbJsonLd items={breadcrumbItems} />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Trang chủ</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900">Thiết Bị Trắc Địa & Đo Đạc</span>
      </nav>

      {/* Page Title & Overview */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Danh Mục Thiết Bị Trắc Địa, Máy Định Vị RTK & Toàn Đạc
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Tất cả thiết bị đều được kiểm định hiệu chuẩn tại phòng thí nghiệm Vilas 110 / Quatest 1, bảo hành 24-36 tháng và hỗ trợ kỹ sư trực tiếp đo thử tại công trình trên 63 tỉnh thành.
        </p>
      </div>

      {/* Client Filter & Grid */}
      <ProductFilterClient
        initialProducts={products}
        categories={categories}
        brands={brands}
        initialCategory={searchParams.category}
        initialQuery={searchParams.q}
        initialQuoteOnly={searchParams.quote === 'true'}
      />
    </div>
  );
}
