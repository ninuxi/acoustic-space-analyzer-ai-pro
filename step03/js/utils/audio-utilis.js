// Audio Processing Utilities

// Initialize Audio Context with optimal settings
const initializeAudioContext = async () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext({
            sampleRate: 48000,
            latencyHint: 'interactive'
        });

        // Resume context if suspended (required by some browsers)
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        return audioContext;
    } catch (error) {
        console.error('Failed to initialize audio context:', error);
        throw new Error('Audio not supported in this browser');
    }
};

// Request microphone access with optimized settings
const requestMicrophoneAccess = async () => {
    try {
        const constraints = {
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false,
                sampleRate: 48000,
                channelCount: 1,
                latency: 0
            }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        return stream;
    } catch (error) {
        console.error('Microphone access error:', error);
        
        const errorMessages = {
            'NotAllowedError': 'Microphone permission denied. Please allow access and try again.',
            'NotFoundError': 'No microphone found. Please check your audio devices.',
            'NotReadableError': 'Microphone is being used by another application.',
            'OverconstrainedError': 'Microphone constraints not supported.',
            'TypeError': 'Browser does not support microphone access.'
        };

        throw new Error(errorMessages[error.name] || `Microphone error: ${error.message}`);
    }
};

// Create analyzer with high-resolution settings
const createAnalyzer = (audioContext) => {
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 16384; // High resolution FFT (8192 frequency bins)
    analyzer.smoothingTimeConstant = 0.1; // Minimal smoothing for real-time response
    analyzer.minDecibels = -120;
    analyzer.maxDecibels = 0;
    
    return analyzer;
};

// Perform detailed FFT analysis
const performFFTAnalysis = (analyzer, audioContext) => {
    if (!analyzer || !audioContext) return null;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const floatArray = new Float32Array(bufferLength);
    
    analyzer.getByteFrequencyData(dataArray);
    analyzer.getFloatFrequencyData(floatArray);
    
    const sampleRate = audioContext.sampleRate;
    const nyquist = sampleRate / 2;
    
    // Calculate frequency data for EQ bands
    const frequencyData = EQ_FREQUENCIES.map(freq => {
        const binIndex = Math.round((freq / nyquist) * bufferLength);
        const amplitude = dataArray[binIndex] || 0;
        const dbFS = floatArray[binIndex] || -Infinity;
        
        // Convert to approximate SPL (assuming calibrated system)
        const dbSPL = dbFS + 94; // Rough calibration offset
        
        // Calculate deviation from pink noise reference
        const reference = PINK_NOISE_REFERENCE[freq] || 70;
        const deviation = dbSPL - reference;
        
        return {
            frequency: freq,
            amplitude: amplitude,
            dbFS: dbFS,
            dbSPL: Math.max(-120, dbSPL), // Clamp to reasonable range
            deviation: isFinite(deviation) ? deviation : 0,
            reference: reference,
            binIndex: binIndex
        };
    });
    
    // Calculate overall metrics
    const rms = Math.sqrt(dataArray.reduce((sum, val) => sum + Math.pow(val/255, 2), 0) / bufferLength);
    const dbRMS = 20 * Math.log10(rms + 1e-10);
    const peakLevel = Math.max(...dataArray);
    const crestFactor = peakLevel / (rms * 255 + 1e-10);
    
    // Calculate THD+N estimation
    const fundamentalBins = EQ_FREQUENCIES.slice(2, 10).map(freq => 
        Math.round((freq / nyquist) * bufferLength)
    );
    const harmonicEnergy = fundamentalBins.reduce((sum, bin) => 
        sum + Math.pow(dataArray[bin] / 255, 2), 0
    );
    const totalEnergy = dataArray.reduce((sum, val) => sum + Math.pow(val / 255, 2), 0);
    const thdPlusN = Math.sqrt(harmonicEnergy / (totalEnergy + 1e-10)) * 100;
    
    return {
        timestamp: Date.now(),
        frequencyResponse: frequencyData,
        rms: rms,
        dbRMS: dbRMS,
        peakLevel: peakLevel,
        crestFactor: crestFactor,
        thdPlusN: thdPlusN,
        sampleRate: sampleRate,
        fftSize: analyzer.fftSize
    };
};

