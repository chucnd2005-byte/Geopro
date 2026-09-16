'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { generateUniqueProductSlug, slugify } from '@/lib/utils/slugify';

const productSchema = z.object({
  name: z.string().min(2, 'Tên thiết bị phải có ít nhất 2 ký tự'),
  slug: z.string().min(2, 'Slug không hợp lệ'),
  sku: z.string().min(2, 'SKU không hợp lệ'),
  brandId: z.string().min(1, 'Vui lòng chọn thương hiệu'),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  basePrice: z.number().min(0),
  salePrice: z.number().nullable().optional(),
  stock: z.number().int().min(0),
  condition: z.enum(['NEW_100', 'REFURBISHED_99']),
  origin: z.string().default('Chính hãng'),
  warrantyMonths: z.number().int().default(24),
  isQuoteOnly: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  mainImage: z.string().min(1, 'Vui lòng chọn ảnh đại diện'),
  gallery: z.array(z.string()).default([]),
  shortDesc: z.string().default(''),
  fullDesc: z.string().default(''),
  highlights: z.array(z.string()).default([]),
  standardPackage: z.array(z.string()).default([]),
  specs: z.any().optional(),
  downloads: z.array(z.object({
    title: z.string(),
    docType: z.string(),
    fileUrl: z.string(),
    fileSize: z.string(),
  })).optional(),
});

