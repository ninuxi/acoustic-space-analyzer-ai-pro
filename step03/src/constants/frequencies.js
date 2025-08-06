// Frequency Constants for Audio Analysis

// 16-band frequencies for equalizer (professional standard)
window.EQ_FREQUENCIES = [20, 31.5, 63, 125, 250, 500, 1000, 2000, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000];

// ISO standard octave bands
window.OCTAVE_BANDS = [125, 250, 500, 1000, 2000, 4000];

// Third-octave bands (extended analysis)
window.THIRD_OCTAVE_BANDS = [
    100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 
    1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000
];

// Pink noise reference spectrum (ideal response in dB SPL)
window.PINK_NOISE_REFERENCE = {
    20: 85, 31.5: 83, 63: 81, 125: 79, 250: 77, 500: 75,
    1000: 73, 2000: 71, 3150: 69, 4000: 68, 5000: 67,
    6300: 66, 8000: 65, 10000: 64, 12500: 63, 16000: 62
};

// White noise reference (flat spectrum)
window.WHITE_NOISE_REFERENCE = {
    20: 70, 31.5: 70, 63: 70, 125: 70, 250: 70, 500: 70,
    1000: 70, 2000: 70, 3150: 70, 4000: 70, 5000: 70,
    6300: 70, 8000: 70, 10000: 70, 12500: 70, 16000: 70
};

// Critical bands for psychoacoustic analysis (Bark scale)
window.CRITICAL_BANDS = [
    { center: 50, low: 0, high: 100, bark: 0.5 },
    { center: 150, low: 100, high: 200, bark: 1.5 },
    { center: 250, low: 200, high: 300, bark: 2.5 },
    { center: 350, low: 300, high: 400, bark: 3.5 },
    { center: 450, low: 400, high: 510, bark: 4.5 },
    { center: 570, low: 510, high: 630, bark: 5.5 },
    { center: 700, low: 630, high: 770, bark: 6.5 },
    { center: 840, low: 770, high: 920, bark: 7.5 },
    { center: 1000, low: 920, high: 1080, bark: 8.5 },
    { center: 1170, low: 1080, high: 1270, bark: 9.5 },
    { center: 1370, low: 1270, high: 1480, bark: 10.5 },
    { center: 1600, low: 1480, high: 1720, bark: 11.5 },
    { center: 1850, low: 1720, high: 2000, bark: 12.5 },
    { center: 2150, low: 2000, high: 2320, bark: 13.5 },
    { center: 2500, low: 2320, high: 2700, bark: 14.5 },
    { center: 2900, low: 2700, high: 3150, bark: 15.5 },
    { center: 3400, low: 3150, high: 3700, bark: 16.5 },
    { center: 4000, low: 3700, high: 4400, bark: 17.5 },
    { center: 4800, low: 4400, high: 5300, bark: 18.5 },
    { center: 5800, low: 5300, high: 6400, bark: 19.5 },
    { center: 7000, low: 6400, high: 7700, bark: 20.5 },
    { center: 8500, low: 7700, high: 9500, bark: 21.5 },
    { center: 10500, low: 9500, high: 12000, bark: 22.5 },
    { center: 13500, low: 12000, high: 15500, bark: 23.5 }
];

// Frequency ranges for different audio characteristics
window.FREQUENCY_RANGES = {
    sub_bass: { min: 20, max: 60, name: 'Sub Bass', description: 'Felt more than heard' },
    bass: { min: 60, max: 250, name: 'Bass', description: 'Fundamental frequencies' },
    low_mid: { min: 250, max: 500, name: 'Low Mid', description: 'Warmth and body' },
    mid: { min: 500, max: 2000, name: 'Mid', description: 'Vocal clarity' },
    high_mid: { min: 2000, max: 4000, name: 'High Mid', description: 'Presence and definition' },
    presence: { min: 4000, max: 6000, name: 'Presence', description: 'Intelligibility' },
    brilliance: { min: 6000, max: 20000, name: 'Brilliance', description: 'Air and sparkle' }
};

