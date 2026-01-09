import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { hashPassword, verifyPassword } from '../utils/hash';

export async function authRoutes(app: FastifyInstance) {

    // Register Route
    app.post(
        '/register',
        {
            schema: {
                body: z.object({
                    email: z.string().email(),
                    password: z.string().min(6),
                }),
            },
        },
        async (request, reply) => {
            const { email, password } = request.body as { email: string; password: string };

            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                return reply.status(400).send({ message: 'User already exists' });
            }

            const hashedPassword = await hashPassword(password);

            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                },
            });

            return reply.status(201).send({
                id: user.id,
                email: user.email,
            });
        }
    );

    // Login Route
    app.post(
        '/login',
        {
            schema: {
                body: z.object({
                    email: z.string().email(),
                    password: z.string(),
                }),
            },
        },
        async (request, reply) => {
            const { email, password } = request.body as { email: string; password: string };

            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                return reply.status(401).send({ message: 'Invalid credentials' });
            }

            const isValid = await verifyPassword(password, user.password);

            if (!isValid) {
                return reply.status(401).send({ message: 'Invalid credentials' });
            }

            // Generate JWT
            const token = app.jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                { expiresIn: '7d' }
            );

            // Set Cookie
            reply.setCookie('access_token', token, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            });

            return { token };
        }
    );

    // Logout Route
    app.post('/logout', async (request, reply) => {
        reply.clearCookie('access_token');
        return { message: 'Logged out' };
    });

    // Me Route (Verify Token)
    app.get('/me', {
        onRequest: [app.authenticate]
    }, async (request) => {
        return request.user;
    });
}
