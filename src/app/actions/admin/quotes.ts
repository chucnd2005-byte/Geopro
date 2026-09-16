'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateQuoteStatusAction(id: string, status: string) {
  try {
    const updated = await prisma.quoteRequest.update({
      where: { id },
      data: { status },
    });
    revalidatePath('/admin/quotes');
    revalidatePath('/admin/dashboard');
    return { success: true, quote: updated };
  } catch (error) {
    return { success: false, error: 'Không thể cập nhật trạng thái báo giá.' };
  }
}

export async function deleteQuoteAction(id: string) {
  try {
    await prisma.quoteRequest.delete({ where: { id } });
    revalidatePath('/admin/quotes');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Không thể xóa báo giá này.' };
  }
}
