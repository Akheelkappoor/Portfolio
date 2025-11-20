const { S3Client, PutBucketPolicyCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const bucketName = process.env.S3_BUCKET;

// Policy for ACTUAL path where files are stored
const bucketPolicy = {
  Version: "2012-10-17",
  Statement: [
    {
      Sid: "PublicReadGetObject",
      Effect: "Allow",
      Principal: "*",
      Action: "s3:GetObject",
      Resource: `arn:aws:s3:::${bucketName}/projects/*`  // Correct path!
    }
  ]
};

async function fixPolicy() {
  try {
    console.log(`🔧 Setting correct bucket policy for: ${bucketName}`);
    console.log(`📂 Path: projects/* (where files actually are)\n`);

    const putCmd = new PutBucketPolicyCommand({
      Bucket: bucketName,
      Policy: JSON.stringify(bucketPolicy)
    });

    await s3.send(putCmd);

    console.log('✅ Bucket policy updated with correct path!');
    console.log(JSON.stringify(bucketPolicy, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixPolicy();
