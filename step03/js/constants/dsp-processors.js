// DSP Processor Definitions

const DSP_PROCESSORS = {
    eq: {
        name: 'Parametric EQ',
        description: 'Frequency-specific gain adjustment',
        params: {
            frequency: { min: 20, max: 20000, default: 1000, unit: 'Hz', type: 'log' },
            gain: { min: -12, max: 12, default: 0, unit: 'dB', type: 'linear' },
            q: { min: 0.1, max: 10, default: 1, unit: 'Q', type: 'log' }
        },
        category: 'frequency',
        color: '#10b981'
    },
    compressor: {
        name: 'Compressor',
        description: 'Dynamic range control',
        params: {
            threshold: { min: -60, max: 0, default: -12, unit: 'dB', type: 'linear' },
            ratio: { min: 1, max: 20, default: 4, unit: ':1', type: 'log' },
            attack: { min: 0.1, max: 100, default: 10, unit: 'ms', type: 'log' },
            release: { min: 10, max: 1000, default: 100, unit: 'ms', type: 'log' },
            knee: { min: 0, max: 10, default: 2, unit: 'dB', type: 'linear' }
        },
        category: 'dynamics',
        color: '#f59e0b'
    },
    limiter: {
        name: 'Limiter',
        description: 'Peak level protection',
        params: {
            threshold: { min: -20, max: 0, default: -3, unit: 'dB', type: 'linear' },
            release: { min: 1, max: 100, default: 10, unit: 'ms', type: 'log' },
            lookahead: { min: 0, max: 10, default: 2, unit: 'ms', type: 'linear' }
        },
        category: 'dynamics',
        color: '#ef4444'
    },
    gate: {
        name: 'Noise Gate',
        description: 'Noise floor control',
        params: {
            threshold: { min: -80, max: -20, default: -40, unit: 'dB', type: 'linear' },
            attack: { min: 0.1, max: 10, default: 1, unit: 'ms', type: 'log' },
            hold: { min: 1, max: 1000, default: 10, unit: 'ms', type: 'log' },
            release: { min: 10, max: 5000, default: 100, unit: 'ms', type: 'log' }
        },
        category: 'dynamics',
        color: '#8b5cf6'
    },
    reverb: {
        name: 'Reverb',
        description: 'Spatial enhancement',
        params: {
            roomSize: { min: 0, max: 1, default: 0.5, unit: '', type: 'linear' },
            damping: { min: 0, max: 1, default: 0.5, unit: '', type: 'linear' },
            wetLevel: { min: -60, max: 0, default: -12, unit: 'dB', type: 'linear' },
            dryLevel: { min: -60, max: 0, default: 0, unit: 'dB', type: 'linear' }
        },
        category: 'spatial',
        color: '#06b6d4'
    },
    delay: {
        name: 'Delay',
        description: 'Echo effect',
        params: {
            time: { min: 1, max: 2000, default: 250, unit: 'ms', type: 'log' },
            feedback: { min: 0, max: 0.95, default: 0.3, unit: '', type: 'linear' },
            mix: { min: 0, max: 1, default: 0.2, unit: '', type: 'linear' }
        },
        category: 'spatial',
        color: '#ec4899'
    },
    hpf: {
        name: 'High-pass Filter',
        description: 'Low frequency removal',
        params: {
            frequency: { min: 20, max: 1000, default: 80, unit: 'Hz', type: 'log' },
            q: { min: 0.1, max: 10, default: 0.707, unit: 'Q', type: 'log' }
        },
        category: 'filter',
        color: '#84cc16'
    },
    lpf: {
        name: 'Low-pass Filter',
        description: 'High frequency removal',
        params: {
            frequency: { min: 1000, max: 20000, default: 10000, unit: 'Hz', type: 'log' },
            q: { min: 0.1, max: 10, default: 0.707, unit: 'Q', type: 'log' }
        },
        category: 'filter',
        color: '#f97316'
    },
    multiband_compressor: {
        name: 'Multiband Compressor',
        description: 'Frequency-specific compression',
        params: {
            lowThreshold: { min: -60, max: 0, default: -20, unit: 'dB', type: 'linear' },
            midThreshold: { min: -60, max: 0, default: -15, unit: 'dB', type: 'linear' },
            highThreshold: { min: -60, max: 0, default: -10, unit: 'dB', type: 'linear' },
            crossover1: { min: 100, max: 1000, default: 300, unit: 'Hz', type: 'log' },
            crossover2: { min: 1000, max: 10000, default: 3000, unit: 'Hz', type: 'log' }
        },
        category: 'dynamics',
        color: '#a855f7'
    },
    stereo_widener: {
        name: 'Stereo Widener',
        description: 'Stereo image enhancement',
        params: {
            width: { min: 0, max: 2, default: 1, unit: '', type: 'linear' },
            bassMonoFreq: { min: 20, max: 500, default: 120, unit: 'Hz', type: 'log' }
        },
        category: 'spatial',
        color: '#14b8a6'
    },
    de_esser: {
        name: 'De-esser',
        description: 'Sibilance control',
        params: {
            frequency: { min: 2000, max: 12000, default: 6000, unit: 'Hz', type: 'log' },
            threshold: { min: -60, max: 0, default: -20, unit: 'dB', type: 'linear' },
            ratio: { min: 2, max: 10, default: 4, unit: ':1', type: 'linear' }
        },
        category: 'frequency',
        color: '#db2777'
    }
};

