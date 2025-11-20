const { S3Client, PutBucketPolicyCommand, GetBucketPolicyCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const bucketName = process.env.S3_BUCKET;

const bucketPolicy = {
  Version: "2012-10-17",
  Statement: [
    {
      Sid: "PublicReadGetObject",
      Effect: "Allow",
      Principal: "*",
      Action: "s3:GetObject",
      Resource: `arn:aws:s3:::${bucketName}/Portfolio/projects/*`
    }
  ]
};

async function fixPermissions() {
  try {
    console.log(`🔧 Setting public read policy for bucket: ${bucketName}`);
    console.log(`📂 Path: Portfolio/projects/*\n`);

    // Try to get existing policy first
    try {
      const getCmd = new GetBucketPolicyCommand({ Bucket: bucketName });
      const existing = await s3.send(getCmd);
      console.log('📋 Existing policy found:');
      console.log(existing.Policy);
      console.log('\n⚠️  Will replace with new policy...\n');
    } catch (err) {
      if (err.name === 'NoSuchBucketPolicy') {
        console.log('📋 No existing policy found. Creating new one...\n');
      }
    }

    const putCmd = new PutBucketPolicyCommand({
      Bucket: bucketName,
      Policy: JSON.stringify(bucketPolicy)
    });

    await s3.send(putCmd);

    console.log('✅ Bucket policy updated successfully!');
    console.log('\n📝 Applied Policy:');
    console.log(JSON.stringify(bucketPolicy, null, 2));
    console.log('\n✅ Your project images should now be publicly accessible!');

  } catch (error) {
    console.error('\n❌ Error updating bucket policy:', error.message);
    console.error('\n💡 Manual Steps Required:');
    console.error('1. Go to AWS S3 Console: https://s3.console.aws.amazon.com/');
    console.error(`2. Select bucket: ${bucketName}`);
    console.error('3. Go to "Permissions" tab');
    console.error('4. Scroll to "Bucket policy" and click "Edit"');
    console.error('5. Paste this policy:\n');
    console.error(JSON.stringify(bucketPolicy, null, 2));
    process.exit(1);
  }
}

fixPermissions();