// Calculate octave band analysis
const calculateOctaveBands = (frequencyData) => {
    const octaveBands = {};
    
    OCTAVE_BANDS.forEach(centerFreq => {
        const lowerFreq = centerFreq / Math.sqrt(2);
        const upperFreq = centerFreq * Math.sqrt(2);
        
        const bandsInRange = frequencyData.filter(data => 
            data.frequency >= lowerFreq && data.frequency <= upperFreq
        );
        
        if (bandsInRange.length > 0) {
            const avgLevel = bandsInRange.reduce((sum, band) => sum + band.dbSPL, 0) / bandsInRange.length;
            const avgDeviation = bandsInRange.reduce((sum, band) => sum + band.deviation, 0) / bandsInRange.length;
            
            octaveBands[centerFreq] = {
                frequency: centerFreq,
                level: avgLevel,
                deviation: avgDeviation,
                bandCount: bandsInRange.length
            };
        }
    });
    
    return octaveBands;
};

// Generate pink noise for testing (Web Audio API)
const generatePinkNoise = (audioContext, duration = 5) => {
    const sampleRate = audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = audioContext.createBuffer(1, length, sampleRate);
    const output = buffer.getChannelData(0);
    
    // Pink noise generation using Paul Kellet's algorithm
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    
    for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
    }
    
    return buffer;
};

// Play pink noise through audio output
const playPinkNoise = async (audioContext, duration = 15, volume = 0.3) => {
    try {
        const buffer = generatePinkNoise(audioContext, duration);
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();
        
        source.buffer = buffer;
        gainNode.gain.value = volume;
        
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        source.start();
        
        return new Promise((resolve) => {
            source.onended = resolve;
            setTimeout(resolve, duration * 1000 + 100); // Fallback timeout
        });
    } catch (error) {
        console.error('Pink noise generation error:', error);
        throw error;
    }
};

// Calculate room acoustics metrics
const calculateRoomMetrics = (analysisData, spatialData) => {
    if (!analysisData || !spatialData) return null;
    
    const { volume, surfaceArea } = spatialData;
    
    // Calculate average levels per frequency band
    const avgLevels = {};
    EQ_FREQUENCIES.forEach(freq => {
        const samples = analysisData
            .map(sample => sample.frequencyResponse.find(f => f.frequency === freq))
            .filter(Boolean);
        
        if (samples.length > 0) {
            avgLevels[freq] = samples.reduce((sum, s) => sum + s.dbSPL, 0) / samples.length;
        }
    });
    
    // Estimate RT60 using simplified Sabine equation
    const estimatedRT60 = {};
    OCTAVE_BANDS.forEach(freq => {
        // Estimate absorption coefficient from level measurements
        const level = avgLevels[freq] || 60;
        const reference = PINK_NOISE_REFERENCE[freq] || 70;
        const levelDiff = level - reference;
        
        // Rough estimation: higher levels suggest more reflection (less absorption)
        const estimatedAbsorption = Math.max(0.05, Math.min(0.95, 0.3 - (levelDiff / 30)));
        const totalAbsorption = estimatedAbsorption * surfaceArea;
        
        // Sabine equation: RT60 = 0.161 * V / A
        estimatedRT60[freq] = (0.161 * volume) / Math.max(totalAbsorption, 0.1);
    });
    
    // Calculate average RT60
    const avgRT60 = Object.values(estimatedRT60).reduce((a, b) => a + b, 0) / Object.values(estimatedRT60).length;
    
    // Calculate clarity metrics
    const clarity = {};
    EQ_FREQUENCIES.forEach(freq => {
        const level = avgLevels[freq] || 60;
        const reference = PINK_NOISE_REFERENCE[freq] || 70;
        clarity[freq] = level - reference; // C50 approximation
    });
    
    return {
        avgLevels,
        estimatedRT60,
        avgRT60,
        clarity,
        volume,
        surfaceArea,
        vsRatio: volume / surfaceArea
    };
};

// Audio format validation
const validateAudioFormat = (file) => {
    const supportedFormats = ['.wav', '.mp3', '.m4a', '.flac', '.ogg'];
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    
    return supportedFormats.includes(fileExtension);
};

// Export audio data to WAV format
const exportToWAV = (audioBuffer) => {
    const length = audioBuffer.length;
    const sampleRate = audioBuffer.sampleRate;
    const buffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);
    
    // Convert audio data
    const channelData = audioBuffer.getChannelData(0);
    let offset = 44;
    for (let i = 0; i < length; i++) {
        const sample = Math.max(-1, Math.min(1, channelData[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
    }
    
    return new Blob([buffer], { type: 'audio/wav' });
};