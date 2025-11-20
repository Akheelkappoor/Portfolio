const {
  S3Client,
  GetPublicAccessBlockCommand,
  PutPublicAccessBlockCommand
} = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const bucketName = process.env.S3_BUCKET;

async function fixPublicAccess() {
  try {
    console.log(`🔍 Checking public access block settings for: ${bucketName}\n`);

    // Get current settings
    const getCmd = new GetPublicAccessBlockCommand({ Bucket: bucketName });
    const current = await s3.send(getCmd);

    console.log('📋 Current settings:');
    console.log(JSON.stringify(current.PublicAccessBlockConfiguration, null, 2));
    console.log();

    // Update to allow public access for our bucket policy
    const newConfig = {
      BlockPublicAcls: true,  // Keep this true for security
      IgnorePublicAcls: true,  // Keep this true for security
      BlockPublicPolicy: false,  // MUST be false to allow bucket policy
      RestrictPublicBuckets: false  // MUST be false to allow public reads
    };

    console.log('⚙️  Updating to new settings:');
    console.log(JSON.stringify(newConfig, null, 2));
    console.log();

    const putCmd = new PutPublicAccessBlockCommand({
      Bucket: bucketName,
      PublicAccessBlockConfiguration: newConfig
    });

    await s3.send(putCmd);

    console.log('✅ Public access block settings updated!');
    console.log('✅ Bucket policy can now work properly');
    console.log('\n⏳ Wait 10-30 seconds for changes to propagate, then test the image URL');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n💡 Manual Steps:');
    console.error('1. Go to AWS S3 Console');
    console.error(`2. Select bucket: ${bucketName}`);
    console.error('3. Go to "Permissions" tab');
    console.error('4. Click "Edit" under "Block public access"');
    console.error('5. Uncheck:');
    console.error('   - Block public access to buckets and objects granted through new public bucket or access point policies');
    console.error('   - Block public and cross-account access to buckets and objects through any public bucket or access point policies');
    console.error('6. Keep checked (for security):');
    console.error('   - Block public access to buckets and objects granted through new access control lists (ACLs)');
    console.error('   - Block public access to buckets and objects granted through any access control lists (ACLs)');
    process.exit(1);
  }
}

fixPublicAccess();
