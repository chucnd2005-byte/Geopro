import { PrismaClient } from '@prisma/client';
import { BRANDS, CATEGORIES, PRODUCTS } from '../src/lib/mock-data';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Geodetic Database Seeding ---');

  // 1. Seed Categories
  for (let i = 0; i < CATEGORIES.length; i++) {
    const cat = CATEGORIES[i];
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, icon: cat.icon, displayOrder: i },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        displayOrder: i,
      },
    });
  }
  console.log(`Seeded ${CATEGORIES.length} geodetic categories.`);

  // 2. Seed Brands
  for (const b of BRANDS) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name, country: b.country, officialDealer: b.officialDealer },
      create: {
        id: b.id,
        name: b.name,
        slug: b.slug,
        country: b.country,
        officialDealer: b.officialDealer,
      },
    });
  }
  console.log(`Seeded ${BRANDS.length} geodetic brands.`);

  // 3. Seed Products with Specs, Downloads, Variants
  for (const p of PRODUCTS) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        sku: p.sku,
        name: p.name,
        basePrice: p.basePrice,
        salePrice: p.salePrice,
        stock: p.stock,
        condition: p.condition,
        origin: p.origin,
        warrantyMonths: p.warrantyMonths,
        isQuoteOnly: p.isQuoteOnly,
        isFeatured: p.isFeatured,
        rating: p.rating,
        reviewCount: p.reviewCount,
        mainImage: p.mainImage,
        gallery: JSON.stringify(p.gallery),
        shortDesc: p.shortDesc,
        fullDesc: p.fullDesc,
        highlights: JSON.stringify(p.highlights),
        standardPackage: JSON.stringify(p.standardPackage),
      },
      create: {
        id: p.id,
        slug: p.slug,
        sku: p.sku,
        name: p.name,
        brandId: p.brand.id,
        categoryId: p.category.id,
        basePrice: p.basePrice,
        salePrice: p.salePrice,
        stock: p.stock,
        condition: p.condition,
        origin: p.origin,
        warrantyMonths: p.warrantyMonths,
        isQuoteOnly: p.isQuoteOnly,
        isFeatured: p.isFeatured,
        rating: p.rating,
        reviewCount: p.reviewCount,
        mainImage: p.mainImage,
        gallery: JSON.stringify(p.gallery),
        shortDesc: p.shortDesc,
        fullDesc: p.fullDesc,
        highlights: JSON.stringify(p.highlights),
        standardPackage: JSON.stringify(p.standardPackage),
      },
    });

    // Seed Specs
    if (p.specs) {
      await prisma.productSpec.upsert({
        where: { productId: product.id },
        update: {
          categoryType: p.specs.categoryType,
          channels: p.specs.channels,
          constellations: p.specs.constellations,
          horizontalAccuracy: p.specs.horizontalAccuracy,
          verticalAccuracy: p.specs.verticalAccuracy,
          tiltCompensation: p.specs.tiltCompensation,
          uhfPower: p.specs.uhfPower,
          batteryLifeHours: p.specs.batteryLifeHours,
          weightKg: p.specs.weightKg,
          ingressProtection: p.specs.ingressProtection,
          angularAccuracy: p.specs.angularAccuracy,
          reflectorlessRange: p.specs.reflectorlessRange,
          prismRange: p.specs.prismRange,
          edmSpeed: p.specs.edmSpeed,
          magnification: p.specs.magnification,
          stdDevPerKm: p.specs.stdDevPerKm,
          rawSpecs: JSON.stringify(p.specs.extraDetails || {}),
        },
        create: {
          productId: product.id,
          categoryType: p.specs.categoryType,
          channels: p.specs.channels,
          constellations: p.specs.constellations,
          horizontalAccuracy: p.specs.horizontalAccuracy,
          verticalAccuracy: p.specs.verticalAccuracy,
          tiltCompensation: p.specs.tiltCompensation,
          uhfPower: p.specs.uhfPower,
          batteryLifeHours: p.specs.batteryLifeHours,
          weightKg: p.specs.weightKg,
          ingressProtection: p.specs.ingressProtection,
          angularAccuracy: p.specs.angularAccuracy,
          reflectorlessRange: p.specs.reflectorlessRange,
          prismRange: p.specs.prismRange,
          edmSpeed: p.specs.edmSpeed,
          magnification: p.specs.magnification,
          stdDevPerKm: p.specs.stdDevPerKm,
          rawSpecs: JSON.stringify(p.specs.extraDetails || {}),
        },
      });
    }

    // Seed Variants
    if (p.variants && p.variants.length > 0) {
      for (const v of p.variants) {
        await prisma.productVariant.upsert({
          where: { sku: v.sku },
          update: { name: v.name, priceAdjustment: v.priceAdjustment, stock: v.stock },
          create: {
            id: v.id,
            productId: product.id,
            sku: v.sku,
            name: v.name,
            priceAdjustment: v.priceAdjustment,
            stock: v.stock,
          },
        });
      }
    }

    // Seed Downloads
    if (p.downloads && p.downloads.length > 0) {
      for (const d of p.downloads) {
        const existingDownload = await prisma.technicalDownload.findFirst({
          where: { productId: product.id, title: d.title },
        });
        if (!existingDownload) {
          await prisma.technicalDownload.create({
            data: {
              productId: product.id,
              title: d.title,
              docType: d.docType,
              fileUrl: d.fileUrl,
              fileSize: d.fileSize,
            },
          });
        }
      }
    }

    // Seed Sample Reviews
    const reviewCount = await prisma.review.count({ where: { productId: product.id } });
    if (reviewCount === 0) {
      await prisma.review.create({
        data: {
          productId: product.id,
          authorName: 'KS. Nguyễn Thành Long',
          companyName: 'Công ty CP Khảo sát Địa kỹ thuật Hà Nội',
          rating: 5,
          title: 'Độ chính xác cao, bắt vệ tinh cực nhanh dưới tán cây',
          comment: 'Đã đem máy đi đo thực địa tại công trình đường đèo Tây Bắc. Tín hiệu RTK Fixed rất ổn định, tính năng bù nghiêng IMU giải phóng hoàn toàn thời gian căn chỉnh bọt thủy. Cực kỳ hài lòng!',
          verifiedBuyer: true,
          helpfulCount: 12,
        },
      });
    }
  }

  console.log(`Seeded ${PRODUCTS.length} geodetic products with complete specs and downloads.`);
  console.log('--- Geodetic Database Seeding Complete ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
