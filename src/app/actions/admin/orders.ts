'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatusAction(id: string, status: string) {
  try {
    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    });
    revalidatePath('/admin/orders');
    revalidatePath('/admin/dashboard');
    return { success: true, order: updated };
  } catch (error) {
    return { success: false, error: 'Không thể cập nhật trạng thái đơn hàng.' };
  }
}

export async function deleteOrderAction(id: string) {
  try {
    await prisma.order.delete({ where: { id } });
    revalidatePath('/admin/orders');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Không thể xóa đơn hàng.' };
  }
}
