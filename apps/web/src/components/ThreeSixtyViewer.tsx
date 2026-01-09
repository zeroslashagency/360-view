import React, { useEffect, useRef } from 'react';
import 'pannellum/build/pannellum.css';
import 'pannellum';


interface ThreeSixtyViewerProps {
    imageUrl?: string;
}

const ThreeSixtyViewer: React.FC<ThreeSixtyViewerProps> = ({ imageUrl }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<any>(null);
    const image = imageUrl || '/images/360/pano.jpg';

    useEffect(() => {
        if (!containerRef.current) return;

        // Pannellum attaches to window
        const pannellum = window.pannellum;

        if (!pannellum) {
            console.error("Pannellum library not loaded");
            return;
        }

        if (viewerRef.current) {
            containerRef.current.innerHTML = '';
        }

        viewerRef.current = pannellum.viewer(containerRef.current, {
            type: 'equirectangular',
            panorama: image,
            autoLoad: true,
            pitch: 10,
            yaw: 180,
            hfov: 110,
            showControls: true
        });

        return () => {
            // Cleanup if API supported it
        };
    }, [image]);

    return (
        <div className="relative w-full h-full bg-gray-900 overflow-hidden shadow-xl">
            <div ref={containerRef} className="w-full h-full" />

            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-md text-white text-sm pointer-events-none z-10">
                360° View
            </div>
        </div>
    );
};

export default ThreeSixtyViewer;
