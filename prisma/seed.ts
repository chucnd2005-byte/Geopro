import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { BRANDS, CATEGORIES, PRODUCTS } from '../src/lib/mock-data';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Database Seeding ---');

  // 1. Seed Admin User
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('12345678Ab@', salt);

  const adminUser = await prisma.adminUser.upsert({
    where: { email: 'chucnd2005@gmail.com' },
    update: {
      passwordHash,
      username: 'chucnd2005',
      email: 'chucnd2005@gmail.com',
      name: 'Kỹ sư Quản trị Trắc địa (Admin)',
      role: 'ADMIN',
    },
    create: {
      username: 'chucnd2005',
      email: 'chucnd2005@gmail.com',
      passwordHash,
      name: 'Kỹ sư Quản trị Trắc địa (Admin)',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    },
  });
  await prisma.adminUser.deleteMany({
    where: {
      email: 'admin@geopro.vn',
      id: { not: adminUser.id },
    },
  });
  console.log('Seeded default admin user: chucnd2005@gmail.com / 12345678Ab@');

  // 2. Seed Categories
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

  // 3. Seed Brands
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

  // 4. Seed Products with Specs, Downloads, Variants
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
  }

  // 5. Seed Sample Media Items
  const sampleMedias = [
    {
      filename: 'chcnav-i73-pocket.webp',
      originalName: 'CHCNAV i73+ Pocket GNSS RTK 1408 channels.webp',
      url: 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=800&q=80',
      mimeType: 'image/webp',
      size: 345200,
      folder: 'products',
      altText: 'Máy Định Vị GNSS RTK CHCNAV i73+ 1408 kênh bù nghiêng IMU 60 độ',
    },
    {
      filename: 'leica-gs18t-flagship.webp',
      originalName: 'Leica GS18 T GNSS Smart Antenna.webp',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      mimeType: 'image/webp',
      size: 512000,
      folder: 'products',
      altText: 'Máy GNSS RTK Leica GS18 T Thụy Sĩ bù nghiêng không cần bọt thủy',
    },
    {
      filename: 'quatest1-calibration-cert.pdf',
      originalName: 'Chung_Nhan_Kiem_Dinh_Hieu_Chuan_Quatest1_2026.pdf',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      mimeType: 'application/pdf',
      size: 1480000,
      folder: 'catalogs',
      altText: 'Giấy chứng nhận hiệu chuẩn kiểm định Quatest 1 Vilas 110 đo lường máy trắc địa',
    },
    {
      filename: 'banner-promo-rtk-2026.webp',
      originalName: 'Banner Chien Dich Thu Cu Doi Moi RTK.webp',
      url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      mimeType: 'image/webp',
      size: 780000,
      folder: 'banners',
      altText: 'Chương trình trợ giá thu cũ đổi mới máy định vị RTK lên 1408 kênh',
    },
  ];

  for (const m of sampleMedias) {
    const existing = await prisma.media.findFirst({ where: { filename: m.filename } });
    if (!existing) {
      await prisma.media.create({ data: m });
    }
  }
  console.log('Seeded sample media items.');

  // 6. Seed Sample Banners
  const sampleBanners = [
    {
      title: 'Chiến Dịch Trợ Giá Thu Cũ Đổi Mới RTK 1408 Kênh',
      subtitle: 'Thu hồi máy định vị cũ mọi hãng, trợ giá lên tới 15.000.000 ₫ khi nâng cấp i73+ hoặc GS18 T',
      imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      targetUrl: '/products?category=may-dinh-vi-gnss-rtk',
      badge: 'CHƯƠNG TRÌNH DỰ ÁN 2026',
      displayOrder: 1,
      isActive: true,
    },
    {
      title: 'Tặng Trọn Bộ Sổ Tay Android & Tài Khoản CORS Quốc Gia',
      subtitle: 'Áp dụng cho tất cả khách hàng ký hợp đồng mua bộ máy GNSS RTK trong tháng này',
      imageUrl: 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=1200&q=80',
      targetUrl: '/quote',
      badge: 'MIỄN PHÍ TRỌN ĐỜI',
      displayOrder: 2,
      isActive: true,
    },
  ];

  for (const b of sampleBanners) {
    const existing = await prisma.banner.findFirst({ where: { title: b.title } });
    if (!existing) {
      await prisma.banner.create({ data: b });
    }
  }
  console.log('Seeded sample promotional banners.');

  // 7. Seed Sample Articles (Knowledge / Blog CMS)
  const sampleArticles = [
    {
      slug: 'kinh-nghiem-do-rtk-duoi-tan-cay-rung-va-khe-nui',
      title: 'Kinh Nghiệm Đo GNSS RTK Fixed Nhanh Dưới Tán Cây Rậm & Hẻm Núi',
      category: 'Kinh nghiệm thực địa',
      coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      excerpt: 'Chia sẻ các thủ thuật thiết lập góc mở vệ tinh Elevation Mask, tối ưu tần số kênh BeiDou-3 và ứng dụng cảm biến bù nghiêng IMU 60 độ để đo điểm góc khuất.',
      content: `<h2>1. Bản chất suy hao tín hiệu GNSS trong môi trường che khuất</h2>
<p>Khi đo đạc trong rừng cao su, rừng thông hoặc các tuyến đèo dốc hiểm trở, tín hiệu từ các vệ tinh có góc ngẩng thấp thường bị phản xạ đa đường dẫn (Multipath) hoặc hấp thụ bởi tán lá ướt. Điều này khiến máy khó giải nghiệm số nguyên vòng sóng (Ambiguity Resolution) để đạt trạng thái RTK Fixed.</p>
<h2>2. Ba cấu hình then chốt trên phần mềm LandStar / Captivate</h2>
<ul>
  <li><strong>Điều chỉnh Elevation Cutoff Angle:</strong> Thiết lập góc giới hạn vệ tinh từ 10° lên 15° để loại bỏ hoàn toàn các vệ tinh ở đường chân trời có tỷ lệ nhiễu cao.</li>
  <li><strong>Kích hoạt đầy đủ chòm BeiDou-3 (B1C, B2a, B2b):</strong> Tăng cường số lượng vệ tinh khóa trên đỉnh đầu từ 35 lên hơn 50 vệ tinh đồng thời.</li>
  <li><strong>Tận dụng IMU Tilt Sensor:</strong> Nghiêng sào đo ra ngoài khoảng hở của tán cây trong khi đầu mũi sào vẫn đặt chính xác tại tâm cọc mốc địa chính.</li>
</ul>`,
      author: 'KS. Nguyễn Thành Long',
      tags: JSON.stringify(['RTK', 'Bù nghiêng IMU', 'Kinh nghiệm đo đạc', 'Trắc địa rừng núi']),
      isPublished: true,
      seoTitle: 'Kinh Nghiệm Đo GNSS RTK Dưới Tán Cây Rậm | GeoSurvey Pro',
      seoDesc: 'Hướng dẫn cấu hình trạm đo RTK bắt sóng khỏe dưới tán cây, khắc phục mất Fixed và mẹo sử dụng IMU bù nghiêng.',
      views: 1240,
    },
    {
      slug: 'so-sanh-do-chinh-xac-may-toan-dac-1-giay-va-2-giay',
      title: 'Phân Biệt Sai Số Máy Toàn Đạc 1" và 2" Trong Thi Công Cầu Đường & Nhà Cao Tầng',
      category: 'Kỹ thuật trắc địa',
      coverImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      excerpt: 'Phân tích tiêu chuẩn kiểm định ISO 17123-3 và hướng dẫn lựa chọn máy toàn đạc phù hợp với yêu cầu nghiệm thu của Ban Quản lý dự án.',
      content: `<h2>1. Định nghĩa độ chính xác đo góc theo ISO 17123-3</h2>
<p>Sai số 1" (1 giây góc) tương đương với độ lệch chỉ 0.48mm ở cự ly 100 mét, trong khi máy 2" có độ lệch gần 1.0mm. Đối với công tác trắc địa công trình cao tầng trên 30 tầng hoặc kết cấu cầu dây văng nhịp lớn, tư vấn giám sát quốc tế luôn quy định bắt buộc phải dùng máy 1" như Leica TS07 1" hoặc Topcon GM-52.</p>`,
      author: 'ThS. Lê Hoàng Tuấn',
      tags: JSON.stringify(['Máy toàn đạc', 'Leica TS07', 'Tiêu chuẩn ISO', 'Quan trắc']),
      isPublished: true,
      seoTitle: 'So Sánh Máy Toàn Đạc 1 Giây và 2 Giây | GeoSurvey Pro',
      seoDesc: 'Khi nào cần dùng máy toàn đạc 1" và 2"? Tìm hiểu chi tiết tiêu chuẩn kỹ thuật phục vụ nghiệm thu.',
      views: 890,
    },
  ];

  for (const art of sampleArticles) {
    await prisma.article.upsert({
      where: { slug: art.slug },
      update: art,
      create: art,
    });
  }
  console.log('Seeded sample technical articles.');

  // 8. Seed Sample Quote Requests
  const existingQuotes = await prisma.quoteRequest.count();
  if (existingQuotes === 0) {
    await prisma.quoteRequest.create({
      data: {
        quoteCode: 'BG-2026-8812',
        companyName: 'Công ty CP Khảo sát & Xây dựng Giao thông Miền Bắc',
        taxId: '0108892341',
        contactName: 'KS. Trần Văn Nam',
        phone: '0988.355.688',
        email: 'nam.tran@khaosatgiaothong.vn',
        projectLocation: 'Tuyến đường cao tốc Tuyên Quang - Hà Giang',
        projectScale: 'Khảo sát bình đồ tuyến 45km địa hình đồi núi đá',
        notes: 'Yêu cầu kiểm định Quatest 1 và hỗ trợ kỹ sư đo thử tại thực địa trước khi bàn giao.',
        status: 'PENDING',
        items: {
          create: [
            {
              productId: PRODUCTS[1].id, // CHCNAV i73+
              quantity: 2,
              requestedPrice: 65000000,
            },
          ],
        },
      },
    });

    await prisma.quoteRequest.create({
      data: {
        quoteCode: 'BG-2026-7734',
        companyName: 'Viện Quy Hoạch & Thiết Kế Đô Thị Hà Nội',
        taxId: '0102345678',
        contactName: 'ThS. Nguyễn Hoàng Long',
        phone: '0912.456.789',
        email: 'long.nh@vqh-hanoi.gov.vn',
        projectLocation: 'Khu đô thị vệ tinh Hòa Lạc',
        projectScale: 'Đo vẽ bản đồ địa chính tỷ lệ 1/500 diện tích 300ha',
        notes: 'Cần xuất hóa đơn VAT điện tử ngay trong tháng.',
        status: 'QUOTED',
        items: {
          create: [
            {
              productId: PRODUCTS[0].id, // Leica GS18 T
              quantity: 1,
              requestedPrice: 280000000,
            },
          ],
        },
      },
    });
    console.log('Seeded sample B2B quotes.');
  }

  // 9. Seed Sample Orders
  const existingOrders = await prisma.order.count();
  if (existingOrders === 0) {
    await prisma.order.create({
      data: {
        orderCode: 'ORD-2026-9012',
        customerName: 'Kỹ sư Vũ Minh Quang',
        phone: '0977.888.999',
        email: 'quang.vu@surveying.vn',
        address: 'Số 45 Lê Văn Lương, Trung Hòa',
        city: 'Hà Nội',
        note: 'Cần dán tem kiểm định hiệu chuẩn mới nhất trước khi giao hàng.',
        subtotal: 5400000,
        vatAmount: 540000,
        totalAmount: 5940000,
        vatInvoiceRequested: true,
        companyTaxId: '0109988112',
        companyName: 'Công ty TNHH Đo đạc Bản đồ Thăng Long',
        companyAddress: 'Tầng 4, Tòa Viglacera, Cầu Giấy, Hà Nội',
        paymentMethod: 'BANK_TRANSFER',
        status: 'PROCESSING',
        items: {
          create: [
            {
              productId: PRODUCTS[6].id, // Sokkia B40A
              quantity: 1,
              unitPrice: 5400000,
              lineTotal: 5400000,
            },
          ],
        },
      },
    });
    console.log('Seeded sample orders.');
  }

  console.log('--- Database Seeding Complete ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
