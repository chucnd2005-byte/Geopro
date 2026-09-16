import React from 'react';
import prisma from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { displayOrder: 'asc' } });
  const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="py-2">
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
