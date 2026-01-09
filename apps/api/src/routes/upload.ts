import { FastifyInstance } from 'fastify';
import { z } from 'zod';

export async function uploadRoutes(app: FastifyInstance) {

    // Presigned URL (AWS S3)
    app.post(
        '/presigned',
        {
            onRequest: [app.authenticate],
            schema: {
                body: z.object({
                    filename: z.string(),
                    contentType: z.string(),
                }),
            },
        },
        async (request, reply) => {
            const { filename, contentType } = request.body as any;

            // Check if AWS credentials are provided
            if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION || !process.env.AWS_BUCKET_NAME) {
                request.log.warn('AWS Credentials missing, falling back to mock response');
                const key = `uploads/mock/${Date.now()}-${filename}`;
                return {
                    url: `https://mock-s3-bucket.s3.amazonaws.com/${key}`,
                    key,
                    mock: true
                };
            }

            try {
                const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
                const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');

                const client = new S3Client({
                    region: process.env.AWS_REGION,
                    credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                    },
                });

                const key = `uploads/${Date.now()}-${filename}`;
                const command = new PutObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: key,
                    ContentType: contentType,
                });

                const url = await getSignedUrl(client, command, { expiresIn: 3600 });

                return {
                    url,
                    key,
                };
            } catch (error) {
                request.log.error(error);
                reply.status(500).send({ message: 'Failed to generate upload URL' });
            }
        }
    );
}
