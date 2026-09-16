import prisma from '@/lib/prisma';

/**
 * Converts any string (especially Vietnamese text with diacritics and special characters)
 * into a clean, SEO-friendly URL slug.
 *
 * Examples:
 * "Máy GNSS RTK Foif A90 IMU" -> "may-gnss-rtk-foif-a90-imu"
 * "Máy Toàn Đạc Điện Tử Leica FlexLine TS07 (1\")" -> "may-toan-dac-dien-tu-leica-flexline-ts07-1"
 * "Đo đạc & Bản đồ địa chính" -> "do-dac-ban-do-dia-chinh"
 */
export function slugify(text: string): string {
  if (!text) return '';

  return (
    text
      .toString()
      .trim()
      // Convert Vietnamese 'đ' / 'Đ' to 'd' before NFD normalization
      .replace(/[đĐ]/g, 'd')
      // Decompose accented characters into base character + diacritical mark
      .normalize('NFD')
      // Remove all diacritical combining marks
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      // Replace non-alphanumeric characters (except spaces and hyphens) with space
      .replace(/[^a-z0-9\s-]/g, ' ')
      // Replace multiple spaces and underscores with a single hyphen
      .replace(/[\s_]+/g, '-')
      // Replace multiple consecutive hyphens with a single hyphen
      .replace(/-+/g, '-')
      // Strip leading and trailing hyphens
      .replace(/^-+|-+$/g, '')
  );
}

/**
 * Server-side helper to ensure slug uniqueness in the database.
 * If the generated slug already exists for another product, automatically
 * appends incremental counter suffixes (-1, -2, ...) until a unique slug is found.
 */
export async function generateUniqueProductSlug(
  baseNameOrSlug: string,
  excludeProductId?: string
): Promise<string> {
  const baseSlug = slugify(baseNameOrSlug) || 'thiet-bi-trac-dia';
  let candidate = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.product.findFirst({
      where: {
        slug: candidate,
        ...(excludeProductId ? { NOT: { id: excludeProductId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }

    candidate = `${baseSlug}-${counter}`;
    counter++;
  }
}
