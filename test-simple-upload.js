async function testSimpleUpload() {
  try {
    console.log('Testing simple project creation (no image)...\n');

    // Login
    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'password'
      })
    });

    const setCookie = loginRes.headers.get('set-cookie');
    console.log('✅ Logged in\n');

    // Try JSON body (no image)
    console.log('Testing JSON upload (no image)...');
    const jsonRes = await fetch('http://localhost:3000/api/admin/projects-aws', {
      method: 'POST',
      headers: {
        'Cookie': setCookie || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Test JSON Upload',
        meta: 'Test • No Image',
        badge: 'TEST',
        stack: ['Testing'],
        category: ['test'],
        challenge: ['Test without image'],
        solution: ['Use JSON body'],
        impact: ['Verify API works']
      })
    });

    const jsonData = await jsonRes.json();

    if (jsonRes.ok) {
      console.log('✅ JSON upload successful!');
      console.log('   Project ID:', jsonData.id);
    } else {
      console.log('❌ JSON upload failed:', jsonData);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSimpleUpload();
