// File: src/components/ui/DemoBanner.jsx

import React, { useState, useEffect } from 'react';

const DemoBanner = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        // Automatically hide the banner after 10 seconds
        const timer = setTimeout(() => setIsVisible(false), 10000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Update the time every second
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <div
            className="demo-banner text-center py-3 text-gray-900 font-bold text-sm relative overflow-hidden cursor-pointer"
            onClick={() => setIsVisible(false)}
        >
            <div className="relative z-10 flex items-center justify-center space-x-4">
                <span className="animate-bounce">🎙️</span>
                <span>ONLINE DEMO</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Acoustic Space Analyzer AI Pro</span>
                <span className="text-yellow-300">•</span>
                <span className="font-mono text-xs">{currentTime}</span>
                <button
                    className="ml-4 hover:bg-white/20 rounded p-1 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevents the parent div's onClick from firing
                        setIsVisible(false);
                    }}
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default DemoBanner;