// DSP Categories
const DSP_CATEGORIES = {
    frequency: { name: 'Frequency', color: '#10b981', icon: '🎛️' },
    dynamics: { name: 'Dynamics', color: '#f59e0b', icon: '📊' },
    spatial: { name: 'Spatial', color: '#06b6d4', icon: '🌊' },
    filter: { name: 'Filters', color: '#84cc16', icon: '🔧' }
};

// Get processors by category
const getProcessorsByCategory = (category) => {
    return Object.entries(DSP_PROCESSORS)
        .filter(([key, processor]) => processor.category === category)
        .reduce((acc, [key, processor]) => {
            acc[key] = processor;
            return acc;
        }, {});
};

// Validate DSP parameter
const validateDSPParameter = (processorType, paramName, value) => {
    const processor = DSP_PROCESSORS[processorType];
    if (!processor || !processor.params[paramName]) return false;
    
    const param = processor.params[paramName];
    return value >= param.min && value <= param.max;
};

// Format parameter value for display
const formatParameterValue = (value, unit, precision = 1) => {
    const formatted = typeof value === 'number' ? value.toFixed(precision) : value;
    return unit ? `${formatted}${unit}` : formatted;
};

// Get recommended DSP chain for room type
const getRecommendedDSPChain = (roomType, problems = []) => {
    const chains = {
        studio: [
            { type: 'hpf', priority: 1 },
            { type: 'eq', priority: 2 },
            { type: 'compressor', priority: 3 },
            { type: 'de_esser', priority: 4 },
            { type: 'limiter', priority: 5 }
        ],
        home_theater: [
            { type: 'hpf', priority: 1 },
            { type: 'eq', priority: 2 },
            { type: 'multiband_compressor', priority: 3 },
            { type: 'stereo_widener', priority: 4 }
        ],
        live_room: [
            { type: 'hpf', priority: 1 },
            { type: 'eq', priority: 2 },
            { type: 'gate', priority: 3 },
            { type: 'compressor', priority: 4 },
            { type: 'limiter', priority: 5 }
        ],
        broadcast: [
            { type: 'hpf', priority: 1 },
            { type: 'eq', priority: 2 },
            { type: 'gate', priority: 3 },
            { type: 'multiband_compressor', priority: 4 },
            { type: 'de_esser', priority: 5 },
            { type: 'limiter', priority: 6 }
        ]
    };
    
    return chains[roomType] || chains.studio;
};