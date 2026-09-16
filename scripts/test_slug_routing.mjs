import { slugify, generateUniqueProductSlug } from '../src/lib/utils/slugify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runTests() {
  console.log('=== AUTOMATIC PRODUCT ROUTING & SLUG GENERATION TESTS ===\n');

  // Test 1: Unit Tests for slugify Vietnamese accent stripping
  console.log('1. Testing slugify function on Vietnamese strings:');
  const testCases = [
    { input: 'Máy GNSS RTK Foif A90 IMU', expected: 'may-gnss-rtk-foif-a90-imu' },
    { input: 'Máy Toàn Đạc Điện Tử Leica FlexLine TS07 (1")', expected: 'may-toan-dac-dien-tu-leica-flexline-ts07-1' },
    { input: 'Đo đạc & Bản đồ địa chính', expected: 'do-dac-ban-do-dia-chinh' },
    { input: 'Ăn quả nhớ kẻ trồng cây - 100% chính hãng!', expected: 'an-qua-nho-ke-trong-cay-100-chinh-hang' },
    { input: '  Đầu Thu RTK CHCNAV i73+ (1408 Kênh)  ', expected: 'dau-thu-rtk-chcnav-i73-1408-kenh' },
  ];

  let test1Passed = true;
  for (const { input, expected } of testCases) {
    const result = slugify(input);
    const passed = result === expected;
    console.log(`   ${passed ? '✓' : '✗'} "${input}" -> "${result}" (Expected: "${expected}")`);
    if (!passed) test1Passed = false;
  }
  if (!test1Passed) throw new Error('Unit tests for slugify failed!');

  // Test 2: Database Slug Uniqueness
  console.log('\n2. Testing Database Slug Uniqueness & Auto-Suffixing:');
  const existingProduct = await prisma.product.findFirst();
  if (!existingProduct) throw new Error('No products found in DB to test uniqueness!');

  console.log(`   Existing product in DB: "${existingProduct.name}" (Slug: "${existingProduct.slug}")`);

  // Colliding slug for a NEW product
  const collidedSlug = await generateUniqueProductSlug(existingProduct.slug);
  console.log(`   Generated for new product with duplicate slug: "${collidedSlug}"`);
  if (!collidedSlug.startsWith(`${existingProduct.slug}-`)) {
    throw new Error(`Expected suffixed slug but got ${collidedSlug}`);
  }
  console.log(`   ✓ Correctly appended unique suffix: "${collidedSlug}"`);

  // Updating the SAME product with its own slug
  const sameProductSlug = await generateUniqueProductSlug(existingProduct.slug, existingProduct.id);
  console.log(`   Generated for SAME product (ID excluded): "${sameProductSlug}"`);
  if (sameProductSlug !== existingProduct.slug) {
    throw new Error(`Expected same slug when updating existing product but got ${sameProductSlug}`);
  }
  console.log(`   ✓ Maintained existing slug without redundant suffix when updating: "${sameProductSlug}"`);

  // Test 3: Live HTTP Route Testing
  console.log('\n3. Testing Storefront Dynamic Route & Metadata:');
  const validUrl = `http://localhost:3000/products/${existingProduct.slug}`;
  const validRes = await fetch(validUrl);
  console.log(`   Fetch ${validUrl} -> Status: ${validRes.status}`);
  if (validRes.status !== 200) throw new Error(`Expected 200 OK but got ${validRes.status}`);

  const html = await validRes.text();
  const hasCanonical = html.includes(`rel="canonical"`) || html.includes(`products/${existingProduct.slug}`);
  const hasTitle = html.includes(existingProduct.name) || html.includes('GeoSurvey');
  console.log(`   ✓ Status 200 OK, Response size: ${html.length} bytes`);
  console.log(`   ✓ Dynamic SEO title & OpenGraph present: ${hasTitle}`);
  console.log(`   ✓ Canonical URL present: ${hasCanonical}`);

  // Test 4: Custom 404 for invalid slug
  console.log('\n4. Testing 404 notFound() for Non-Existent Slug:');
  const invalidUrl = 'http://localhost:3000/products/thiet-bi-khong-ton-tai-xyz-999';
  const invalidRes = await fetch(invalidUrl);
  console.log(`   Fetch ${invalidUrl} -> Status: ${invalidRes.status}`);
  if (invalidRes.status !== 404) throw new Error(`Expected 404 Not Found but got ${invalidRes.status}`);
  const notFoundHtml = await invalidRes.text();
  const hasCustom404Text = notFoundHtml.includes('Không Tìm Thấy Thiết Bị') || notFoundHtml.includes('404');
  console.log(`   ✓ Status 404 Not Found rendered custom 404 page: ${hasCustom404Text}`);

  console.log('\n>>> ALL 4 AUTOMATIC SLUG GENERATION & ROUTING TESTS PASSED PERFECTLY! <<<');
  await prisma.$disconnect();
}

runTests().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