// Musical note frequencies (A4 = 440 Hz)
window.MUSICAL_NOTES = {
    'C0': 16.35, 'C#0': 17.32, 'D0': 18.35, 'D#0': 19.45, 'E0': 20.60, 'F0': 21.83,
    'F#0': 23.12, 'G0': 24.50, 'G#0': 25.96, 'A0': 27.50, 'A#0': 29.14, 'B0': 30.87,
    'C1': 32.70, 'C#1': 34.65, 'D1': 36.71, 'D#1': 38.89, 'E1': 41.20, 'F1': 43.65,
    'F#1': 46.25, 'G1': 49.00, 'G#1': 51.91, 'A1': 55.00, 'A#1': 58.27, 'B1': 61.74,
    'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31,
    'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
    'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61,
    'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
    'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23,
    'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
    'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46,
    'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
    'C6': 1046.50, 'C#6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'E6': 1318.51, 'F6': 1396.91,
    'F#6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22, 'A6': 1760.00, 'A#6': 1864.66, 'B6': 1975.53,
    'C7': 2093.00, 'C#7': 2217.46, 'D7': 2349.32, 'D#7': 2489.02, 'E7': 2637.02, 'F7': 2793.83,
    'F#7': 2959.96, 'G7': 3135.96, 'G#7': 3322.44, 'A7': 3520.00, 'A#7': 3729.31, 'B7': 3951.07,
    'C8': 4186.01, 'C#8': 4434.92, 'D8': 4698.63, 'D#8': 4978.03, 'E8': 5274.04, 'F8': 5587.65,
    'F#8': 5919.91, 'G8': 6271.93, 'G#8': 6644.88, 'A8': 7040.00, 'A#8': 7458.62, 'B8': 7902.13
};

