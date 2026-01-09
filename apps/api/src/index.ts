import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { authRoutes } from './routes/auth';
import { postRoutes } from './routes/posts';
import { uploadRoutes } from './routes/upload';


const server = Fastify({
    logger: true,
});

// Zod integration
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

// Register Plugins
server.register(cors, {
    origin: '*', // Change in production (e.g. env.FRONTEND_URL)
    credentials: true,
});

server.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecret',
});

server.register(cookie, {
    secret: process.env.JWT_SECRET || 'supersecret',
    hook: 'onRequest',
});

// Decorate authenticate
server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.send(err);
    }
});

// Register Routes
server.register(authRoutes, { prefix: '/api/auth' });
server.register(postRoutes, { prefix: '/api/posts' });
server.register(uploadRoutes, { prefix: '/api/upload' });


// Health check
server.get('/', async (request, reply) => {
    return { status: 'ok', message: 'Blog API is running' };
});

const start = async () => {
    try {
        await server.listen({ port: 3000, host: '0.0.0.0' });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();

