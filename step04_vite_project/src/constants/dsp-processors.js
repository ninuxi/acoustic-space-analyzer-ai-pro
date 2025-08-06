// File: src/constants/dsp-processors.js

export const DSP_PROCESSORS = {
    eq: {
        name: 'Parametric EQ',
        description: 'Frequency-specific gain adjustment',
        params: {
            frequency: { min: 20, max: 20000, default: 1000, unit: 'Hz', type: 'log' },
            gain: { min: -12, max: 12, default: 0, unit: 'dB', type: 'linear' },
            q: { min: 0.1, max: 10, default: 1, unit: 'Q', type: 'log' }
        },
        category: 'frequency',
        color: '#10b981',
        icon: '🎛️'
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
        color: '#f59e0b',
        icon: '📊'
    },
    // ... (tutti gli altri processori DSP qui, senza modifiche alla loro struttura interna)
    flanger: {
        name: 'Flanger',
        description: 'Sweeping comb filter',
        params: {
            rate: { min: 0.1, max: 10, default: 0.5, unit: 'Hz', type: 'log' },
            depth: { min: 0, max: 100, default: 70, unit: '%', type: 'linear' },
            feedback: { min: 0, max: 95, default: 20, unit: '%', type: 'linear' }
        },
        category: 'modulation',
        color: '#f18701',
        icon: '〰️'
    }
};

export const DSP_CATEGORIES = {
    frequency: { name: 'Frequency', color: '#10b981', icon: '🎛️', description: 'EQ and filtering' },
    dynamics: { name: 'Dynamics', color: '#f59e0b', icon: '📊', description: 'Level control' },
    spatial: { name: 'Spatial', color: '#06b6d4', icon: '🌊', description: 'Space and time' },
    filter: { name: 'Filters', color: '#84cc16', icon: '📈', description: 'Frequency shaping' },
    enhancement: { name: 'Enhancement', color: '#f472b6', icon: '✨', description: 'Harmonic processing' },
    modulation: { name: 'Modulation', color: '#06d6a0', icon: '🌀', description: 'Time-based effects' }
};

export const DSPUtils = {
    getProcessorsByCategory: (category) => {
        return Object.entries(DSP_PROCESSORS)
            .filter(([, processor]) => processor.category === category)
            .reduce((acc, [key, processor]) => {
                acc[key] = processor;
                return acc;
            }, {});
    },
    validateDSPParameter: (processorType, paramName, value) => {
        const processor = DSP_PROCESSORS[processorType];
        if (!processor || !processor.params[paramName]) return false;
        
        const param = processor.params[paramName];
        return value >= param.min && value <= param.max;
    },
    formatParameterValue: (value, unit, precision = 1) => {
        if (typeof value !== 'number') return value;
        const formatted = value.toFixed(precision);
        return unit ? `${formatted}${unit}` : formatted;
    },
    // ... (tutte le altre funzioni di DSPUtils, assicurandosi che usino DSP_PROCESSORS invece di window.DSP_PROCESSORS)
};