// Frequency utility functions
window.FrequencyUtils = {
    // Format frequency for display
    formatFrequency: (freq) => {
        if (freq >= 1000) {
            const kHz = freq / 1000;
            return kHz % 1 === 0 ? `${kHz}k` : `${kHz.toFixed(1)}k`;
        }
        return freq.toString();
    },

    // Get frequency range for a given frequency
    getFrequencyRange: (frequency) => {
        for (const [key, range] of Object.entries(window.FREQUENCY_RANGES)) {
            if (frequency >= range.min && frequency <= range.max) {
                return { key, ...range };
            }
        }
        return null;
    },

    // Convert frequency to musical note (approximate)
    frequencyToNote: (frequency) => {
        const A4 = 440;
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        
        const semitones = Math.round(12 * Math.log2(frequency / A4));
        const octave = Math.floor((semitones + 9) / 12) + 4;
        const noteIndex = ((semitones + 9) % 12 + 12) % 12;
        
        return `${noteNames[noteIndex]}${octave}`;
    },

    // Convert note to frequency
    noteToFrequency: (note) => {
        return window.MUSICAL_NOTES[note] || 0;
    },

    // Calculate frequency bin for FFT analysis
    getFrequencyBin: (frequency, sampleRate, fftSize) => {
        return Math.round((frequency * fftSize) / sampleRate);
    },

    // Get nearest EQ frequency
    getNearestEQFrequency: (frequency) => {
        return window.EQ_FREQUENCIES.reduce((prev, curr) => 
            Math.abs(curr - frequency) < Math.abs(prev - frequency) ? curr : prev
        );
    },

    // Convert Hz to Bark scale (psychoacoustic)
    hzToBark: (frequency) => {
        return 13 * Math.atan(0.00076 * frequency) + 3.5 * Math.atan(Math.pow(frequency / 7500, 2));
    },

    // Convert Bark to Hz
    barkToHz: (bark) => {
        return 600 * Math.sinh(bark / 4);
    },

    // Convert Hz to Mel scale (perceptual)
    hzToMel: (frequency) => {
        return 2595 * Math.log10(1 + frequency / 700);
    },

    // Convert Mel to Hz
    melToHz: (mel) => {
        return 700 * (Math.pow(10, mel / 2595) - 1);
    },

    // Calculate octave ratio
    calculateOctaveRatio: (freq1, freq2) => {
        return Math.log2(Math.max(freq1, freq2) / Math.min(freq1, freq2));
    },

    // Get octave bands within range
    getOctaveBandsInRange: (minFreq, maxFreq) => {
        return window.OCTAVE_BANDS.filter(freq => freq >= minFreq && freq <= maxFreq);
    },

    // Calculate bandwidth for Q factor
    calculateBandwidth: (centerFreq, qFactor) => {
        return centerFreq / qFactor;
    },

    // Get critical band for frequency
    getCriticalBand: (frequency) => {
        return window.CRITICAL_BANDS.find(band => 
            frequency >= band.low && frequency <= band.high
        ) || null;
    },

    // Generate frequency sweep array
    generateFrequencySweep: (startFreq, endFreq, steps, logScale = true) => {
        const frequencies = [];
        
        if (logScale) {
            const logStart = Math.log10(startFreq);
            const logEnd = Math.log10(endFreq);
            const logStep = (logEnd - logStart) / (steps - 1);
            
            for (let i = 0; i < steps; i++) {
                frequencies.push(Math.pow(10, logStart + i * logStep));
            }
        } else {
            const step = (endFreq - startFreq) / (steps - 1);
            for (let i = 0; i < steps; i++) {
                frequencies.push(startFreq + i * step);
            }
        }
        
        return frequencies;
    },

    // Calculate frequency response smoothing
    smoothFrequencyResponse: (frequencyData, smoothingFactor = 0.3) => {
        if (!frequencyData.length) return frequencyData;
        
        const smoothed = [...frequencyData];
        for (let i = 1; i < smoothed.length - 1; i++) {
            const prev = frequencyData[i - 1];
            const curr = frequencyData[i];
            const next = frequencyData[i + 1];
            
            smoothed[i] = {
                ...curr,
                dbSPL: curr.dbSPL * (1 - smoothingFactor) + 
                       (prev.dbSPL + next.dbSPL) * smoothingFactor / 2
            };
        }
        
        return smoothed;
    },

    // Check if frequency is audible
    isAudibleFrequency: (frequency, ageGroup = 'adult') => {
        const ranges = {
            'child': { min: 20, max: 20000 },
            'adult': { min: 20, max: 16000 },
            'elderly': { min: 20, max: 12000 }
        };
        
        const range = ranges[ageGroup] || ranges.adult;
        return frequency >= range.min && frequency <= range.max;
    },

    // Get frequency weighting (A, B, C)
    getFrequencyWeighting: (frequency, type = 'A') => {
        const f = frequency;
        const f2 = f * f;
        const f4 = f2 * f2;
        
        switch (type) {
            case 'A':
                const ra = (12194 * 12194 * f4) / 
                          ((f2 + 20.6 * 20.6) * Math.sqrt((f2 + 107.7 * 107.7) * (f2 + 737.9 * 737.9)) * (f2 + 12194 * 12194));
                return 20 * Math.log10(ra) + 2.00;
                
            case 'B':
                const rb = (12194 * 12194 * f2 * f) / 
                          ((f2 + 20.6 * 20.6) * Math.sqrt(f2 + 158.5 * 158.5) * (f2 + 12194 * 12194));
                return 20 * Math.log10(rb) + 0.17;
                
            case 'C':
                const rc = (12194 * 12194 * f2) / 
                          ((f2 + 20.6 * 20.6) * (f2 + 12194 * 12194));
                return 20 * Math.log10(rc) + 0.06;
                
            default:
                return 0;
        }
    }
};

console.log('Frequency constants loaded:', window.EQ_FREQUENCIES.length, 'EQ bands');