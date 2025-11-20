const fs = require('fs');
const path = require('path');

// Create a simple test image (1x1 PNG)
const testImageBuffer = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
  0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
  0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
  0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
]);

async function testUpload() {
  try {
    console.log('🔍 Testing image upload functionality...\n');

    // First, login to get admin cookie
    console.log('1. Logging in as admin...');
    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'password'
      })
    });

    if (!loginRes.ok) {
      throw new Error(`Login failed: ${loginRes.status} ${loginRes.statusText}`);
    }

    const setCookie = loginRes.headers.get('set-cookie');
    console.log('✅ Login successful\n');

    // Create FormData with test project
    console.log('2. Creating test project with image...');
    const FormData = require('form-data');
    const formData = new FormData();

    formData.append('title', 'Test Project - Image Upload');
    formData.append('meta', 'Test • Upload Verification');
    formData.append('badge', 'TEST');
    formData.append('stack', 'Testing, Upload, S3');
    formData.append('category', 'test');
    formData.append('challenge', 'Verify image upload works correctly');
    formData.append('solution', 'Test the upload endpoint');
    formData.append('impact', 'Confirm S3 integration is working');
    formData.append('image', testImageBuffer, {
      filename: 'test-image.png',
      contentType: 'image/png'
    });

    // Upload the project
    const uploadRes = await fetch('http://localhost:3000/api/admin/projects-aws', {
      method: 'POST',
      headers: {
        'Cookie': setCookie || '',
        ...formData.getHeaders()
      },
      body: formData
    });

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok) {
      throw new Error(`Upload failed: ${uploadRes.status} - ${JSON.stringify(uploadData)}`);
    }

    console.log('✅ Project created successfully!');
    console.log('   Project ID:', uploadData.id);

    // Fetch the project to verify image URL
    console.log('\n3. Verifying uploaded image...');
    const projectRes = await fetch('http://localhost:3000/api/admin/projects-aws', {
      headers: { 'Cookie': setCookie || '' }
    });

    const projects = await projectRes.json();
    const testProject = projects.find(p => p.id === uploadData.id);

    if (testProject && testProject.imageUrl) {
      console.log('✅ Image URL generated:', testProject.imageUrl);

      // Test if image is accessible
      console.log('\n4. Testing image accessibility...');
      const imageRes = await fetch(testProject.imageUrl);

      if (imageRes.ok) {
        console.log('✅ Image is accessible!');
        console.log('   Status:', imageRes.status);
        console.log('   Content-Type:', imageRes.headers.get('content-type'));
      } else {
        console.log('⚠️  Image returned status:', imageRes.status);
        console.log('   This might be a bucket policy issue');
      }
    } else {
      console.log('⚠️  No image URL found in project');
    }

    console.log('\n✅ Upload test completed!');
    console.log('\n📝 Test project created. You can delete it from the admin panel.');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

testUpload();
