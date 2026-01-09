import { FastifyInstance } from 'fastify';
import { z } from 'zod';

export async function uploadRoutes(app: FastifyInstance) {

    // Presigned URL (Mock for now, would be S3 SDK in production)
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
            const { filename } = request.body as any;
            // In a real app, use @aws-sdk/client-s3 to generate a presigned PUT url
            const key = `uploads/${Date.now()}-${filename}`;

            return {
                url: `https://fake-s3-bucket.s3.amazonaws.com/${key}`, // Fake Upload URL
                key,
            };
        }
    );
}
