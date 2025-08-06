// File: src/utils/audio-utils.js
// CORRECTED VERSION

import { FrequencyUtils, EQ_FREQUENCIES, PINK_NOISE_REFERENCE } from '../constants/frequencies.js';

export const AudioUtils = {
    createAudioContext: () => {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) throw new Error('Web Audio API not supported');
        // This was the typo, it should be new AudioContext()
        return new AudioContext(); 
    },

    ensureAudioResumed: async (audioContext) => {
        if (audioContext && audioContext.state === 'suspended') {
            await audioContext.resume();
        }
    },

    createAnalyser: (audioContext, fftSize = 2048) => {
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = fftSize;
        analyser.smoothingTimeConstant = 0.8;
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;
        return analyser;
    },

    generatePinkNoise: (audioContext, duration = 5) => {
        const sampleRate = audioContext.sampleRate;
        const bufferSize = sampleRate * duration;
        const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
        const channelData = buffer.getChannelData(0);
        
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            channelData[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            b6 = white * 0.115926;
            channelData[i] *= 0.11;
        }
        
        return buffer;
    },

    calculateRMS: (audioBuffer, channel = 0) => {
        const channelData = audioBuffer.getChannelData(channel);
        let sum = 0;
        for (let i = 0; i < channelData.length; i++) {
            sum += channelData[i] * channelData[i];
        }
        const rms = Math.sqrt(sum / channelData.length);
        return 20 * Math.log10(rms + 1e-10);
    },

    calculatePeak: (audioBuffer, channel = 0) => {
        const channelData = audioBuffer.getChannelData(channel);
        let peak = 0;
        for (let i = 0; i < channelData.length; i++) {
            peak = Math.max(peak, Math.abs(channelData[i]));
        }
        return peak > 0 ? 20 * Math.log10(peak) : -Infinity;
    },

    analyzeAudioBuffer: async (audioBuffer) => {
        const offlineCtx = new OfflineAudioContext(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);
        const source = offlineCtx.createBufferSource();
        source.buffer = audioBuffer;
        
        const analyser = offlineCtx.createAnalyser();
        analyser.fftSize = 8192;
        source.connect(analyser);
        source.start();
        
        await offlineCtx.startRendering();
        
        const dataArray = new Float32Array(analyser.frequencyBinCount);
        analyser.getFloatFrequencyData(dataArray);

        const frequencyResponse = EQ_FREQUENCIES.map(freq => {
            const bin = FrequencyUtils.getFrequencyBin(freq, audioBuffer.sampleRate, analyser.fftSize);
            const dbSPL = (dataArray[bin] || -140) + 94;
            const reference = PINK_NOISE_REFERENCE[freq] || 70;
            return { frequency: freq, dbSPL, deviation: dbSPL - reference };
        });

        return {
            duration: audioBuffer.duration,
            sampleRate: audioBuffer.sampleRate,
            peakLevel: AudioUtils.calculatePeak(audioBuffer),
            rmsLevel: AudioUtils.calculateRMS(audioBuffer),
            frequencyResponse,
        };
    },
};