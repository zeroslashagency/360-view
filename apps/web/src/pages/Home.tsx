import React from 'react';
import ThreeSixtyViewer from '../components/ThreeSixtyViewer';
import RelatedBlogs from '../components/RelatedBlogs';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-indigo-700 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                        Explore Our World
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-100">
                        Dive into immersive experiences and insightful articles.
                    </p>
                </div>
            </section>

            {/* 360 Image Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-900">Immersive View</h2>
                        <p className="mt-4 text-lg text-gray-600">Experience the location in full 360 degrees.</p>
                    </div>
                    <ThreeSixtyViewer />
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
