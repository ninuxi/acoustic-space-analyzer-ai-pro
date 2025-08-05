// DSP Processor Definitions

window.DSP_PROCESSORS = {
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
    limiter: {
        name: 'Limiter',
        description: 'Peak level protection',
        params: {
            threshold: { min: -20, max: 0, default: -3, unit: 'dB', type: 'linear' },
            release: { min: 1, max: 100, default: 10, unit: 'ms', type: 'log' },
            lookahead: { min: 0, max: 10, default: 2, unit: 'ms', type: 'linear' }
        },
        category: 'dynamics',
        color: '#ef4444',
        icon: '🚫'
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
        color: '#8b5cf6',
        icon: '🚪'
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
        color: '#06b6d4',
        icon: '🌊'
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
        color: '#ec4899',
        icon: '⏰'
    },
    hpf: {
        name: 'High-pass Filter',
        description: 'Low frequency removal',
        params: {
            frequency: { min: 20, max: 1000, default: 80, unit: 'Hz', type: 'log' },
            q: { min: 0.1, max: 10, default: 0.707, unit: 'Q', type: 'log' }
        },
        category: 'filter',
        color: '#84cc16',
        icon: '📈'
    },
    lpf: {
        name: 'Low-pass Filter',
        description: 'High frequency removal',
        params: {
            frequency: { min: 1000, max: 20000, default: 10000, unit: 'Hz', type: 'log' },
            q: { min: 0.1, max: 10, default: 0.707, unit: 'Q', type: 'log' }
        },
        category: 'filter',
        color: '#f97316',
        icon: '📉'
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
        color: '#a855f7',
        icon: '📊'
    },
    stereo_widener: {
        name: 'Stereo Widener',
        description: 'Stereo image enhancement',
        params: {
            width: { min: 0, max: 2, default: 1, unit: '', type: 'linear' },
            bassMonoFreq: { min: 20, max: 500, default: 120, unit: 'Hz', type: 'log' }
        },
        category: 'spatial',
        color: '#14b8a6',
        icon: '↔️'
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
        color: '#db2777',
        icon: '🎤'
    },
    exciter: {
        name: 'Harmonic Exciter',
        description: 'Harmonic enhancement',
        params: {
            frequency: { min: 1000, max: 10000, default: 3000, unit: 'Hz', type: 'log' },
            drive: { min: 0, max: 100, default: 20, unit: '%', type: 'linear' },
            mix: { min: 0, max: 100, default: 30, unit: '%', type: 'linear' }
        },
        category: 'enhancement',
        color: '#f472b6',
        icon: '✨'
    },
    chorus: {
        name: 'Chorus',
        description: 'Modulation effect',
        params: {
            rate: { min: 0.1, max: 10, default: 1, unit: 'Hz', type: 'log' },
            depth: { min: 0, max: 100, default: 50, unit: '%', type: 'linear' },
            mix: { min: 0, max: 100, default: 30, unit: '%', type: 'linear' }
        },
        category: 'modulation',
        color: '#06d6a0',
        icon: '🌀'
    },
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

// DSP Categories
window.DSP_CATEGORIES = {
    frequency: { name: 'Frequency', color: '#10b981', icon: '🎛️', description: 'EQ and filtering' },
    dynamics: { name: 'Dynamics', color: '#f59e0b', icon: '📊', description: 'Level control' },
    spatial: { name: 'Spatial', color: '#06b6d4', icon: '🌊', description: 'Space and time' },
    filter: { name: 'Filters', color: '#84cc16', icon: '📈', description: 'Frequency shaping' },
    enhancement: { name: 'Enhancement', color: '#f472b6', icon: '✨', description: 'Harmonic processing' },
    modulation: { name: 'Modulation', color: '#06d6a0', icon: '🌀', description: 'Time-based effects' }
};

// DSP Utility Functions
window.DSPUtils = {
    // Get processors by category
    getProcessorsByCategory: (category) => {
        return Object.entries(window.DSP_PROCESSORS)
            .filter(([key, processor]) => processor.category === category)
            .reduce((acc, [key, processor]) => {
                acc[key] = processor;
                return acc;
            }, {});
    },

    // Validate DSP parameter
    validateDSPParameter: (processorType, paramName, value) => {
        const processor = window.DSP_PROCESSORS[processorType];
        if (!processor || !processor.params[paramName]) return false;
        
        const param = processor.params[paramName];
        return value >= param.min && value <= param.max;
    },

    // Format parameter value for display
    formatParameterValue: (value, unit, precision = 1) => {
        if (typeof value !== 'number') return value;
        
        const formatted = value.toFixed(precision);
        return unit ? `${formatted}${unit}` : formatted;
    },

    // Get recommended DSP chain for room type
    getRecommendedDSPChain: (roomType, problems = []) => {
        const chains = {
            studio: [
                { type: 'hpf', priority: 1, reason: 'Remove subsonic noise' },
                { type: 'eq', priority: 2, reason: 'Frequency correction' },
                { type: 'compressor', priority: 3, reason: 'Dynamic control' },
                { type: 'de_esser', priority: 4, reason: 'Sibilance control' },
                { type: 'limiter', priority: 5, reason: 'Peak protection' }
            ],
            home_theater: [
                { type: 'hpf', priority: 1, reason: 'Clean low end' },
                { type: 'eq', priority: 2, reason: 'Room correction' },
                { type: 'multiband_compressor', priority: 3, reason: 'Balanced dynamics' },
                { type: 'stereo_widener', priority: 4, reason: 'Immersive sound' }
            ],
            live_room: [
                { type: 'hpf', priority: 1, reason: 'Feedback prevention' },
                { type: 'eq', priority: 2, reason: 'Tonal shaping' },
                { type: 'gate', priority: 3, reason: 'Noise control' },
                { type: 'compressor', priority: 4, reason: 'Consistency' },
                { type: 'limiter', priority: 5, reason: 'System protection' }
            ],
            broadcast: [
                { type: 'hpf', priority: 1, reason: 'Transmission clarity' },
                { type: 'eq', priority: 2, reason: 'Frequency optimization' },
                { type: 'gate', priority: 3, reason: 'Background suppression' },
                { type: 'multiband_compressor', priority: 4, reason: 'Broadcast standards' },
                { type: 'de_esser', priority: 5, reason: 'Vocal clarity' },
                { type: 'limiter', priority: 6, reason: 'Peak limiting' }
            ],
            mastering: [
                { type: 'eq', priority: 1, reason: 'Tonal balance' },
                { type: 'multiband_compressor', priority: 2, reason: 'Spectral control' },
                { type: 'exciter', priority: 3, reason: 'Presence enhancement' },
                { type: 'stereo_widener', priority: 4, reason: 'Image optimization' },
                { type: 'limiter', priority: 5, reason: 'Loudness maximization' }
            ]
        };
        
        return chains[roomType] || chains.studio;
    },

    // Calculate processing latency
    calculateProcessingLatency: (dspChain, sampleRate = 48000) => {
        const latencies = {
            eq: 0, // Zero latency
            compressor: 0.5, // Look-ahead
            limiter: 2, // Look-ahead
            gate: 0,
            reverb: 5, // Algorithm delay
            delay: 0, // Intentional delay
            hpf: 0,
            lpf: 0,
            multiband_compressor: 1,
            stereo_widener: 0,
            de_esser: 0.2,
            exciter: 0,
            chorus: 10,
            flanger: 5
        };
        
        const totalLatencyMs = dspChain.reduce((total, processor) => {
            return total + (latencies[processor.type] || 0);
        }, 0);
        
        const latencySamples = Math.round((totalLatencyMs / 1000) * sampleRate);
        
        return {
            milliseconds: totalLatencyMs,
            samples: latencySamples,
            bufferSize: Math.ceil(latencySamples / 64) * 64 // Round to buffer boundary
        };
    },

    // Estimate CPU usage
    estimateCPUUsage: (dspChain) => {
        const cpuWeights = {
            eq: 1, // Low CPU
            compressor: 2,
            limiter: 2,
            gate: 1,
            reverb: 8, // High CPU
            delay: 3,
            hpf: 1,
            lpf: 1,
            multiband_compressor: 5,
            stereo_widener: 2,
            de_esser: 3,
            exciter: 4,
            chorus: 6,
            flanger: 5
        };
        
        const totalWeight = dspChain.reduce((total, processor) => {
            return total + (cpuWeights[processor.type] || 1);
        }, 0);
        
        // Normalize to percentage (assuming 50 is 100% CPU)
        return Math.min(100, (totalWeight / 50) * 100);
    },

    // Generate optimal parameters for processor
    generateOptimalParameters: (processorType, roomData, frequencyResponse) => {
        const processor = window.DSP_PROCESSORS[processorType];
        if (!processor) return {};
        
        const params = {};
        
        switch (processorType) {
            case 'eq':
                // Find problematic frequency
                const maxDeviation = frequencyResponse.reduce((max, freq) => 
                    Math.abs(freq.deviation) > Math.abs(max.deviation) ? freq : max
                );
                params.frequency = maxDeviation.frequency;
                params.gain = -maxDeviation.deviation * 0.7; // 70% correction
                params.q = Math.abs(maxDeviation.deviation) > 6 ? 2 : 1;
                break;
                
            case 'compressor':
                const dynamicRange = roomData.peakLevel - roomData.rms;
                params.threshold = roomData.rms - 6;
                params.ratio = dynamicRange > 20 ? 6 : 3;
                params.attack = roomData.avgRT60 > 1 ? 20 : 10;
                params.release = roomData.avgRT60 * 100;
                break;
                
            case 'hpf':
                // Set based on room size - smaller rooms need higher HPF
                const roomVolume = roomData.volume || 100;
                params.frequency = roomVolume < 50 ? 40 : roomVolume < 200 ? 30 : 25;
                params.q = 0.707;
                break;
                
            case 'reverb':
                params.roomSize = Math.min(1, roomData.volume / 500);
                params.damping = roomData.avgRT60 > 1.5 ? 0.8 : 0.5;
                params.wetLevel = roomData.avgRT60 > 2 ? -20 : -12;
                params.dryLevel = 0;
                break;
                
            case 'limiter':
                params.threshold = -3;
                params.release = roomData.avgRT60 > 1 ? 50 : 10;
                params.lookahead = 2;
                break;
                
            default:
                // Use default values
                Object.keys(processor.params).forEach(paramName => {
                    params[paramName] = processor.params[paramName].default;
                });
        }
        
        return params;
    },

    // Check if DSP chain is valid
    validateDSPChain: (dspChain) => {
        const issues = [];
        
        if (!dspChain || !Array.isArray(dspChain)) {
            issues.push('DSP chain must be an array');
            return { valid: false, issues };
        }
        
        // Check for valid processor types
        dspChain.forEach((processor, index) => {
            if (!window.DSP_PROCESSORS[processor.type]) {
                issues.push(`Unknown processor type: ${processor.type} at position ${index}`);
            }
            
            if (!processor.params || typeof processor.params !== 'object') {
                issues.push(`Invalid parameters for processor at position ${index}`);
            }
        });
        
        // Check for optimal order
        const order = dspChain.map(p => p.type);
        const optimalOrder = ['hpf', 'eq', 'gate', 'compressor', 'de_esser', 'exciter', 'reverb', 'delay', 'stereo_widener', 'limiter'];
        
        let lastOptimalIndex = -1;
        order.forEach((type, index) => {
            const optimalIndex = optimalOrder.indexOf(type);
            if (optimalIndex !== -1 && optimalIndex < lastOptimalIndex) {
                issues.push(`Processor ${type} at position ${index} may be in suboptimal order`);
            }
            if (optimalIndex !== -1) {
                lastOptimalIndex = optimalIndex;
            }
        });
        
        // Check for duplicates that might cause issues
        const duplicates = order.filter((item, index) => order.indexOf(item) !== index);
        if (duplicates.length > 0) {
            issues.push(`Duplicate processors detected: ${duplicates.join(', ')}`);
        }
        
        return {
            valid: issues.length === 0,
            issues: issues,
            warnings: issues.filter(issue => issue.includes('suboptimal') || issue.includes('Duplicate'))
        };
    },

    // Convert DSP chain to preset format
    exportDSPChainPreset: (dspChain, metadata = {}) => {
        return {
            version: '1.0',
            name: metadata.name || 'Custom DSP Chain',
            description: metadata.description || 'Generated by Acoustic Space Analyzer AI Pro',
            author: metadata.author || 'AI Assistant',
            created: new Date().toISOString(),
            processors: dspChain.map((processor, index) => ({
                id: `proc_${index}`,
                type: processor.type,
                enabled: true,
                parameters: processor.params,
                bypass: false,
                order: index
            })),
            routing: dspChain.map((_, index) => ({
                from: index === 0 ? 'input' : `proc_${index - 1}`,
                to: index === dspChain.length - 1 ? 'output' : `proc_${index + 1}`
            })),
            metadata: {
                ...metadata,
                processorCount: dspChain.length,
                categories: [...new Set(dspChain.map(p => window.DSP_PROCESSORS[p.type]?.category))],
                estimatedCPU: window.DSPUtils.estimateCPUUsage(dspChain),
                estimatedLatency: window.DSPUtils.calculateProcessingLatency(dspChain)
            }
        };
    },

    // Import DSP chain from preset
    importDSPChainPreset: (presetData) => {
        try {
            if (!presetData.processors || !Array.isArray(presetData.processors)) {
                throw new Error('Invalid preset format');
            }
            
            const dspChain = presetData.processors
                .sort((a, b) => a.order - b.order)
                .map(processor => ({
                    type: processor.type,
                    params: processor.parameters,
                    description: window.DSP_PROCESSORS[processor.type]?.description || ''
                }));
            
            const validation = window.DSPUtils.validateDSPChain(dspChain);
            
            return {
                success: true,
                dspChain: dspChain,
                metadata: presetData.metadata,
                validation: validation
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                dspChain: null
            };
        }
    },

    // Get processor description with current parameters
    getProcessorDescription: (processor) => {
        const proc = window.DSP_PROCESSORS[processor.type];
        if (!proc) return 'Unknown processor';
        
        let description = proc.description;
        
        // Add parameter info for key parameters
        if (processor.params) {
            const keyParams = [];
            
            switch (processor.type) {
                case 'eq':
                    if (processor.params.frequency && processor.params.gain) {
                        keyParams.push(`${processor.params.frequency}Hz ${processor.params.gain > 0 ? '+' : ''}${processor.params.gain}dB`);
                    }
                    break;
                case 'compressor':
                    if (processor.params.threshold && processor.params.ratio) {
                        keyParams.push(`${processor.params.threshold}dB ${processor.params.ratio}:1`);
                    }
                    break;
                case 'hpf':
                case 'lpf':
                    if (processor.params.frequency) {
                        keyParams.push(`${processor.params.frequency}Hz`);
                    }
                    break;
            }
            
            if (keyParams.length > 0) {
                description += ` (${keyParams.join(', ')})`;
            }
        }
        
        return description;
    }
};

// Preset DSP chains for common scenarios
window.DSP_PRESETS = {
    'vocal_recording': {
        name: 'Vocal Recording',
        description: 'Optimized for vocal recording in treated rooms',
        processors: [
            { type: 'hpf', params: { frequency: 80, q: 0.707 } },
            { type: 'eq', params: { frequency: 200, gain: -2, q: 1.5 } },
            { type: 'compressor', params: { threshold: -18, ratio: 3, attack: 10, release: 100 } },
            { type: 'de_esser', params: { frequency: 6000, threshold: -25, ratio: 4 } },
            { type: 'eq', params: { frequency: 3000, gain: 1.5, q: 1 } }
        ]
    },
    'room_correction': {
        name: 'Room Correction',
        description: 'Basic room acoustic correction',
        processors: [
            { type: 'hpf', params: { frequency: 30, q: 0.5 } },
            { type: 'eq', params: { frequency: 63, gain: -3, q: 2 } },
            { type: 'eq', params: { frequency: 125, gain: -2, q: 1.5 } },
            { type: 'compressor', params: { threshold: -12, ratio: 2.5, attack: 15, release: 150 } }
        ]
    },
    'broadcast_chain': {
        name: 'Broadcast Chain',
        description: 'Professional broadcast processing',
        processors: [
            { type: 'hpf', params: { frequency: 40, q: 0.707 } },
            { type: 'gate', params: { threshold: -45, attack: 1, hold: 10, release: 100 } },
            { type: 'eq', params: { frequency: 100, gain: -1, q: 1 } },
            { type: 'multiband_compressor', params: { lowThreshold: -20, midThreshold: -15, highThreshold: -10 } },
            { type: 'de_esser', params: { frequency: 7000, threshold: -20, ratio: 6 } },
            { type: 'limiter', params: { threshold: -1, release: 5, lookahead: 3 } }
        ]
    }
};

console.log('DSP processors loaded:', Object.keys(window.DSP_PROCESSORS).length, 'processors');