import { spawn } from 'child_process';
import http from 'http';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function main() {
  console.log('Starting Next.js dev server on port 3005 to test dynamic SSR...');
  const server = spawn('C:\\Program Files\\nodejs\\node.exe', ['node_modules/next/dist/bin/next', 'dev', '-p', '3005'], {
    cwd: 'd:\\Code web',
    env: { ...process.env, PORT: '3005' },
    stdio: 'pipe',
  });

  server.stdout.on('data', (d) => console.log(`[Next.js]: ${d.toString().trim()}`));
  server.stderr.on('data', (d) => console.error(`[Next.js Err]: ${d.toString().trim()}`));

  // Wait for dev server to boot
  console.log('Waiting for dev server to start...');
  let ready = false;
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    try {
      const res = await fetchUrl('http://localhost:3005/');
      if (res.status === 200) {
        ready = true;
        break;
      }
    } catch (e) {
      // not ready yet
    }
  }

  if (!ready) {
    server.kill();
    throw new Error('Dev server failed to start within 30s');
  }

  console.log('✔ Server is ready. Fetching Storefront HTML...');
  const homeRes = await fetchUrl('http://localhost:3005/');
  console.log(`Home status: ${homeRes.status}`);

  const hasAnnouncement = homeRes.body.includes('TEST_ANNOUNCEMENT');
  const hasHotline = homeRes.body.includes('0999.888.777');
  const hasLegal = homeRes.body.includes('GEOPRO TOÀN CẦU');
  const hasShowroom = homeRes.body.includes('Hà Nội (TEST)');

  console.log('Checking dynamic DB injections in Storefront HTML:');
  console.log('  - Has Dynamic Announcement:', hasAnnouncement);
  console.log('  - Has Dynamic Hotline:', hasHotline);
  console.log('  - Has Dynamic Legal Business Name:', hasLegal);
  console.log('  - Has Dynamic Showroom Branch:', hasShowroom);

  // Kill server
  server.kill('SIGKILL');
  console.log('Dev server stopped.');

  if (!hasAnnouncement || !hasHotline || !hasLegal || !hasShowroom) {
    throw new Error('Dynamic settings were not properly injected into Storefront HTML!');
  }

  console.log('\n🎉 ALL STOREFRONT DYNAMIC CMS TESTS PASSED SUCCESSFULLY!');
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
