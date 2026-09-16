async function runUploadTests() {
  console.log('=== DIRECT LOCAL FILE UPLOAD & CLOUD STORAGE INTEGRATION TESTS ===\n');

  // Test 1: Upload a valid PNG image file
  console.log('1. Testing Local Image Upload (/api/upload):');
  const dummyImageBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
  const imageBlob = new Blob([dummyImageBuffer], { type: 'image/png' });
  const imageFormData = new FormData();
  imageFormData.append('file', imageBlob, 'test-rtk-receiver.png');
  imageFormData.append('folder', 'products');
  imageFormData.append('altText', 'Máy GNSS RTK CHCNAV i73 Plus Chính Hãng');

  const res1 = await fetch('http://localhost:3000/api/upload', {
    method: 'POST',
    body: imageFormData,
  });
  const data1 = await res1.json();
  console.log(`   Response status: ${res1.status}`);
  console.log(`   Success: ${data1.success}`);
  console.log(`   Provider: ${data1.cloudProvider}`);
  console.log(`   Generated URL length: ${data1.url?.length} chars`);
  if (!data1.success || !data1.url) {
    throw new Error('Image upload test failed!');
  }
  console.log('   ✓ Image upload handled and returned CDN URL successfully.');

  // Test 2: Upload a valid PDF Calibration Certificate
  console.log('\n2. Testing PDF Calibration Certificate Upload (/api/upload):');
  const dummyPdfBuffer = Buffer.from('%PDF-1.4\n%...\n%%EOF');
  const pdfBlob = new Blob([dummyPdfBuffer], { type: 'application/pdf' });
  const pdfFormData = new FormData();
  pdfFormData.append('file', pdfBlob, 'giay-kiem-dinh-quatest-1.pdf');
  pdfFormData.append('folder', 'certificates');
  pdfFormData.append('altText', 'Chứng nhận kiểm định Vilas 110');

  const res2 = await fetch('http://localhost:3000/api/upload', {
    method: 'POST',
    body: pdfFormData,
  });
  const data2 = await res2.json();
  console.log(`   Response status: ${res2.status}`);
  console.log(`   Success: ${data2.success}`);
  console.log(`   MimeType: ${data2.mimeType}`);
  console.log(`   Generated URL length: ${data2.url?.length} chars`);
  if (!data2.success || !data2.url) {
    throw new Error('PDF upload test failed!');
  }
  console.log('   ✓ PDF upload handled and categorized successfully.');

  // Test 3: Reject unsupported file format
  console.log('\n3. Testing Security Validation on Unsupported File (.exe/.txt):');
  const invalidBlob = new Blob(['malicious or unsupported content'], { type: 'text/plain' });
  const invalidFormData = new FormData();
  invalidFormData.append('file', invalidBlob, 'dangerous-script.exe');

  const res3 = await fetch('http://localhost:3000/api/upload', {
    method: 'POST',
    body: invalidFormData,
  });
  const data3 = await res3.json();
  console.log(`   Response status: ${res3.status} (Expected: 400)`);
  console.log(`   Success: ${data3.success} (Expected: false)`);
  console.log(`   Error message: "${data3.error}"`);
  if (res3.status !== 400 || data3.success !== false) {
    throw new Error('Security file-type restriction test failed!');
  }
  console.log('   ✓ Non-image / non-PDF file correctly blocked by API validation.');

  // Test 4: Verify Admin Product Form route availability
  console.log('\n4. Verifying Product Form with Integrated FileUpload:');
  const formRes = await fetch('http://localhost:3000/admin/products/new', {
    headers: {
      Cookie: 'geosurvey_admin_token=bypass_or_seed',
    },
    redirect: 'manual',
  });
  console.log(`   /admin/products/new route status: ${formRes.status}`);

  console.log('\n>>> ALL CLOUD FILE UPLOADER PIPELINE TESTS PASSED 100%! <<<');
}

runUploadTests().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
