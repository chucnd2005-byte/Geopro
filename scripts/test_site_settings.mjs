import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runTests() {
  console.log('--- TEST 1: Querying Default / Initial Settings ---');
  
  // Test upserting a new customized setting to simulate Admin save
  const customMessage = 'TEST_ANNOUNCEMENT: Khuyến mãi mừng khai trương showroom Đà Nẵng';
  const customHotline = '0999.888.777';
  const customLegalName = 'CÔNG TY CỔ PHẦN CÔNG NGHỆ TRẮC ĐỊA GEOPRO TOÀN CẦU';
  
  const customMenu = [
    { id: 'm-home', label: 'Trang Chủ', url: '/' },
    {
      id: 'm-rtk',
      label: 'Máy GNSS RTK Chuyên Dụng',
      url: '/products?category=may-dinh-vi-gnss-rtk',
      isDropdown: true,
      subItems: [
        { label: 'RTK 1408 Kênh Siêu Nhạy', url: '/products?category=may-dinh-vi-gnss-rtk' },
      ],
    },
    { id: 'm-quote', label: 'Dự Toán Báo Giá', url: '/quote' },
  ];

  const customShowrooms = [
    {
      id: 'sr-hn-test',
      branchName: 'Trung Tâm Đo Đạc & Kiểm Định Hà Nội (TEST)',
      address: 'Số 99 Lê Văn Lương, Cầu Giấy, Hà Nội',
      phone: '0999.888.777',
      googleMapsUrl: 'https://maps.google.com/?q=TestHanoi',
    },
  ];

  const customFooterColumns = [
    {
      title: 'Hỗ Trợ Đo Đạc Thực Địa',
      links: [
        { label: 'Hiệu chuẩn Quatest', url: '/quote' },
        { label: 'Cho thuê máy RTK', url: '/products' },
      ],
    },
    {
      title: 'Về Chúng Tôi',
      links: [
        { label: 'Giới thiệu năng lực', url: '/products' },
      ],
    },
    {
      title: 'Chính Sách & Pháp Lý',
      links: [
        { label: 'Bảo hành 24 tháng', url: '/products' },
      ],
    },
  ];

  const customBadges = [
    {
      title: 'Đã Thông Báo Bộ Công Thương (Bộ CT)',
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=300&q=80',
      linkUrl: 'http://online.gov.vn',
    },
  ];

  console.log('Upserting custom settings into Prisma dev.db...');
  const upserted = await prisma.siteSettings.upsert({
    where: { id: 'default_settings' },
    create: {
      id: 'default_settings',
      siteName: 'GeoSurvey Pro Ultra',
      slogan: 'Công Nghệ Đo Đạc Định Vị Vệ Tinh Số 1',
      metaDescription: 'Hệ thống thiết bị đo đạc trắc địa số 1 Việt Nam',
      announcementActive: true,
      announcementMessage: customMessage,
      announcementButtonText: 'Xem Ngay',
      announcementButtonUrl: '/quote',
      hotlineLabel: 'Hotline Dự Án',
      hotlineNumber: customHotline,
      quoteButtonText: 'Báo Giá Dự Án (VAT)',
      quoteButtonUrl: '/quote',
      legalBusinessName: customLegalName,
      taxCode: '0109999888',
      businessLicense: 'GPĐKKD số 0109999888 do Sở KH&ĐT cấp',
      primaryEmail: 'contact@geopro-ultra.vn',
      salesHotline: customHotline,
      technicalSupportHotline: '1900 9999',
      zaloNumber: customHotline,
      aboutText: 'Đơn vị phân phối và kiểm định thiết bị đo đạc hàng đầu.',
      copyrightText: '© 2026 GEOPRO ULTRA JSC. Tất cả quyền được bảo lưu.',
      headerMenuJson: JSON.stringify(customMenu),
      showroomsJson: JSON.stringify(customShowrooms),
      footerColumnsJson: JSON.stringify(customFooterColumns),
      trustBadgesJson: JSON.stringify(customBadges),
      socialFacebook: 'https://facebook.com/geopro',
      socialZalo: 'https://zalo.me/0999888777',
    },
    update: {
      siteName: 'GeoSurvey Pro Ultra',
      slogan: 'Công Nghệ Đo Đạc Định Vị Vệ Tinh Số 1',
      announcementActive: true,
      announcementMessage: customMessage,
      hotlineNumber: customHotline,
      legalBusinessName: customLegalName,
      headerMenuJson: JSON.stringify(customMenu),
      showroomsJson: JSON.stringify(customShowrooms),
      footerColumnsJson: JSON.stringify(customFooterColumns),
      trustBadgesJson: JSON.stringify(customBadges),
    },
  });

  console.log('✔ Upsert successful! Site Name:', upserted.siteName);
  console.log('Announcement Message in DB:', upserted.announcementMessage);
  console.log('Hotline in DB:', upserted.hotlineNumber);

  console.log('\n--- TEST 2: Parsing & Validating JSON Fields ---');
  const parsedMenu = JSON.parse(upserted.headerMenuJson);
  const parsedShowrooms = JSON.parse(upserted.showroomsJson);
  const parsedFooterCols = JSON.parse(upserted.footerColumnsJson);
  const parsedBadges = JSON.parse(upserted.trustBadgesJson);

  if (parsedMenu.length === 3 && parsedMenu[1].subItems.length === 1) {
    console.log('✔ Menu items parsed correctly with sub-items dropdowns.');
  } else {
    throw new Error('Menu JSON deserialization failed');
  }

  if (parsedShowrooms.length === 1 && parsedShowrooms[0].phone === customHotline) {
    console.log('✔ Showrooms parsed correctly.');
  } else {
    throw new Error('Showrooms JSON deserialization failed');
  }

  if (parsedFooterCols.length === 3) {
    console.log('✔ Footer columns parsed correctly.');
  } else {
    throw new Error('Footer columns JSON deserialization failed');
  }

  if (parsedBadges.length === 1 && parsedBadges[0].title.includes('Bộ Công Thương')) {
    console.log('✔ Trust badges parsed correctly.');
  } else {
    throw new Error('Trust badges JSON deserialization failed');
  }

  console.log('\nAll direct database persistence and serialization tests PASSED successfully!');
}

runTests()
  .catch((err) => {
    console.error('Test failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
