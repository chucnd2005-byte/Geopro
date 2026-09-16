'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { signAdminToken, AUTH_COOKIE_NAME, getCurrentAdminSession } from '@/lib/auth';

export async function loginAdminAction(formData: { identifier: string; password: string }) {
  try {
    const { identifier, password } = formData;

    if (!identifier || !password) {
      return { success: false, error: 'Vui lòng nhập đầy đủ tài khoản và mật khẩu.' };
    }

    const user = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { email: identifier.trim().toLowerCase() },
          { username: identifier.trim().toLowerCase() },
        ],
      },
    });

    if (!user) {
      return { success: false, error: 'Tài khoản hoặc mật khẩu không chính xác.' };
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return { success: false, error: 'Tài khoản hoặc mật khẩu không chính xác.' };
    }

    const token = await signAdminToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role as 'ADMIN' | 'STAFF',
      avatar: user.avatar,
    });

    const cookieStore = cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error: any) {
    console.error('Login action error:', error);
    return { success: false, error: 'Đã xảy ra lỗi trong quá trình xác thực. Vui lòng thử lại.' };
  }
}

export async function logoutAdminAction() {
  try {
    const cookieStore = cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function getAdminSession() {
  return await getCurrentAdminSession();
}
