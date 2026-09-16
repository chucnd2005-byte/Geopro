import React from 'react';
import prisma from '@/lib/prisma';
import ContentClient from './ContentClient';

export default async function AdminContentPage() {
  const banners = await prisma.banner.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Nội Dung, Banner Khuyến Mãi & Visual SEO CMS
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Quản trị slider trang chủ, bài viết kinh nghiệm đo đạc thực địa và công cụ kiểm tra mô phỏng Google SERP.
        </p>
      </div>

      <ContentClient initialBanners={banners} initialArticles={articles} />
    </div>
  );
}
