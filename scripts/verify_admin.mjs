import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'geosurvey_admin_jwt_secret_2026_super_secure_key_12345'
);

async function generateToken() {
  return await new SignJWT({
    userId: 'admin-seed-01',
    username: 'admin',
    email: 'admin@geopro.vn',
    name: 'Tổng Quản Trị Hệ Thống',
    role: 'ADMIN',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

async function verifyRoutes() {
  const token = await generateToken();
  console.log('JWT Token generated successfully.');

  const routes = [
    { url: 'http://localhost:3000/', name: 'Storefront Homepage' },
    { url: 'http://localhost:3000/products/may-dinh-vi-gnss-rtk-chcnav-i73-plus', name: 'Product Detail Storefront' },
    { url: 'http://localhost:3000/admin/login', name: 'Admin Login' },
    { url: 'http://localhost:3000/admin/dashboard', name: 'Admin Dashboard', auth: true },
    { url: 'http://localhost:3000/admin/products', name: 'Admin Products CMS', auth: true },
    { url: 'http://localhost:3000/admin/products/new', name: 'Admin New Product Form', auth: true },
    { url: 'http://localhost:3000/admin/quotes', name: 'Admin B2B Quotes Pipeline', auth: true },
    { url: 'http://localhost:3000/admin/orders', name: 'Admin Orders Pipeline', auth: true },
    { url: 'http://localhost:3000/admin/media', name: 'Admin Media Asset Manager', auth: true },
    { url: 'http://localhost:3000/admin/content', name: 'Admin Content & SEO CMS', auth: true },
  ];

  let allSuccess = true;

  for (const r of routes) {
    const headers = {};
    if (r.auth) {
      headers['Cookie'] = `geosurvey_admin_token=${token}`;
    }

    try {
      const res = await fetch(r.url, { headers });
      console.log(`[${res.status === 200 ? 'SUCCESS' : 'STATUS ' + res.status}] ${r.name} -> ${r.url}`);
      if (res.status !== 200) {
        allSuccess = false;
      }
    } catch (err) {
      console.error(`[ERROR] ${r.name}: ${err.message}`);
      allSuccess = false;
    }
  }

  if (allSuccess) {
    console.log('\n>>> ALL 10 STOREFRONT & ADMIN ROUTES VERIFIED WITH STATUS 200 OK! <<<');
  } else {
    console.log('\n>>> SOME ROUTES FAILED VERIFICATION <<<');
    process.exit(1);
  }
}

verifyRoutes().catch((err) => {
  console.error(err);
  process.exit(1);
});
