import React, { useState } from 'react';
import ThreeSixtyViewer from '../components/ThreeSixtyViewer';
import RelatedBlogs from '../components/RelatedBlogs';

const Home: React.FC = () => {
    const [currentImage, setCurrentImage] = useState('/images/360/village.jpg');

    const scenes = [
        { id: 1, name: 'Village View', url: '/images/360/village.jpg' },
        { id: 2, name: 'City Center', url: '/images/360/city.jpg' },
        { id: 3, name: 'Indoor Tour', url: '/images/360/indoor.jpg' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Hero Section */}
            <section className="relative h-[500px] flex items-center justify-center bg-gradient-to-r from-blue-900 to-indigo-800 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
                        Explore the World in 360°
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-gray-200 mb-8">
                        Immersive virtual tours and stories from around the globe.
                    </p>
                    <button className="bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-lg">
                        Start Exploring
                    </button>
                </div>
            </section>

            {/* 360 Viewer Section */}
            <section className="py-20 px-4 max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8">
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Immersive Gallery</h2>
                        <p className="text-gray-600">Experience our featured locations in full 360 degrees.</p>
                    </div>

                    <ThreeSixtyViewer imageUrl={currentImage} />

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {scenes.map((scene) => (
                            <button
                                key={scene.id}
                                onClick={() => setCurrentImage(scene.url)}
                                className={`group relative h - 24 rounded - xl overflow - hidden shadow - sm transition - all duration - 300 hover: shadow - md ${currentImage === scene.url
                                        ? 'ring-4 ring-blue-500 ring-offset-2'
                                        : 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-1'
                                    } `}
                            >
                                <div className={`absolute inset - 0 bg - black / 40 group - hover: bg - black / 20 transition - colors ${currentImage === scene.url ? 'bg-black/0' : ''
                                    } `} />
                                {/* Placeholder since we don't have separate thumbnails yet, using colored div or generic icons could work, but text is fine */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg drop-shadow-md">{scene.name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Related Blogs Section */}
            <section className="bg-gray-50 border-t border-gray-200">
                <RelatedBlogs />
            </section>

            {/* Footer (Simple placeholder) */}
            <footer className="bg-gray-800 text-white py-8 text-center">
                <p>&copy; 2026 Blog Platform. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
