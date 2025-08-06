// File: src/components/audio/GraphicEQ.jsx

import React, { useState } from 'react';
import { ISO_THIRTY_ONE_BANDS, FrequencyUtils } from '../../constants/frequencies.js';

const GraphicEQ = ({ initialGains, onBandChange }) => {
    // Inizializza i guadagni per le 31 bande
    const defaultGains = ISO_THIRTY_ONE_BANDS.reduce((acc, freq) => {
        acc[freq] = 0;
        return acc;
    }, {});
    
    const [gains, setGains] = useState(initialGains || defaultGains);

    const handleGainChange = (freq, value) => {
        const newGain = parseFloat(value);
        const newGains = { ...gains, [freq]: newGain };
        setGains(newGains);
        if (onBandChange) {
            onBandChange(freq, newGain);
        }
    };

    return (
        <div className="card bg-white border border-gray-200">
            <div className="card-header">
                <h3 className="text-xl font-semibold">31-Band Graphic Equalizer</h3>
            </div>
            <div className="card-body overflow-x-auto">
                <div className="flex justify-between gap-1 sm:gap-2 p-4 bg-white/50 rounded-lg min-w-[1200px]">
                    {ISO_THIRTY_ONE_BANDS.map(freq => (
                        <div key={freq} className="flex flex-col items-center flex-grow">
                            <div className="h-48 relative">
                                <input
                                    type="range"
                                    min={-12}
                                    max={12}
                                    step={0.1}
                                    value={gains[freq]}
                                    onChange={(e) => handleGainChange(freq, e.target.value)}
                                    className="eq-slider"
                                />
                            </div>
                            <div className="mt-2 text-center">
                                <div className="text-sm font-bold">
                                    {gains[freq].toFixed(1)}dB
                                </div>
                                <div className="text-xs text-gray-600">
                                    {FrequencyUtils.formatFrequency(freq)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GraphicEQ;