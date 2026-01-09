import React from 'react';

interface ThreeSixtyViewerProps {
    imageUrl?: string;
}

const ThreeSixtyViewer: React.FC<ThreeSixtyViewerProps> = ({ imageUrl }) => {
    return (
        <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden shadow-xl">
            <div className="absolute inset-0 flex items-center justify-center text-white">
                {imageUrl ? (
                    <div className="text-center">
                        <p className="text-xl font-bold">360 View Loaded</p>
                        {/* Actual 360 library implementation would go here */}
                        <img src={imageUrl} alt="360 view" className="object-cover w-full h-full opacity-50" />
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full">
                            Drag to view
                        </div>
                    </div>
                ) : (
                    <p>Reference Image Not Loaded</p>
                )}
            </div>
            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-md text-white text-sm">
                360° View
            </div>
        </div>
    );
};

export default ThreeSixtyViewer;
