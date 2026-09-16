import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_SETTINGS = {
  id: 'default_settings',
  siteName: 'GeoSurvey Pro',
  slogan: 'Thiết Bị Trắc Địa & Đo Đạc Chính Hãng Toàn Quốc',
  metaDescription:
    'Hệ thống phân phối máy định vị GNSS RTK 1408 kênh, máy toàn đạc điện tử, máy thủy bình tự động chính hãng Leica, Trimble, Topcon, CHCNAV tại Việt Nam. Kiểm định Vilas 110, hỗ trợ đo thử thực địa 63 tỉnh thành.',
  lightLogoUrl: null,
  darkLogoUrl: null,
  faviconUrl: null,

  announcementActive: true,
  announcementMessage:
    'Miễn phí hiệu chuẩn & cấp tem kiểm định Vilas 110 cho toàn bộ thiết bị đo đạc bàn giao trong tháng!',
  announcementButtonText: 'Đăng Ký Kiểm Định',
  announcementButtonUrl: '/quote',

  headerMenuJson: JSON.stringify([
    { id: 'm-home', label: 'Trang Chủ', url: '/' },
    {
      id: 'm-rtk',
      label: 'Máy GNSS RTK',
      url: '/products?category=may-dinh-vi-gnss-rtk',
      isDropdown: true,
      subItems: [
        { label: 'RTK 1408 Kênh Bù Nghiêng IMU', url: '/products?category=may-dinh-vi-gnss-rtk' },
        { label: 'Trạm Base RTK Công Suất Lớn', url: '/products?category=may-dinh-vi-gnss-rtk' },
      ],
    },
    {
      id: 'm-ts',
      label: 'Máy Toàn Đạc',
      url: '/products?category=may-toan-dac-dien-tu',
      isDropdown: true,
      subItems: [
        { label: 'Độ Chính Xác Góc 1"', url: '/products?category=may-toan-dac-dien-tu' },
        { label: 'Độ Chính Xác Góc 2"', url: '/products?category=may-toan-dac-dien-tu' },
      ],
    },
    { id: 'm-level', label: 'Máy Thủy Bình', url: '/products?category=may-thuy-binh-tu-dong' },
    { id: 'm-acc', label: 'Phụ Kiện Trắc Địa', url: '/products?category=phu-kien-trac-dia' },
    { id: 'm-quote', label: 'Báo Giá Dự Án', url: '/quote' },
  ]),

  hotlineLabel: 'Hotline Kỹ Thuật 24/7',
  hotlineNumber: '0988.355.688',
  quoteButtonText: 'Báo Giá Dự Án (VAT)',
  quoteButtonUrl: '/quote',

  legalBusinessName: 'CÔNG TY CỔ PHẦN CÔNG NGHỆ TRẮC ĐỊA GEOPRO VIỆT NAM',
  taxCode: '0109887766',
  businessLicense: 'GPĐKKD số 0109887766 do Sở KH&ĐT TP.Hà Nội cấp ngày 15/03/2018',
  primaryEmail: 'contact@geopro.vn',
  salesHotline: '0988.355.688',
  technicalSupportHotline: '1900 8299',
  zaloNumber: '0988.355.688',

  showroomsJson: JSON.stringify([
    {
      id: 'sr-hn',
      branchName: 'Trụ sở chính & Trung tâm Kiểm định Hà Nội',
      address: 'Tòa nhà Geopro Tower, Số 68 Lê Văn Lương, P. Nhân Chính, Q. Thanh Xuân, Hà Nội',
      phone: '0988.355.688',
      googleMapsUrl: 'https://maps.google.com/?q=Hanoi',
    },
    {
      id: 'sr-dn',
      branchName: 'Chi nhánh & Trạm kỹ thuật Miền Trung',
      address: 'Số 142 Nguyễn Tri Phương, P. Chính Gián, Q. Thanh Khê, TP. Đà Nẵng',
      phone: '0936.123.456',
      googleMapsUrl: 'https://maps.google.com/?q=Danang',
    },
    {
      id: 'sr-hcm',
      branchName: 'Chi nhánh & Trung tâm Bàn giao TP. Hồ Chí Minh',
      address: 'Số 285/12 đường Cách Mạng Tháng 8, Phường 12, Quận 10, TP. Hồ Chí Minh',
      phone: '0977.888.999',
      googleMapsUrl: 'https://maps.google.com/?q=Hochiminh',
    },
  ]),

  aboutText:
    'GeoSurvey Pro là đơn vị tiên phong cung cấp giải pháp đo đạc địa chính, trắc địa công trình và định vị vệ tinh độ chính xác cao hàng đầu Việt Nam. Đại lý ủy quyền chính thức của Leica Geosystems, Trimble, CHCNAV, Topcon.',

  footerColumnsJson: JSON.stringify([
    {
      title: 'Dịch Vụ & Kỹ Thuật',
      links: [
        { label: 'Hiệu chuẩn & Kiểm định Vilas 110', url: '/quote' },
        { label: 'Cho thuê máy RTK & Toàn đạc', url: '/quote' },
        { label: 'Đo thử thiết bị thực địa 63 tỉnh', url: '/products' },
        { label: 'Chuyển giao công nghệ bay quét UAV LiDAR', url: '/products' },
      ],
    },
    {
      title: 'Chính Sách Khách Hàng',
      links: [
        { label: 'Chính sách bảo hành 24 tháng', url: '/products' },
        { label: 'Cấp máy đo thay thế khi bảo dưỡng', url: '/products' },
        { label: 'Hóa đơn điện tử VAT & Hồ sơ dự thầu', url: '/quote' },
        { label: 'Chính sách vận chuyển hỏa tốc công trình', url: '/products' },
      ],
    },
    {
      title: 'Về GeoSurvey Pro',
      links: [
        { label: 'Năng lực hồ sơ pháp lý công ty', url: '/products' },
        { label: 'Đối tác chiến lược & Khách hàng dự án', url: '/products' },
        { label: 'Cẩm nang kỹ thuật trắc địa 2026', url: '/admin/content' },
        { label: 'Liên hệ hợp tác đại lý phân phối', url: '/quote' },
      ],
    },
  ]),

  trustBadgesJson: JSON.stringify([
    {
      title: 'Đã Thông Báo Bộ Công Thương',
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=300&q=80',
      linkUrl: 'http://online.gov.vn',
    },
    {
      title: 'Chứng Nhận Vilas 110',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=300&q=80',
    },
  ]),

  socialFacebook: 'https://facebook.com/geopro.survey',
  socialZalo: 'https://zalo.me/0988355688',
  socialYoutube: 'https://youtube.com/@geoprosurvey',
  socialLinkedin: 'https://linkedin.com/company/geopro-survey',
  copyrightText: '© 2026 GEOPRO VIETNAM JSC. Tất cả quyền được bảo lưu. Giấy phép xuất bản số 24/GP-TTĐT.',
};

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: 'default_settings' },
    create: DEFAULT_SETTINGS,
    update: DEFAULT_SETTINGS,
  });
  console.log('✔ Site settings successfully restored to professional Geodetic defaults in database!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
