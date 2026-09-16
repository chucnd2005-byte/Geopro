import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'geosurvey_admin_jwt_secret_2026_super_secure_key_12345'
);

export const AUTH_COOKIE_NAME = 'geosurvey_admin_token';

export interface AdminTokenPayload {
  userId: string;
  username: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'STAFF';
  avatar?: string | null;
}

export async function signAdminToken(payload: AdminTokenPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminTokenPayload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentAdminSession(): Promise<AdminTokenPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyAdminToken(token);
  } catch (e) {
    return null;
  }
}
