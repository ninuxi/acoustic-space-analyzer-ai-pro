// File: src/constants/frequencies.js

// Aggiungiamo la lista standard a 31 bande (1/3 d'ottava)
export const ISO_THIRTY_ONE_BANDS = [
    20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 
    800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 
    12500, 16000, 20000
];

// Le altre costanti rimangono
export const EQ_FREQUENCIES = [20, 31.5, 63, 125, 250, 500, 1000, 2000, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000];
export const OCTAVE_BANDS = [125, 250, 500, 1000, 2000, 4000];
export const PINK_NOISE_REFERENCE = { /* ... dati ... */ };
export const FREQUENCY_RANGES = { /* ... dati ... */ };

export const FrequencyUtils = {
    formatFrequency: (freq) => {
        if (freq >= 1000) return `${(freq / 1000).toFixed(1)}k`.replace('.0', '');
        return freq.toString();
    },
    getFrequencyBin: (frequency, sampleRate, fftSize) => {
        return Math.round((frequency * fftSize) / sampleRate);
    },
};