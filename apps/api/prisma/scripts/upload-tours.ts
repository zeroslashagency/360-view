import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const bucketName = process.env.AWS_BUCKET_NAME!;
const sourceDir = join(process.cwd(), '../web/public/images/360');

async function uploadFiles() {
    console.log(`🚀 Starting upload from ${sourceDir} to s3://${bucketName}/tours/`);

    const files = readdirSync(sourceDir);

    for (const file of files) {
        if (!file.endsWith('.jpg')) continue;

        const filePath = join(sourceDir, file);
        const fileContent = readFileSync(filePath);

        console.log(`Uploading ${file}...`);

        await s3Client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: `tours/${file}`,
            Body: fileContent,
            ContentType: 'image/jpeg',
        }));

        console.log(`✅ Uploaded ${file}`);
    }

    console.log('🎉 All images uploaded successfully!');
}

uploadFiles().catch(err => {
    console.error('❌ Upload failed:', err);
    process.exit(1);
});
