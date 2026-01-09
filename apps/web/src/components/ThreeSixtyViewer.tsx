import React, { useEffect, useRef } from 'react';
import 'pannellum/build/pannellum.css';
import 'pannellum';


interface Hotspot {
    pitch: number;
    yaw: number;
    type: 'info' | 'scene';
    text: string;
    URL?: string;
    sceneId?: string;
    cssClass?: string;
}

interface ThreeSixtyViewerProps {
    imageUrl?: string;
    hotspots?: Hotspot[];
    onSceneIdClick?: (id: number) => void;
}

const ThreeSixtyViewer: React.FC<ThreeSixtyViewerProps> = ({ imageUrl, hotspots = [], onSceneIdClick }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<any>(null);
    const image = imageUrl || '/images/360/pano.jpg';

    useEffect(() => {
        if (!containerRef.current) return;

        const pannellum = window.pannellum;

        if (!pannellum) {
            console.error("Pannellum library not loaded");
            return;
        }

        if (viewerRef.current) {
            try {
                viewerRef.current.destroy();
            } catch (e) {
                containerRef.current.innerHTML = '';
            }
        }

        viewerRef.current = pannellum.viewer(containerRef.current, {
            type: 'equirectangular',
            panorama: image,
            autoLoad: true,
            pitch: 10,
            yaw: 180,
            hfov: 110,
            showControls: true,
            hotSpots: hotspots.map(h => ({
                ...h,
                cssClass: h.cssClass || 'custom-hotspot',
                clickHandlerFunc: h.type === 'scene' && h.sceneId ? () => {
                    if (onSceneIdClick) onSceneIdClick(Number(h.sceneId));
                } : undefined,
                // If it has a click handler, we might want to disable default info behavior if needed
                // But Pannellum handles them separately usually.
            }))
        });

        // Helper to find coordinates
        const handleMouseDown = (event: MouseEvent) => {
            if (viewerRef.current && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const [pitch, yaw] = viewerRef.current.mouseEventToCoords({ clientX: x, clientY: y });
                console.log(`📍 Exact Hotspot Coordinates -> Pitch: ${pitch.toFixed(2)}, Yaw: ${yaw.toFixed(2)}`);
            }
        };

        containerRef.current.addEventListener('mousedown', handleMouseDown);

        return () => {
            if (containerRef.current) {
                containerRef.current.removeEventListener('mousedown', handleMouseDown);
            }
            if (viewerRef.current) {
                try {
                    viewerRef.current.destroy();
                } catch (e) { }
            }
        };
    }, [image, hotspots]);

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
