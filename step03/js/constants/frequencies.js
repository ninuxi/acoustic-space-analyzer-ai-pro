// Frequency Constants for Audio Analysis

// 16-band frequencies for equalizer (professional standard)
const EQ_FREQUENCIES = [20, 31.5, 63, 125, 250, 500, 1000, 2000, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000];

// ISO standard octave bands
const OCTAVE_BANDS = [125, 250, 500, 1000, 2000, 4000];

// Pink noise reference spectrum (ideal response in dB SPL)
const PINK_NOISE_REFERENCE = {
    20: 85, 31.5: 83, 63: 81, 125: 79, 250: 77, 500: 75,
    1000: 73, 2000: 71, 3150: 69, 4000: 68, 5000: 67,
    6300: 66, 8000: 65, 10000: 64, 12500: 63, 16000: 62
};

// Critical bands for psychoacoustic analysis
const CRITICAL_BANDS = [
    { center: 50, low: 0, high: 100 },
    { center: 150, low: 100, high: 200 },
    { center: 250, low: 200, high: 300 },
    { center: 350, low: 300, high: 400 },
    { center: 450, low: 400, high: 510 },
    { center: 570, low: 510, high: 630 },
    { center: 700, low: 630, high: 770 },
    { center: 840, low: 770, high: 920 },
    { center: 1000, low: 920, high: 1080 },
    { center: 1170, low: 1080, high: 1270 },
    { center: 1370, low: 1270, high: 1480 },
    { center: 1600, low: 1480, high: 1720 },
    { center: 1850, low: 1720, high: 2000 },
    { center: 2150, low: 2000, high: 2320 },
    { center: 2500, low: 2320, high: 2700 },
    { center: 2900, low: 2700, high: 3150 },
    { center: 3400, low: 3150, high: 3700 },
    { center: 4000, low: 3700, high: 4400 },
    { center: 4800, low: 4400, high: 5300 },
    { center: 5800, low: 5300, high: 6400 },
    { center: 7000, low: 6400, high: 7700 },
    { center: 8500, low: 7700, high: 9500 },
    { center: 10500, low: 9500, high: 12000 },
    { center: 13500, low: 12000, high: 15500 }
];

// Frequency ranges for different audio characteristics
const FREQUENCY_RANGES = {
    sub_bass: { min: 20, max: 60, name: 'Sub Bass' },
    bass: { min: 60, max: 250, name: 'Bass' },
    low_mid: { min: 250, max: 500, name: 'Low Mid' },
    mid: { min: 500, max: 2000, name: 'Mid' },
    high_mid: { min: 2000, max: 4000, name: 'High Mid' },
    presence: { min: 4000, max: 6000, name: 'Presence' },
    brilliance: { min: 6000, max: 20000, name: 'Brilliance' }
};

// Format frequency for display
const formatFrequency = (freq) => {
    if (freq >= 1000) {
        return `${(freq / 1000).toFixed(freq % 1000 === 0 ? 0 : 1)}k`;
    }
    return freq.toString();
};

// Get frequency range for a given frequency
const getFrequencyRange = (frequency) => {
    for (const [key, range] of Object.entries(FREQUENCY_RANGES)) {
        if (frequency >= range.min && frequency <= range.max) {
            return { key, ...range };
        }
    }
    return null;
};

// Convert frequency to musical note (approximate)
const frequencyToNote = (frequency) => {
    const A4 = 440;
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    const semitones = Math.round(12 * Math.log2(frequency / A4));
    const octave = Math.floor((semitones + 9) / 12) + 4;
    const noteIndex = ((semitones + 9) % 12 + 12) % 12;
    
    return `${noteNames[noteIndex]}${octave}`;
};

// Calculate frequency bin for FFT analysis
const getFrequencyBin = (frequency, sampleRate, fftSize) => {
    return Math.round((frequency * fftSize) / sampleRate);
};

// Get nearest EQ frequency
const getNearestEQFrequency = (frequency) => {
    return EQ_FREQUENCIES.reduce((prev, curr) => 
        Math.abs(curr - frequency) < Math.abs(prev - frequency) ? curr : prev
    );
};