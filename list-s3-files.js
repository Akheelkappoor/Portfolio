const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

async function listFiles() {
  try {
    console.log('📂 Listing files in Portfolio/projects/...\n');

    const cmd = new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET,
      Prefix: 'Portfolio/projects/',
      MaxKeys: 10
    });

    const response = await s3.send(cmd);

    if (!response.Contents || response.Contents.length === 0) {
      console.log('❌ No files found in Portfolio/projects/');
      console.log('\n🔍 Checking if files exist in other paths...\n');

      const cmd2 = new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET,
        MaxKeys: 20
      });

      const response2 = await s3.send(cmd2);
      console.log('Files in bucket root:');
      response2.Contents?.forEach(obj => {
        console.log(`  - ${obj.Key}`);
      });
    } else {
      console.log(`Found ${response.Contents.length} files:\n`);
      response.Contents.forEach(obj => {
        console.log(`  ✓ ${obj.Key}`);
        console.log(`    Size: ${obj.Size} bytes`);
        console.log(`    Modified: ${obj.LastModified}`);
        console.log();
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listFiles();
