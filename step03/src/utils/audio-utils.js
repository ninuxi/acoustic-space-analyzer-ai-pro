// Audio Utilities for Web Audio API

window.AudioUtils = {
    // Initialize audio context with proper compatibility
    createAudioContext: () => {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
            throw new Error('Web Audio API not supported');
        }
        return new AudioContext();
    },

    // Get user media with constraints
    getUserMedia: async (constraints = { audio: true }) => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('getUserMedia not supported');
        }
        
        const defaultConstraints = {
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false,
                sampleRate: 48000,
                channelCount: 2
            }
        };
        
        const mergedConstraints = { ...defaultConstraints, ...constraints };
        return await navigator.mediaDevices.getUserMedia(mergedConstraints);
    },

    // Create analyser node with optimal settings
    createAnalyser: (audioContext, fftSize = 2048) => {
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = fftSize;
        analyser.smoothingTimeConstant = 0.8;
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;
        return analyser;
    },

    // Generate pink noise for room analysis
    generatePinkNoise: (audioContext, duration = 15) => {
        const sampleRate = audioContext.sampleRate;
        const bufferSize = sampleRate * duration;
        const buffer = audioContext.createBuffer(2, bufferSize, sampleRate);
        
        // Pink noise generation using Gardner method
        for (let channel = 0; channel < 2; channel++) {
            const channelData = buffer.getChannelData(channel);
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                
                const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                b6 = white * 0.115926;
                
                channelData[i] = pink * 0.11; // Normalize
            }
        }
        
        return buffer;
    },

    // Generate white noise
    generateWhiteNoise: (audioContext, duration = 5) => {
        const sampleRate = audioContext.sampleRate;
        const bufferSize = sampleRate * duration;
        const buffer = audioContext.createBuffer(2, bufferSize, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < bufferSize; i++) {
                channelData[i] = (Math.random() * 2 - 1) * 0.1;
            }
        }
        
        return buffer;
    },

    // Generate sine wave test tone
    generateSineWave: (audioContext, frequency, duration = 1, amplitude = 0.1) => {
        const sampleRate = audioContext.sampleRate;
        const bufferSize = sampleRate * duration;
        const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
        const channelData = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            channelData[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * amplitude;
        }
        
        return buffer;
    },

    // Generate frequency sweep (chirp)
    generateSweep: (audioContext, startFreq, endFreq, duration = 10) => {
        const sampleRate = audioContext.sampleRate;
        const bufferSize = sampleRate * duration;
        const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
        const channelData = buffer.getChannelData(0);
        
        const k = (endFreq - startFreq) / duration;
        
        for (let i = 0; i < bufferSize; i++) {
            const t = i / sampleRate;
            const instantFreq = startFreq + k * t;
            const phase = 2 * Math.PI * (startFreq * t + 0.5 * k * t * t);
            channelData[i] = Math.sin(phase) * 0.1;
        }
        
        return buffer;
    },

    // Analyze frequency spectrum
    analyzeSpectrum: (analyser) => {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        
        const sampleRate = analyser.context.sampleRate;
        const nyquist = sampleRate / 2;
        const spectrum = [];
        
        for (let i = 0; i < bufferLength; i++) {
            const frequency = (i * nyquist) / bufferLength;
            const magnitude = dataArray[i];
            const dbSPL = magnitude > 0 ? 20 * Math.log10(magnitude / 255) + 90 : -90;
            
            spectrum.push({
                frequency: Math.round(frequency),
                magnitude: magnitude,
                dbSPL: Math.max(-90, dbSPL)
            });
        }
        
        return spectrum;
    },

    // Calculate RMS level
    calculateRMS: (audioBuffer, channel = 0) => {
        const channelData = audioBuffer.getChannelData(channel);
        let sum = 0;
        
        for (let i = 0; i < channelData.length; i++) {
            sum += channelData[i] * channelData[i];
        }
        
        const rms = Math.sqrt(sum / channelData.length);
        return 20 * Math.log10(rms + 1e-10); // Convert to dB, avoid log(0)
    },

    // Calculate peak level
    calculatePeak: (audioBuffer, channel = 0) => {
        const channelData = audioBuffer.getChannelData(channel);
        let peak = 0;
        
        for (let i = 0; i < channelData.length; i++) {
            peak = Math.max(peak, Math.abs(channelData[i]));
        }
        
        return peak > 0 ? 20 * Math.log10(peak) : -Infinity;
    },

    // Calculate THD+N (Total Harmonic Distortion + Noise)
    calculateTHDN: (spectrum, fundamentalFreq) => {
        const fundamental = spectrum.find(bin => 
            Math.abs(bin.frequency - fundamentalFreq) < 10
        );
        
        if (!fundamental) return 0;
        
        const fundamentalPower = Math.pow(10, fundamental.dbSPL / 10);
        let harmonicPower = 0;
        
        // Check harmonics up to 10th
        for (let harmonic = 2; harmonic <= 10; harmonic++) {
            const harmonicFreq = fundamentalFreq * harmonic;
            const harmonicBin = spectrum.find(bin => 
                Math.abs(bin.frequency - harmonicFreq) < 20
            );
            
            if (harmonicBin && harmonicBin.frequency < 20000) {
                harmonicPower += Math.pow(10, harmonicBin.dbSPL / 10);
            }
        }
        
        return harmonicPower > 0 ? Math.sqrt(harmonicPower / fundamentalPower) * 100 : 0;
    },

    // Apply window function
    applyWindow: (data, windowType = 'hann') => {
        const windowed = new Float32Array(data.length);
        
        switch (windowType) {
            case 'hann':
                for (let i = 0; i < data.length; i++) {
                    const windowValue = 0.5 * (1 - Math.cos(2 * Math.PI * i / (data.length - 1)));
                    windowed[i] = data[i] * windowValue;
                }
                break;
                
            case 'hamming':
                for (let i = 0; i < data.length; i++) {
                    const windowValue = 0.54 - 0.46 * Math.cos(2 * Math.PI * i / (data.length - 1));
                    windowed[i] = data[i] * windowValue;
                }
                break;
                
            case 'blackman':
                for (let i = 0; i < data.length; i++) {
                    const windowValue = 0.42 - 0.5 * Math.cos(2 * Math.PI * i / (data.length - 1)) + 
                                      0.08 * Math.cos(4 * Math.PI * i / (data.length - 1));
                    windowed[i] = data[i] * windowValue;
                }
                break;
                
            default:
                return new Float32Array(data);
        }
        
        return windowed;
    },

    // Calculate RT60 (Reverberation Time)
    calculateRT60: (impulseResponse, sampleRate) => {
        // Energy decay curve analysis
        const energyDecay = [];
        const blockSize = Math.floor(sampleRate * 0.01); // 10ms blocks
        
        for (let i = 0; i < impulseResponse.length - blockSize; i += blockSize) {
            let energy = 0;
            for (let j = 0; j < blockSize; j++) {
                energy += impulseResponse[i + j] * impulseResponse[i + j];
            }
            energyDecay.push(10 * Math.log10(energy + 1e-10));
        }
        
        // Find -5dB and -35dB points
        const maxEnergy = Math.max(...energyDecay);
        const db5Point = maxEnergy - 5;
        const db35Point = maxEnergy - 35;
        
        let t5 = -1, t35 = -1;
        
        for (let i = 0; i < energyDecay.length; i++) {
            if (t5 === -1 && energyDecay[i] <= db5Point) t5 = i;
            if (t35 === -1 && energyDecay[i] <= db35Point) t35 = i;
        }
        
        if (t5 !== -1 && t35 !== -1 && t35 > t5) {
            const rt30 = ((t35 - t5) * blockSize / sampleRate);
            return rt30 * 2; // Extrapolate to RT60
        }
        
        return 0;
    },

    // Apply EQ curve
    applyEQCurve: (audioContext, sourceNode, eqBands) => {
        let currentNode = sourceNode;
        const filters = [];
        
        eqBands.forEach(band => {
            if (Math.abs(band.gain) > 0.1) { // Only create filter if significant gain
                const filter = audioContext.createBiquadFilter();
                
                switch (band.type || 'peaking') {
                    case 'highpass':
                        filter.type = 'highpass';
                        break;
                    case 'lowpass':
                        filter.type = 'lowpass';
                        break;
                    case 'highshelf':
                        filter.type = 'highshelf';
                        break;
                    case 'lowshelf':
                        filter.type = 'lowshelf';
                        break;
                    default:
                        filter.type = 'peaking';
                }
                
                filter.frequency.value = band.frequency;
                filter.gain.value = band.gain;
                filter.Q.value = band.q || 1;
                
                currentNode.connect(filter);
                currentNode = filter;
                filters.push(filter);
            }
        });
        
        return { outputNode: currentNode, filters };
    },

    // Create compressor with parameters
    createCompressor: (audioContext, params = {}) => {
        const compressor = audioContext.createDynamicsCompressor();
        
        compressor.threshold.value = params.threshold || -24;
        compressor.knee.value = params.knee || 30;
        compressor.ratio.value = params.ratio || 12;
        compressor.attack.value = params.attack || 0.003;
        compressor.release.value = params.release || 0.25;
        
        return compressor;
    },

    // Audio buffer utilities
    bufferToWav: (audioBuffer) => {
        const length = audioBuffer.length;
        const numberOfChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
        const view = new DataView(arrayBuffer);
        
        // WAV header
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };
        
        writeString(0, 'RIFF');
        view.setUint32(4, 36 + length * numberOfChannels * 2, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numberOfChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numberOfChannels * 2, true);
        view.setUint16(32, numberOfChannels * 2, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, length * numberOfChannels * 2, true);
        
        // Convert samples
        let offset = 44;
        for (let i = 0; i < length; i++) {
            for (let channel = 0; channel < numberOfChannels; channel++) {
                const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]));
                view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
                offset += 2;
            }
        }
        
        return arrayBuffer;
    },

    // Load audio file
    loadAudioFile: async (audioContext, file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                audioContext.decodeAudioData(e.target.result)
                    .then(resolve)
                    .catch(reject);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    },

    // Normalize audio buffer
    normalizeBuffer: (audioBuffer, targetLevel = -1) => {
        const targetLinear = Math.pow(10, targetLevel / 20);
        
        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
            const channelData = audioBuffer.getChannelData(channel);
            let peak = 0;
            
            // Find peak
            for (let i = 0; i < channelData.length; i++) {
                peak = Math.max(peak, Math.abs(channelData[i]));
            }
            
            // Normalize
            if (peak > 0) {
                const gain = targetLinear / peak;
                for (let i = 0; i < channelData.length; i++) {
                    channelData[i] *= gain;
                }
            }
        }
        
        return audioBuffer;
    },

    // Convert dB to linear
    dbToLinear: (db) => Math.pow(10, db / 20),

    // Convert linear to dB
    linearToDb: (linear) => 20 * Math.log10(Math.abs(linear) + 1e-10),

    // Check audio context state and resume if needed
    ensureAudioContextResumed: async (audioContext) => {
        if (audioContext.state === 'suspended') {
            try {
                await audioContext.resume();
                console.log('Audio context resumed');
            } catch (error) {
                console.error('Failed to resume audio context:', error);
                throw error;
            }
        }
    },

    // Create gain node with fade
    createFadeableGain: (audioContext, initialGain = 1) => {
        const gainNode = audioContext.createGain();
        gainNode.gain.value = initialGain;
        
        gainNode.fadeIn = (duration = 0.1) => {
            gainNode.gain.cancelScheduledValues(audioContext.currentTime);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(initialGain, audioContext.currentTime + duration);
        };
        
        gainNode.fadeOut = (duration = 0.1) => {
            gainNode.gain.cancelScheduledValues(audioContext.currentTime);
            gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
        };
        
        return gainNode;
    },

    // Measure latency
    measureLatency: async (audioContext) => {
        return new Promise((resolve) => {
            const bufferSize = 256;
            const oscillator = audioContext.createOscillator();
            const analyser = audioContext.createAnalyser();
            const processor = audioContext.createScriptProcessor(bufferSize, 1, 1);
            
            analyser.fftSize = bufferSize * 2;
            oscillator.frequency.value = 1000;
            
            let startTime = null;
            let detected = false;
            
            processor.onaudioprocess = (e) => {
                if (detected) return;
                
                const inputBuffer = e.inputBuffer.getChannelData(0);
                for (let i = 0; i < inputBuffer.length; i++) {
                    if (Math.abs(inputBuffer[i]) > 0.01) {
                        const latency = audioContext.currentTime - startTime;
                        detected = true;
                        oscillator.stop();
                        processor.disconnect();
                        resolve(latency * 1000); // Convert to milliseconds
                        break;
                    }
                }
            };
            
            oscillator.connect(analyser);
            analyser.connect(processor);
            processor.connect(audioContext.destination);
            
            startTime = audioContext.currentTime;
            oscillator.start();
            
            // Timeout after 1 second
            setTimeout(() => {
                if (!detected) {
                    oscillator.stop();
                    processor.disconnect();
                    resolve(null);
                }
            }, 1000);
        });
    }
};

console.log('AudioUtils loaded with', Object.keys(window.AudioUtils).length, 'functions');