export async function validateOrGenerateSlugAction(text: string, excludeProductId?: string) {
  try {
    const rawSlug = slugify(text);
    const uniqueSlug = await generateUniqueProductSlug(rawSlug, excludeProductId);
    return {
      success: true,
      rawSlug,
      uniqueSlug,
      isAvailable: rawSlug === uniqueSlug,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createProductAction(rawData: any) {
  try {
    const validated = productSchema.parse(rawData);
    const finalSlug = await generateUniqueProductSlug(validated.slug || validated.name);

    const created = await prisma.product.create({
      data: {
        name: validated.name,
        slug: finalSlug,
        sku: validated.sku,
        brandId: validated.brandId,
        categoryId: validated.categoryId,
        basePrice: validated.basePrice,
        salePrice: validated.salePrice || null,
        stock: validated.stock,
        condition: validated.condition,
        origin: validated.origin,
        warrantyMonths: validated.warrantyMonths,
        isQuoteOnly: validated.isQuoteOnly,
        isFeatured: validated.isFeatured,
        mainImage: validated.mainImage,
        gallery: JSON.stringify(validated.gallery),
        shortDesc: validated.shortDesc,
        fullDesc: validated.fullDesc,
        highlights: JSON.stringify(validated.highlights),
        standardPackage: JSON.stringify(validated.standardPackage),
        specs: validated.specs ? {
          create: {
            categoryType: validated.specs.categoryType || 'GNSS_RTK',
            channels: validated.specs.channels ? parseInt(validated.specs.channels) : null,
            constellations: validated.specs.constellations || null,
            horizontalAccuracy: validated.specs.horizontalAccuracy || null,
            verticalAccuracy: validated.specs.verticalAccuracy || null,
            tiltCompensation: validated.specs.tiltCompensation || null,
            uhfPower: validated.specs.uhfPower || null,
            batteryLifeHours: validated.specs.batteryLifeHours ? parseFloat(validated.specs.batteryLifeHours) : null,
            weightKg: validated.specs.weightKg ? parseFloat(validated.specs.weightKg) : null,
            ingressProtection: validated.specs.ingressProtection || null,
            angularAccuracy: validated.specs.angularAccuracy || null,
            reflectorlessRange: validated.specs.reflectorlessRange || null,
            prismRange: validated.specs.prismRange || null,
            edmSpeed: validated.specs.edmSpeed || null,
            magnification: validated.specs.magnification || null,
            stdDevPerKm: validated.specs.stdDevPerKm || null,
            rawSpecs: JSON.stringify(validated.specs.customSpecs || {}),
          },
        } : undefined,
        downloads: validated.downloads && validated.downloads.length > 0 ? {
          create: validated.downloads.map((d) => ({
            title: d.title,
            docType: d.docType,
            fileUrl: d.fileUrl,
            fileSize: d.fileSize || '2.5 MB',
          })),
        } : undefined,
      },
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true, product: created };
  } catch (error: any) {
    console.error('Error creating product:', error);
    return { success: false, error: error.message || 'Không thể tạo thiết bị mới.' };
  }
}

export async function updateProductAction(id: string, rawData: any) {
  try {
    const validated = productSchema.parse(rawData);
    const finalSlug = await generateUniqueProductSlug(validated.slug || validated.name, id);

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: validated.name,
        slug: finalSlug,
        sku: validated.sku,
        brandId: validated.brandId,
        categoryId: validated.categoryId,
        basePrice: validated.basePrice,
        salePrice: validated.salePrice || null,
        stock: validated.stock,
        condition: validated.condition,
        origin: validated.origin,
        warrantyMonths: validated.warrantyMonths,
        isQuoteOnly: validated.isQuoteOnly,
        isFeatured: validated.isFeatured,
        mainImage: validated.mainImage,
        gallery: JSON.stringify(validated.gallery),
        shortDesc: validated.shortDesc,
        fullDesc: validated.fullDesc,
        highlights: JSON.stringify(validated.highlights),
        standardPackage: JSON.stringify(validated.standardPackage),
      },
    });

    if (validated.specs) {
      await prisma.productSpec.upsert({
        where: { productId: id },
        update: {
          categoryType: validated.specs.categoryType || 'GNSS_RTK',
          channels: validated.specs.channels ? parseInt(validated.specs.channels) : null,
          constellations: validated.specs.constellations || null,
          horizontalAccuracy: validated.specs.horizontalAccuracy || null,
          verticalAccuracy: validated.specs.verticalAccuracy || null,
          tiltCompensation: validated.specs.tiltCompensation || null,
          uhfPower: validated.specs.uhfPower || null,
          batteryLifeHours: validated.specs.batteryLifeHours ? parseFloat(validated.specs.batteryLifeHours) : null,
          weightKg: validated.specs.weightKg ? parseFloat(validated.specs.weightKg) : null,
          ingressProtection: validated.specs.ingressProtection || null,
          angularAccuracy: validated.specs.angularAccuracy || null,
          reflectorlessRange: validated.specs.reflectorlessRange || null,
          prismRange: validated.specs.prismRange || null,
          edmSpeed: validated.specs.edmSpeed || null,
          magnification: validated.specs.magnification || null,
          stdDevPerKm: validated.specs.stdDevPerKm || null,
          rawSpecs: JSON.stringify(validated.specs.customSpecs || {}),
        },
        create: {
          productId: id,
          categoryType: validated.specs.categoryType || 'GNSS_RTK',
          channels: validated.specs.channels ? parseInt(validated.specs.channels) : null,
          constellations: validated.specs.constellations || null,
          horizontalAccuracy: validated.specs.horizontalAccuracy || null,
          verticalAccuracy: validated.specs.verticalAccuracy || null,
          tiltCompensation: validated.specs.tiltCompensation || null,
          uhfPower: validated.specs.uhfPower || null,
          batteryLifeHours: validated.specs.batteryLifeHours ? parseFloat(validated.specs.batteryLifeHours) : null,
          weightKg: validated.specs.weightKg ? parseFloat(validated.specs.weightKg) : null,
          ingressProtection: validated.specs.ingressProtection || null,
          angularAccuracy: validated.specs.angularAccuracy || null,
          reflectorlessRange: validated.specs.reflectorlessRange || null,
          prismRange: validated.specs.prismRange || null,
          edmSpeed: validated.specs.edmSpeed || null,
          magnification: validated.specs.magnification || null,
          stdDevPerKm: validated.specs.stdDevPerKm || null,
          rawSpecs: JSON.stringify(validated.specs.customSpecs || {}),
        },
      });
    }

    revalidatePath('/admin/products');
    revalidatePath(`/products/${validated.slug}`);
    revalidatePath('/products');
    return { success: true, product: updated };
  } catch (error: any) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message || 'Cập nhật thất bại.' };
  }
}

export async function deleteProductAction(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath('/admin/products');
    revalidatePath('/products');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Không thể xóa thiết bị này.' };
  }
}

export async function toggleProductQuoteOnlyAction(id: string, currentVal: boolean) {
  try {
    await prisma.product.update({
      where: { id },
      data: { isQuoteOnly: !currentVal },
    });
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
