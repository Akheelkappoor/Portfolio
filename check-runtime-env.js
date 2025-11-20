// Quick check of what S3 URL function generates
const { publicS3Url } = require('./.next/server/chunks/ssr/lib_s3_ts.js');

console.log('\n🔍 Runtime Environment Check:\n');
console.log('process.env.S3_PUBLIC_BASE_URL:', process.env.S3_PUBLIC_BASE_URL);
console.log('\nTesting publicS3Url function:');
console.log('Input: "projects/test-uuid.png"');

try {
  const url = publicS3Url('projects/test-uuid.png');
  console.log('Output:', url);

  if (url.includes('/Portfolio/')) {
    console.log('\n❌ PROBLEM: URL contains /Portfolio/');
  } else {
    console.log('\n✅ CORRECT: URL does not contain /Portfolio/');
  }
} catch (error) {
  console.log('\n❌ Error calling function:', error.message);
  console.log('\nTrying direct require...');

  try {
    // Try to construct it manually
    const base = process.env.S3_PUBLIC_BASE_URL;
    const bucket = process.env.S3_BUCKET;
    const region = process.env.AWS_REGION;

    console.log('\nManual construction:');
    console.log('Base:', base);
    console.log('Bucket:', bucket);
    console.log('Region:', region);

    if (base) {
      const url = `${base.replace(/\/$/, '')}/projects/test-uuid.png`;
      console.log('Generated URL:', url);
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}
