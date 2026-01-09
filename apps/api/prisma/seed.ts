import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    const relevantPosts = [
        {
            title: 'Discovering the Hidden Village',
            content: `The village tour takes you through a serene journey of rustic landscapes and traditional architecture. 
            
Experience the calm atmosphere, walk through the narrow cobblestone streets, and witness the daily life of the locals. 
This tour captures the essence of rural beauty, preserved through time.`,
            image: 'https://blog-platform-uploads-007528838226.s3.amazonaws.com/tours/village.jpg',
            published: true,
        },
        {
            title: 'Urban Exploration: City Center',
            content: `Dive into the heart of the metropolis with our City Center tour. 
            
From towering skyscrapers to bustling market squares, this 360-degree experience lets you feel the pulse of the city. 
Explore the modern infrastructure blended with historical landmarks.`,
            image: 'https://blog-platform-uploads-007528838226.s3.amazonaws.com/tours/city.jpg',
            published: true,
        },
        {
            title: 'Architectural Wonders: Indoor Tour',
            content: `Step inside and marvel at the intricate designs of our featured indoor locations.
            
This tour highlights the play of light and shadow, the texture of materials, and the thoughtful spatial planning that makes these interiors a masterpiece of design.`,
            image: 'https://blog-platform-uploads-007528838226.s3.amazonaws.com/tours/indoor.jpg',
            published: true,
        },
    ];

    // Create a default admin user if not exists
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            password: 'hashed_password_placeholder', // In real app, hash this
            role: 'ADMIN',
        },
    });

    for (const post of relevantPosts) {
        const slug = slugify(post.title, { lower: true, strict: true });
        await prisma.post.upsert({
            where: { slug: slug },
            update: {
                content: post.content,
                image: post.image,
                published: post.published,
            },
            create: {
                title: post.title,
                content: post.content,
                slug: slug,
                image: post.image,
                published: post.published,
                authorId: admin.id,
            },
        });
        console.log(`Upserted post: ${post.title}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
