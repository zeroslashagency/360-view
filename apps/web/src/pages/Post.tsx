import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
    id: string;
    title: string;
    content: string;
    image?: string;
    createdAt: string;
}

const Post: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // Fetching from the API (direct to EC2)
                const response = await fetch(`http://100.26.140.48:3000/api/posts/${slug}`);
                if (!response.ok) {
                    if (response.status === 404) throw new Error('Post not found');
                    throw new Error('Failed to fetch post');
                }
                const data = await response.json();

                // If content is a URL (e.g. from S3), fetch the actual markdown text
                if (data.content && (data.content.startsWith('http://') || data.content.startsWith('https://'))) {
                    try {
                        const contentResponse = await fetch(data.content);
                        if (contentResponse.ok) {
                            data.content = await contentResponse.text();
                        } else {
                            console.warn("Failed to fetch remote content, showing URL instead.");
                        }
                    } catch (fetchErr) {
                        console.error("Error fetching remote blog content:", fetchErr);
                    }
                }

                setPost(data);
            } catch (err) {
                console.error("Error fetching blog post:", err);
                setError('Failed to load the story.');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPost();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Story Not Found</h1>
                <p className="text-gray-600 mb-8">{error || "The requested article could not be found."}</p>
                <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2">
                    &larr; Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
            {/* Hero Image */}
            <div className="relative h-[400px] md:h-[500px] w-full bg-gray-900 overflow-hidden">
                <img
                    src={post.image || 'https://images.unsplash.com/photo-1499750310159-5b5f8e47afcd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'}
                    alt={post.title}
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 max-w-4xl mx-auto">
                    <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg leading-tight">
                        {post.title}
                    </h1>
                    <p className="text-white/80 text-lg">
                        {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* Content */}
            <article className="max-w-4xl mx-auto px-6 py-16 md:py-24 animate-fade-in relative">
                <div className="prose prose-lg md:prose-xl prose-slate mx-auto leading-relaxed tracking-tight text-gray-800">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
            </article>

            {/* Footer Navigation */}
            <div className="max-w-4xl mx-auto px-6 pt-8 border-t border-gray-100 flex justify-between items-center">
                <Link to="/" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
                    &larr; More Stories
                </Link>
            </div>
        </div>
    );
};

export default Post;
