import React, { useEffect, useState } from 'react';

interface BlogPost {
    id: string;
    title: string;
    content: string;
    image?: string;
    slug: string;
    createdAt: string;
}

const RelatedBlogs: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Fetching from the API (direct to EC2)
                const response = await fetch('http://100.26.140.48:3000/api/posts?limit=3');
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                // The API returns { data: [], meta: {} }
                setPosts(data.data || []);
            } catch (err) {
                console.error("Error fetching blogs:", err);
                setError('Failed to load recent posts.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="py-12 bg-white flex justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || posts.length === 0) {
        // Fallback or empty state
        return null;
    }

    return (
        <div className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Recent Stories</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <div key={post.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 h-full border border-gray-100">
                            <div className="flex-shrink-0 bg-gray-200 h-48 relative overflow-hidden">
                                <img
                                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                    src={post.image || 'https://images.unsplash.com/photo-1499750310159-5b5f8e47afcd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'} // Nice placeholder
                                    alt={post.title}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499750310159-5b5f8e47afcd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
                                    }}
                                />
                            </div>
                            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-blue-600 mb-2">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                    <a href={`/posts/${post.slug}`} className="block">
                                        <p className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</p>
                                        <p className="mt-3 text-base text-gray-500 line-clamp-3">
                                            {post.content}
                                        </p>
                                    </a>
                                </div>
                                <div className="mt-6 flex items-center">
                                    <a href={`/posts/${post.slug}`} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 transition-colors">
                                        Read full story
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </a>
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
