import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { formatVND } from '@/lib/format';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import ProductsTableClient from './ProductsTableClient';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      brand: true,
      category: true,
      specs: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const categories = await prisma.category.findMany({ orderBy: { displayOrder: 'asc' } });
  const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Quản Lý Thiết Bị & Danh Mục Sản Phẩm
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tổng số: <strong className="text-white">{products.length}</strong> thiết bị trắc địa trong hệ thống kho.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-survey-600 hover:bg-survey-500 text-white font-bold text-xs rounded-xl shadow-md shadow-survey-600/30 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Thiết Bị Đo Mới</span>
        </Link>
      </div>

      {/* Client Filterable Table */}
      <ProductsTableClient
        initialProducts={products}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}
