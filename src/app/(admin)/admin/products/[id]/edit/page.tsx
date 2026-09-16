import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';

interface Props {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      specs: true,
      downloads: true,
    },
  });

  if (!product) {
    notFound();
  }

  const categories = await prisma.category.findMany({ orderBy: { displayOrder: 'asc' } });
  const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="py-2">
      <ProductForm initialProduct={product} categories={categories} brands={brands} />
    </div>
  );
}
