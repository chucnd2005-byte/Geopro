'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteMediaAction(id: string) {
  try {
    await prisma.media.delete({ where: { id } });
    revalidatePath('/admin/media');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Không thể xóa file media này.' };
  }
}

export async function updateMediaAltAction(id: string, altText: string) {
  try {
    const updated = await prisma.media.update({
      where: { id },
      data: { altText },
    });
    revalidatePath('/admin/media');
    return { success: true, media: updated };
  } catch (error) {
    return { success: false, error: 'Không thể cập nhật thông tin Alt text.' };
  }
}

export async function getMediasAction(folder?: string) {
  try {
    const where: any = {};
    if (folder && folder !== 'all') {
      where.folder = folder;
    }
    return await prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    return [];
  }
}
