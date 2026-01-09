import React, { useEffect, useRef } from 'react';
import 'pannellum/build/pannellum.css';
// @ts-ignore
import { viewer } from 'pannellum';

interface ThreeSixtyViewerProps {
    imageUrl?: string;
}

const ThreeSixtyViewer: React.FC<ThreeSixtyViewerProps> = ({ imageUrl }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<any>(null);
    const image = imageUrl || '/images/360/pano.jpg';

    useEffect(() => {
        if (!containerRef.current) return;

        // Destroy existing viewer if any
        if (viewerRef.current) {
            // Pannellum doesn't have a clean destroy method exposed easily in all versions, 
            // but re-initializing on the same ID usually requires cleanup.
            // For simplicity in this wrapper, we just let it mount once or clear innerHTML.
            containerRef.current.innerHTML = '';
        }

        viewerRef.current = viewer(containerRef.current, {
            type: 'equirectangular',
            panorama: image,
            autoLoad: true,
            pitch: 10,
            yaw: 180,
            hfov: 110,
            showControls: true
        });

        return () => {
            // Cleanup if needed
        };
    }, [image]);

    return (
        <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden shadow-xl">
            <div ref={containerRef} className="w-full h-full" />

            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-md text-white text-sm pointer-events-none z-10">
                360° View
            </div>
        </div>
    );
};

export default ThreeSixtyViewer;
