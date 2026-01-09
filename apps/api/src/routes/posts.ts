import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import slugify from 'slugify';

export async function postRoutes(app: FastifyInstance) {

    // Public List
    app.get('/', async (request, reply) => {
        const { page = 1, limit = 10 } = request.query as { page?: number; limit?: number };
        const skip = (Number(page) - 1) * Number(limit);

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where: { published: true },
                include: { author: { select: { email: true, id: true } } },
                orderBy: { createdAt: 'desc' },
                skip,
                take: Number(limit),
            }),
            prisma.post.count({ where: { published: true } }),
        ]);

        return {
            data: posts,
            meta: {
                total,
                page: Number(page),
                last_page: Math.ceil(total / Number(limit)),
            },
        };
    });

    // Single Post
    app.get('/:slug', async (request, reply) => {
        const { slug } = request.params as { slug: string };
        const post = await prisma.post.findUnique({
            where: { slug },
            include: { author: { select: { email: true, id: true } } },
        });

        if (!post) {
            return reply.status(404).send({ message: 'Post not found' });
        }
        return post;
    });

    // Create Post (Admin)
    app.post(
        '/',
        {
            onRequest: [app.authenticate],
            schema: {
                body: z.object({
                    title: z.string(),
                    content: z.string(),
                    published: z.boolean().optional(),
                    image: z.string().optional(),
                }),
            },
        },
        async (request, reply) => {
            // TODO: Check for ADMIN role
            const { title, content, published, image } = request.body as any;
            const user = request.user;

            const slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now();

            const post = await prisma.post.create({
                data: {
                    title,
                    content,
                    published: published || false,
                    image,
                    slug,
                    authorId: user.id,
                },
            });

            return reply.status(201).send(post);
        }
    );
}
