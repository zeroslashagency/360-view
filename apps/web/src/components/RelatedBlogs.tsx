import React from 'react';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    image: string;
    slug: string;
}

const RelatedBlogs: React.FC = () => {
    // Mock data for now
    const relatedPosts: BlogPost[] = [
        {
            id: '1',
            title: 'The Future of Web Development',
            excerpt: 'Exploring the latest trends in React and Node.js.',
            image: 'https://via.placeholder.com/400x200',
            slug: 'future-web-dev',
        },
        {
            id: '2',
            title: 'Optimizing Performance',
            excerpt: 'Tips and tricks to make your apps fly.',
            image: 'https://via.placeholder.com/400x200',
            slug: 'optimizing-performance',
        },
        {
            id: '3',
            title: 'Design Systems 101',
            excerpt: 'Building consistent and scalable UIs.',
            image: 'https://via.placeholder.com/400x200',
            slug: 'design-systems',
        },
    ];

    return (
        <div className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Related Blogs</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {relatedPosts.map((post) => (
                        <div key={post.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
                            <div className="flex-shrink-0">
                                <img className="h-48 w-full object-cover" src={post.image} alt={post.title} />
                            </div>
                            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                                <div className="flex-1">
                                    <a href={`/posts/${post.slug}`} className="block mt-2">
                                        <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                                        <p className="mt-3 text-base text-gray-500">{post.excerpt}</p>
                                    </a>
                                </div>
                                <div className="mt-6 flex items-center">
                                    <span className="text-indigo-600 hover:text-indigo-500 cursor-pointer font-medium">Read more &rarr;</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RelatedBlogs;
