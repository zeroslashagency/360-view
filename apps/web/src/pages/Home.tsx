
import React, { useState } from 'react';
import TourOverlay from '../components/TourOverlay';

const Home: React.FC = () => {
    // State to track active tour scene (null = lobby)
    const [activeScene, setActiveScene] = useState<{ id: number; name: string; url: string; cover: string } | null>(null);

    const scenes = [
        { id: 1, name: 'Village View', url: '/images/360/village.jpg', cover: '/images/360/village.jpg' },
        { id: 2, name: 'City Center', url: '/images/360/city.jpg', cover: '/images/360/city.jpg' },
        { id: 3, name: 'Indoor Tour', url: '/images/360/indoor.jpg', cover: '/images/360/indoor.jpg' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {activeScene ? (
                <TourOverlay scene={activeScene} onExit={() => setActiveScene(null)} />
            ) : (
                <>
                    {/* Hero Section */}
                    <section className="relative h-[400px] flex items-center justify-center bg-gradient-to-r from-gray-900 to-slate-800 text-white overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
                                Virtual Asset Tours
                            </h1>
                            <p className="text-lg md:text-xl font-light text-gray-300 mb-8">
                                Select a location below to begin your immersive experience.
                            </p>
                        </div>
                    </section>

                    {/* Lobby / Cover Cards Section */}
                    <section className="py-20 px-4 max-w-7xl mx-auto -mt-24 relative z-20">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {scenes.map((scene) => (
                                <div
                                    key={scene.id}
                                    className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group border border-gray-100"
                                    onClick={() => setActiveScene(scene)}
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={scene.cover}
                                            alt={scene.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="bg-white/90 text-gray-900 px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                                Enter Tour
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{scene.name}</h3>
                                        <p className="text-gray-500 text-sm">Interactive 360° Panorama</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="bg-gray-800 text-white py-8 text-center mt-12">
                        <p>&copy; 2026 Blog Platform. All rights reserved.</p>
                    </footer>
                </>
            )}
        </div>
    );
};

export default Home;

