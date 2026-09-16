'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createBannerAction(data: {
  title: string;
  subtitle?: string;
  imageUrl: string;
  targetUrl: string;
  badge?: string;
  displayOrder?: number;
  isActive?: boolean;
}) {
  try {
    const banner = await prisma.banner.create({
      data: {
        title: data.title,
        subtitle: data.subtitle || '',
        imageUrl: data.imageUrl,
        targetUrl: data.targetUrl || '/products',
        badge: data.badge || '',
        displayOrder: data.displayOrder || 0,
        isActive: data.isActive !== false,
      },
    });
    revalidatePath('/admin/content');
    revalidatePath('/');
    return { success: true, banner };
  } catch (error: any) {
    return { success: false, error: error.message || 'Không thể tạo banner.' };
  }
}

export async function deleteBannerAction(id: string) {
  try {
    await prisma.banner.delete({ where: { id } });
    revalidatePath('/admin/content');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Không thể xóa banner.' };
  }
}

export async function createArticleAction(data: {
  title: string;
  slug: string;
  category: string;
  coverImage: string;
  excerpt: string;
  content: string;
  author?: string;
  tags?: string[];
  isPublished?: boolean;
  seoTitle?: string;
  seoDesc?: string;
}) {
  try {
    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category,
        coverImage: data.coverImage,
        excerpt: data.excerpt,
        content: data.content,
        author: data.author || 'Kỹ sư GeoSurvey Pro',
        tags: JSON.stringify(data.tags || []),
        isPublished: data.isPublished !== false,
        seoTitle: data.seoTitle || data.title,
        seoDesc: data.seoDesc || data.excerpt,
      },
    });
    revalidatePath('/admin/content');
    return { success: true, article };
  } catch (error: any) {
    return { success: false, error: error.message || 'Không thể đăng bài viết.' };
  }
}

export async function updateArticleAction(id: string, data: any) {
  try {
    const updated = await prisma.article.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category,
        coverImage: data.coverImage,
        excerpt: data.excerpt,
        content: data.content,
        author: data.author,
        tags: JSON.stringify(data.tags || []),
        isPublished: data.isPublished,
        seoTitle: data.seoTitle,
        seoDesc: data.seoDesc,
      },
    });
    revalidatePath('/admin/content');
    return { success: true, article: updated };
  } catch (error: any) {
    return { success: false, error: error.message || 'Cập nhật bài viết thất bại.' };
  }
}

export async function deleteArticleAction(id: string) {
  try {
    await prisma.article.delete({ where: { id } });
    revalidatePath('/admin/content');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Không thể xóa bài viết.' };
  }
}
