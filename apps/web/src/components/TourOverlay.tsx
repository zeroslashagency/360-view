import React, { useState } from 'react';
import ThreeSixtyViewer from './ThreeSixtyViewer';
import {
    Home,
    Map,
    Image as ImageIcon,
    Phone,
    Maximize,
    Minimize,
    Share2,
    Camera,
    RotateCcw
} from 'lucide-react';

interface TourOverlayProps {
    scene: { id: number; name: string; url: string };
    onExit: () => void;
}

const TourOverlay: React.FC<TourOverlayProps> = ({ scene, onExit }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black text-white font-sans">
            {/* Background Viewer */}
            <div className="absolute inset-0 z-0">
                <ThreeSixtyViewer imageUrl={scene.url} />
            </div>

            {/* Top Left: Logo / Brand */}
            <div className="absolute top-6 left-6 z-10 flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center shadow-2xl border-2 border-white/20 backdrop-blur-sm">
                    {/* Placeholder for Logo */}
                    <span className="text-2xl font-serif font-bold text-white drop-shadow-md">360</span>
                </div>
                {/* 
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                   <h1 className="text-lg font-bold">Project Name</h1>
                </div> 
                */}
            </div>

            {/* Top Right: Info / Status */}
            <div className="absolute top-6 right-6 z-10 hidden md:block">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-lg shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                        <h2 className="text-lg font-semibold tracking-wide uppercase">{scene.name}</h2>
                    </div>
                </div>
            </div>

            {/* Right Sidebar: Quick Actions */}
            <div className={`absolute right-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-3 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-32'}`}>
                {[
                    { icon: Home, label: 'Lobby', action: onExit },
                    { icon: Phone, label: 'Contact', action: () => alert('Contact info placeholder') },
                    { icon: Map, label: 'Map', action: () => alert('Map placeholder') },
                    { icon: ImageIcon, label: 'Gallery', action: () => alert('Gallery placeholder') },
                ].map((item, idx) => (
                    <button
                        key={idx}
                        onClick={item.action}
                        className="w-12 h-12 bg-black/40 hover:bg-yellow-600 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 group relative"
                    >
                        <item.icon className="w-6 h-6 text-white" />
                        <span className="absolute right-full mr-3 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Sidebar Toggle (Hidden when open, shown when closed or via a separate control if needed) 
                For now, let's just make the sidebar always open or togglable via a bottom control.
                Let's add a toggle to the bottom controls.
            */}

            {/* Bottom Bar: Title & Controls */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-between">

                {/* Scene Title */}
                <div className="mb-2">
                    <h1 className="text-4xl font-bold drop-shadow-lg mb-1">{scene.name}</h1>
                    <p className="text-gray-300 text-sm opacity-80 uppercase tracking-widest">360° Interactive View</p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                    <ControlBtn icon={RotateCcw} label="Reset" onClick={() => { }} />
                    <ControlBtn icon={Camera} label="Screenshot" onClick={() => alert('Screenshot taken!')} />
                    <ControlBtn icon={Share2} label="Share" onClick={() => alert('Share link copied!')} />
                    {/* <ControlBtn icon={HelpCircle} label="Help" onClick={() => alert('Drag to rotate, scroll to zoom.')} /> */}
                    <ControlBtn
                        icon={isSidebarOpen ? Minimize : Maximize} // Reusing icons for menu toggle visualization
                        label={isSidebarOpen ? "Hide Menu" : "Show Menu"}
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    />
                    <div className="w-px h-8 bg-white/20 mx-2"></div>
                    <ControlBtn
                        icon={isFullscreen ? Minimize : Maximize}
                        label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                        onClick={toggleFullscreen}
                    />
                </div>
            </div>
        </div>
    );
};

const ControlBtn: React.FC<{ icon: any, label: string, onClick: () => void }> = ({ icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg transition-colors group relative"
        aria-label={label}
    >
        <Icon className="w-5 h-5 text-white" />
        <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {label}
        </span>
    </button>
);

export default TourOverlay;
