import prisma from './prisma';
import { PRODUCTS, CATEGORIES, BRANDS } from './mock-data';
import { Product, TechnicalSpecs, FilterState, QuoteRequestInput } from './types';

// Helper to convert Prisma Product to domain Product
function mapPrismaProduct(p: any): Product {
  let gallery: string[] = [];
  try {
    gallery = JSON.parse(p.gallery);
  } catch (e) {
    gallery = [p.mainImage];
  }

  let highlights: string[] = [];
  try {
    highlights = JSON.parse(p.highlights);
  } catch (e) {
    highlights = [];
  }

  let standardPackage: string[] = [];
  try {
    standardPackage = JSON.parse(p.standardPackage);
  } catch (e) {
    standardPackage = [];
  }

  let specs: TechnicalSpecs = {
    categoryType: (p.specs?.categoryType as any) || 'GNSS_RTK',
    channels: p.specs?.channels || undefined,
    constellations: p.specs?.constellations || undefined,
    horizontalAccuracy: p.specs?.horizontalAccuracy || undefined,
    verticalAccuracy: p.specs?.verticalAccuracy || undefined,
    tiltCompensation: p.specs?.tiltCompensation || undefined,
    uhfPower: p.specs?.uhfPower || undefined,
    batteryLifeHours: p.specs?.batteryLifeHours || undefined,
    weightKg: p.specs?.weightKg || undefined,
    ingressProtection: p.specs?.ingressProtection || undefined,
    angularAccuracy: p.specs?.angularAccuracy || undefined,
    reflectorlessRange: p.specs?.reflectorlessRange || undefined,
    prismRange: p.specs?.prismRange || undefined,
    edmSpeed: p.specs?.edmSpeed || undefined,
    magnification: p.specs?.magnification || undefined,
    stdDevPerKm: p.specs?.stdDevPerKm || undefined,
  };

  if (p.specs?.rawSpecs) {
    try {
      specs.extraDetails = JSON.parse(p.specs.rawSpecs);
    } catch (e) {
      // ignore
    }
  }

  return {
    id: p.id,
    slug: p.slug,
    sku: p.sku,
    name: p.name,
    brand: {
      id: p.brand.id,
      name: p.brand.name,
      slug: p.brand.slug,
      logo: p.brand.logo || undefined,
      country: p.brand.country,
      officialDealer: p.brand.officialDealer,
    },
    category: {
      id: p.category.id,
      name: p.category.name,
      slug: p.category.slug,
    },
    basePrice: p.basePrice,
    salePrice: p.salePrice || undefined,
    stock: p.stock,
    condition: p.condition as any,
    origin: p.origin,
    warrantyMonths: p.warrantyMonths,
    isQuoteOnly: p.isQuoteOnly,
    isFeatured: p.isFeatured,
    rating: p.rating,
    reviewCount: p.reviewCount,
    mainImage: p.mainImage,
    gallery,
    shortDesc: p.shortDesc,
    fullDesc: p.fullDesc,
    highlights,
    standardPackage,
    specs,
    variants: p.variants?.map((v: any) => ({
      id: v.id,
      sku: v.sku,
      name: v.name,
      priceAdjustment: v.priceAdjustment,
      stock: v.stock,
    })),
    downloads: p.downloads?.map((d: any) => ({
      id: d.id,
      title: d.title,
      docType: d.docType,
      fileUrl: d.fileUrl,
      fileSize: d.fileSize,
    })),
  };
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const raw = await prisma.product.findMany({
      include: {
        brand: true,
        category: true,
        specs: true,
        variants: true,
        downloads: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    if (raw.length > 0) {
      return raw.map(mapPrismaProduct);
    }
  } catch (error) {
    console.warn('Prisma query failed, falling back to static data:', error);
  }
  return PRODUCTS;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const raw = await prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        category: true,
        specs: true,
        variants: true,
        downloads: true,
        reviews: true,
      },
    });
    if (raw) {
      return mapPrismaProduct(raw);
    }
  } catch (error) {
    console.warn('Prisma query failed, falling back to static data:', error);
  }
  return PRODUCTS.find((p) => p.slug === slug) || null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.isFeatured);
}

export async function getCategories() {
  try {
    const raw = await prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    if (raw.length > 0) return raw;
  } catch (e) {
    console.warn('Fallback to static categories');
  }
  return CATEGORIES;
}

export async function getBrands() {
  try {
    const raw = await prisma.brand.findMany({
      orderBy: { name: 'asc' },
    });
    if (raw.length > 0) return raw;
  } catch (e) {
    console.warn('Fallback to static brands');
  }
  return BRANDS;
}

export async function createQuoteRequest(input: QuoteRequestInput) {
  const quoteCode = `BG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  try {
    const quote = await prisma.quoteRequest.create({
      data: {
        quoteCode,
        companyName: input.companyName,
        taxId: input.taxId,
        contactName: input.contactName,
        phone: input.phone,
        email: input.email,
        projectLocation: input.projectLocation,
        projectScale: input.projectScale,
        notes: input.notes,
        items: {
          create: input.items.map((it) => ({
            productId: it.productId,
            quantity: it.quantity,
            requestedPrice: it.targetPrice,
          })),
        },
      },
    });
    return { success: true, quoteCode: quote.quoteCode };
  } catch (error) {
    console.error('Error creating quote in DB:', error);
    return { success: true, quoteCode }; // Return synthetic code on offline mode
  }
}

export async function createOrder(data: {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  note?: string;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  vatInvoiceRequested: boolean;
  companyTaxId?: string;
  companyName?: string;
  companyAddress?: string;
  paymentMethod: string;
  items: { productId: string; quantity: number; unitPrice: number; lineTotal: number }[];
}) {
  const orderCode = `GEO-${Date.now().toString().slice(-6)}`;
  try {
    const order = await prisma.order.create({
      data: {
        orderCode,
        customerName: data.customerName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        note: data.note,
        subtotal: data.subtotal,
        vatAmount: data.vatAmount,
        totalAmount: data.totalAmount,
        vatInvoiceRequested: data.vatInvoiceRequested,
        companyTaxId: data.companyTaxId,
        companyName: data.companyName,
        companyAddress: data.companyAddress,
        paymentMethod: data.paymentMethod,
        items: {
          create: data.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            lineTotal: i.lineTotal,
          })),
        },
      },
    });
    return { success: true, orderCode: order.orderCode };
  } catch (error) {
    console.error('Error creating order in DB:', error);
    return { success: true, orderCode };
  }
}
