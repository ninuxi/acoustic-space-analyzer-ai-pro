// File: src/utils/calculations.js

export const Calculations = {
    // Speed of sound calculation with temperature compensation
    speedOfSound: (temperature = 20) => {
        // v = 331.3 * sqrt(1 + T/273.15) where T is in Celsius
        return 331.3 * Math.sqrt(1 + temperature / 273.15);
    },

    // Calculate wavelength from frequency
    wavelength: (frequency, temperature = 20) => {
        const c = Calculations.speedOfSound(temperature); // Riferimento interno all'oggetto
        return c / frequency;
    },

    // Calculate room modes (axial, tangential, oblique)
    calculateRoomModes: (length, width, height, maxFreq = 300) => {
        const c = Calculations.speedOfSound();
        const modes = [];
        
        for (let nx = 0; nx <= Math.ceil(2 * maxFreq * length / c); nx++) {
            for (let ny = 0; ny <= Math.ceil(2 * maxFreq * width / c); ny++) {
                for (let nz = 0; nz <= Math.ceil(2 * maxFreq * height / c); nz++) {
                    if (nx === 0 && ny === 0 && nz === 0) continue;
                    
                    const frequency = (c / 2) * Math.sqrt(
                        (nx / length) ** 2 + 
                        (ny / width) ** 2 + 
                        (nz / height) ** 2
                    );
                    
                    if (frequency <= maxFreq) {
                        let modeType = 'oblique';
                        let nonZeroCount = (nx > 0 ? 1 : 0) + (ny > 0 ? 1 : 0) + (nz > 0 ? 1 : 0);
                        
                        if (nonZeroCount === 1) modeType = 'axial';
                        else if (nonZeroCount === 2) modeType = 'tangential';
                        
                        modes.push({ frequency, nx, ny, nz, type: modeType });
                    }
                }
            }
        }
        
        return modes.sort((a, b) => a.frequency - b.frequency);
    },

    // Calculate RT60 using Sabine's formula
    sabineRT60: (volume, totalAbsorption) => {
        if (totalAbsorption <= 0) return Infinity;
        return (0.161 * volume) / totalAbsorption;
    },

    // ... (tutte le altre funzioni di calcolo che avevi, come eyringRT60, criticalDistance, etc.)

    // Statistical analysis functions
    mean: (values) => {
        if (values.length === 0) return 0;
        return values.reduce((sum, val) => sum + val, 0) / values.length;
    },

    standardDeviation: (values) => {
        if (values.length < 2) return 0;
        const avg = Calculations.mean(values);
        const squaredDiffs = values.map(val => (val - avg) ** 2);
        return Math.sqrt(Calculations.mean(squaredDiffs));
    }
};