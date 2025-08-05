// Mathematical Calculations for Acoustic Analysis

window.Calculations = {
    // Speed of sound calculation with temperature compensation
    speedOfSound: (temperature = 20) => {
        // v = 331.3 * sqrt(1 + T/273.15) where T is in Celsius
        return 331.3 * Math.sqrt(1 + temperature / 273.15);
    },

    // Calculate wavelength from frequency
    wavelength: (frequency, temperature = 20) => {
        const c = window.Calculations.speedOfSound(temperature);
        return c / frequency;
    },

    // Calculate room modes (axial, tangential, oblique)
    calculateRoomModes: (length, width, height, maxFreq = 300) => {
        const c = window.Calculations.speedOfSound();
        const modes = [];
        
        // Calculate for all mode combinations up to maxFreq
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
                        
                        modes.push({
                            frequency: frequency,
                            nx: nx,
                            ny: ny,
                            nz: nz,
                            type: modeType,
                            q: window.Calculations.calculateModeQ(frequency, modeType)
                        });
                    }
                }
            }
        }
        
        return modes.sort((a, b) => a.frequency - b.frequency);
    },

    // Calculate Q factor for room modes
    calculateModeQ: (frequency, modeType) => {
        // Empirical Q values based on mode type and frequency
        const baseQ = {
            'axial': 5,
            'tangential': 3,
            'oblique': 2
        };
        
        // Q increases with frequency
        const freqFactor = Math.log10(frequency / 50);
        return baseQ[modeType] * (1 + freqFactor * 0.5);
    },

    // Calculate RT60 using Sabine's formula
    sabineRT60: (volume, totalAbsorption) => {
        if (totalAbsorption <= 0) return Infinity;
        return (0.161 * volume) / totalAbsorption;
    },

    // Calculate RT60 using Eyring's formula (more accurate for highly absorptive rooms)
    eyringRT60: (volume, totalSurfaceArea, avgAbsorption) => {
        if (avgAbsorption >= 1) return 0;
        const naturalLog = -Math.log(1 - avgAbsorption);
        return (0.161 * volume) / (totalSurfaceArea * naturalLog);
    },

    // Calculate Norris-Eyring RT60 (hybrid formula)
    norrisEyringRT60: (volume, surfaces) => {
        let totalAbsorption = 0;
        
        surfaces.forEach(surface => {
            const alpha = surface.absorption || 0.05;
            totalAbsorption += surface.area * (-Math.log(1 - alpha));
        });
        
        if (totalAbsorption <= 0) return Infinity;
        return (0.161 * volume) / totalAbsorption;
    },

    // Calculate Critical Distance
    criticalDistance: (directivity, roomConstant) => {
        // Dc = 0.057 * sqrt(Q * R)
        return 0.057 * Math.sqrt(directivity * roomConstant);
    },

    // Calculate Room Constant
    roomConstant: (totalSurfaceArea, avgAbsorption) => {
        return (avgAbsorption * totalSurfaceArea) / (1 - avgAbsorption);
    },

    // Calculate STI (Speech Transmission Index) estimation
    estimateSTI: (rt60, snr, volume) => {
        // Simplified STI calculation based on RT60 and SNR
        const optimalRT60 = Math.pow(volume, 1/3) * 0.16; // Approximate optimal RT60
        const rt60Factor = Math.exp(-Math.abs(rt60 - optimalRT60) / optimalRT60);
        const snrFactor = Math.min(1, Math.max(0, (snr + 5) / 20)); // SNR factor (assumes -5 to +15 dB range)
        
        return Math.min(1, rt60Factor * snrFactor * 0.8 + 0.2);
    },

    // Calculate RASTI (Room Acoustics Speech Transmission Index)
    estimateRASTI: (rt60Octave) => {
        // RASTI calculation using octave band RT60 values
        const frequencies = [500, 1000, 2000, 4000];
        let totalMTI = 0;
        
        frequencies.forEach(freq => {
            const rt60 = rt60Octave[freq] || rt60Octave[1000] || 1.0;
            const mti = 1 / (1 + 0.13 * rt60 * Math.sqrt(freq / 1000));
            totalMTI += mti;
        });
        
        return totalMTI / frequencies.length;
    },

    // Calculate D50 (Definition/Deutlichkeit)
    calculateD50: (impulseResponse, sampleRate) => {
        // D50 = energy in first 50ms / total energy
        const ms50Samples = Math.floor(0.05 * sampleRate);
        let early = 0, total = 0;
        
        for (let i = 0; i < impulseResponse.length; i++) {
            const energy = impulseResponse[i] * impulseResponse[i];
            total += energy;
            if (i < ms50Samples) early += energy;
        }
        
        return total > 0 ? early / total : 0;
    },

    // Calculate C80 (Clarity)
    calculateC80: (impulseResponse, sampleRate) => {
        // C80 = 10 * log10(early energy / late energy)
        const ms80Samples = Math.floor(0.08 * sampleRate);
        let early = 0, late = 0;
        
        for (let i = 0; i < impulseResponse.length; i++) {
            const energy = impulseResponse[i] * impulseResponse[i];
            if (i < ms80Samples) {
                early += energy;
            } else {
                late += energy;
            }
        }
        
        return late > 0 ? 10 * Math.log10(early / late) : Infinity;
    },

    // Calculate EDT (Early Decay Time)
    calculateEDT: (impulseResponse, sampleRate) => {
        // EDT is derived from first 10dB of decay
        const energyDecay = window.Calculations.calculateEnergyDecay(impulseResponse, sampleRate);
        
        const maxEnergy = Math.max(...energyDecay);
        const db10Point = maxEnergy - 10;
        
        let t10 = -1;
        for (let i = 0; i < energyDecay.length; i++) {
            if (energyDecay[i] <= db10Point) {
                t10 = i * 0.01; // 10ms blocks
                break;
            }
        }
        
        return t10 > 0 ? t10 * 6 : 0; // Extrapolate to 60dB
    },

    // Calculate energy decay curve
    calculateEnergyDecay: (impulseResponse, sampleRate, blockSize = null) => {
        blockSize = blockSize || Math.floor(sampleRate * 0.01); // 10ms default
        const energyDecay = [];
        
        for (let i = 0; i < impulseResponse.length - blockSize; i += blockSize) {
            let energy = 0;
            for (let j = 0; j < blockSize; j++) {
                energy += impulseResponse[i + j] * impulseResponse[i + j];
            }
            energyDecay.push(10 * Math.log10(energy + 1e-10));
        }
        
        return energyDecay;
    },

    // Calculate frequency response from impulse response
    impulseToFrequencyResponse: (impulseResponse, sampleRate, fftSize = 2048) => {
        // Zero-pad or truncate to fftSize
        const paddedResponse = new Float32Array(fftSize);
        const copyLength = Math.min(impulseResponse.length, fftSize);
        
        for (let i = 0; i < copyLength; i++) {
            paddedResponse[i] = impulseResponse[i];
        }
        
        // Apply window function
        const windowed = window.AudioUtils.applyWindow(paddedResponse, 'hann');
        
        // Perform FFT (simplified - would need actual FFT implementation)
        // This is a placeholder for FFT calculation
        const frequencyResponse = [];
        const nyquist = sampleRate / 2;
        
        for (let i = 0; i < fftSize / 2; i++) {
            const frequency = (i * nyquist) / (fftSize / 2);
            // Placeholder magnitude calculation
            const magnitude = Math.random() * 20 - 10; // This would be actual FFT result
            
            frequencyResponse.push({
                frequency: frequency,
                magnitude: magnitude,
                phase: 0 // Phase would also come from FFT
            });
        }
        
        return frequencyResponse;
    },

    // Calculate absorption from reflection coefficient
    absorptionFromReflection: (reflectionCoeff) => {
        return 1 - (reflectionCoeff * reflectionCoeff);
    },

    // Calculate reflection coefficient from absorption
    reflectionFromAbsorption: (absorption) => {
        return Math.sqrt(1 - Math.max(0, Math.min(1, absorption)));
    },

    // Calculate NRC (Noise Reduction Coefficient)
    calculateNRC: (absorptionCoeffs) => {
        const frequencies = [250, 500, 1000, 2000];
        let sum = 0;
        
        frequencies.forEach(freq => {
            sum += absorptionCoeffs[freq] || 0;
        });
        
        return Math.round((sum / frequencies.length) * 20) / 20; // Round to nearest 0.05
    },

    // Calculate SAA (Sound Absorption Average)
    calculateSAA: (absorptionCoeffs) => {
        const frequencies = [200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500];
        let sum = 0;
        let count = 0;
        
        frequencies.forEach(freq => {
            if (absorptionCoeffs[freq] !== undefined) {
                sum += absorptionCoeffs[freq];
                count++;
            }
        });
        
        return count > 0 ? Math.round((sum / count) * 100) / 100 : 0;
    },

    // Calculate sound level from multiple sources
    addSoundLevels: (levels) => {
        let totalLinear = 0;
        levels.forEach(level => {
            totalLinear += Math.pow(10, level / 10);
        });
        return 10 * Math.log10(totalLinear);
    },

    // Calculate A-weighted sound level
    aWeighting: (frequency) => {
        const f = frequency;
        const f2 = f * f;
        const f4 = f2 * f2;
        
        const numerator = 12194 * 12194 * f4;
        const denominator = (f2 + 20.6 * 20.6) * 
                          Math.sqrt((f2 + 107.7 * 107.7) * (f2 + 737.9 * 737.9)) * 
                          (f2 + 12194 * 12194);
        
        const ra = numerator / denominator;
        return 20 * Math.log10(ra) + 2.00;
    },

    // Calculate octave band center frequencies
    octaveBandCenters: (startFreq = 31.5, octaves = 10) => {
        const centers = [];
        let freq = startFreq;
        
        for (let i = 0; i < octaves; i++) {
            centers.push(freq);
            freq *= 2; // Next octave
        }
        
        return centers;
    },

    // Calculate third-octave band center frequencies
    thirdOctaveBandCenters: (startFreq = 25, bands = 30) => {
        const centers = [];
        let freq = startFreq;
        
        for (let i = 0; i < bands; i++) {
            centers.push(Math.round(freq * 10) / 10);
            freq *= Math.pow(2, 1/3); // Next third-octave
        }
        
        return centers;
    },

    // Calculate psychoacoustic metrics
    calculateLoudness: (spectrum) => {
        // Simplified loudness calculation using Bark scale
        let totalLoudness = 0;
        
        spectrum.forEach(bin => {
            const bark = window.FrequencyUtils.hzToBark(bin.frequency);
            const intensity = Math.pow(10, bin.dbSPL / 10);
            
            // Simplified loudness function
            const loudness = Math.pow(intensity / 1e-12, 0.23);
            totalLoudness += loudness;
        });
        
        return totalLoudness;
    },

    // Calculate sharpness (psychoacoustic)
    calculateSharpness: (spectrum) => {
        let weightedSum = 0;
        let totalSum = 0;
        
        spectrum.forEach(bin => {
            const bark = window.FrequencyUtils.hzToBark(bin.frequency);
            const intensity = Math.pow(10, bin.dbSPL / 10);
            
            // Sharpness weighting function
            let weight = 1;
            if (bark > 15.8) {
                weight = 0.066 * Math.exp(0.171 * bark);
            }
            
            weightedSum += intensity * weight;
            totalSum += intensity;
        });
        
        return totalSum > 0 ? 0.11 * (weightedSum / totalSum) : 0;
    },

    // Calculate roughness (psychoacoustic)
    calculateRoughness: (spectrum) => {
        let totalRoughness = 0;
        
        for (let i = 1; i < spectrum.length; i++) {
            const f1 = spectrum[i - 1].frequency;
            const f2 = spectrum[i].frequency;
            const i1 = Math.pow(10, spectrum[i - 1].dbSPL / 10);
            const i2 = Math.pow(10, spectrum[i].dbSPL / 10);
            
            const deltaF = f2 - f1;
            const avgIntensity = (i1 + i2) / 2;
            
            // Roughness calculation based on beating frequency
            if (deltaF > 0 && deltaF < 300) {
                const roughness = avgIntensity * Math.exp(-deltaF / 70);
                totalRoughness += roughness;
            }
        }
        
        return totalRoughness * 0.01;
    },

    // Calculate STI from impulse response
    calculateSTI: (impulseResponse, sampleRate) => {
        // Modulation Transfer Function calculation
        const modulationFreqs = [0.63, 0.8, 1.0, 1.25, 1.6, 2.0, 2.5, 3.15, 4.0, 5.0, 6.3, 8.0, 10.0, 12.5];
        const octaveBands = [125, 250, 500, 1000, 2000, 4000, 8000];
        
        let totalMTI = 0;
        let bandCount = 0;
        
        octaveBands.forEach(centerFreq => {
            modulationFreqs.forEach(modFreq => {
                // Calculate MTF for this band and modulation frequency
                const mtf = window.Calculations.calculateMTF(impulseResponse, sampleRate, modFreq);
                const mti = mtf / (1 + mtf);
                
                totalMTI += mti;
                bandCount++;
            });
        });
        
        return bandCount > 0 ? totalMTI / bandCount : 0;
    },

    // Calculate Modulation Transfer Function
    calculateMTF: (impulseResponse, sampleRate, modulationFreq) => {
        // Simplified MTF calculation
        const blockSize = Math.floor(sampleRate / modulationFreq);
        let correlation = 0;
        let energy = 0;
        
        for (let i = 0; i < impulseResponse.length - blockSize; i++) {
            const sample1 = impulseResponse[i];
            const sample2 = impulseResponse[i + blockSize];
            
            correlation += sample1 * sample2;
            energy += sample1 * sample1;
        }
        
        return energy > 0 ? Math.abs(correlation) / energy : 0;
    },

    // Calculate IACC (Interaural Cross-Correlation)
    calculateIACC: (leftChannel, rightChannel) => {
        if (leftChannel.length !== rightChannel.length) {
            throw new Error('Channels must have equal length');
        }
        
        let maxCorrelation = 0;
        const maxDelay = Math.floor(leftChannel.length * 0.001); // 1ms max delay
        
        for (let delay = -maxDelay; delay <= maxDelay; delay++) {
            let correlation = 0;
            let leftEnergy = 0;
            let rightEnergy = 0;
            
            const start = Math.max(0, delay);
            const end = Math.min(leftChannel.length, leftChannel.length + delay);
            
            for (let i = start; i < end; i++) {
                const leftIdx = i;
                const rightIdx = i - delay;
                
                if (rightIdx >= 0 && rightIdx < rightChannel.length) {
                    const left = leftChannel[leftIdx];
                    const right = rightChannel[rightIdx];
                    
                    correlation += left * right;
                    leftEnergy += left * left;
                    rightEnergy += right * right;
                }
            }
            
            const normalizedCorr = correlation / Math.sqrt(leftEnergy * rightEnergy);
            maxCorrelation = Math.max(maxCorrelation, Math.abs(normalizedCorr));
        }
        
        return maxCorrelation;
    },

    // Calculate early/late energy ratio
    calculateEarlyLateRatio: (impulseResponse, sampleRate, earlyTime = 0.08) => {
        const earlysamples = Math.floor(earlyTime * sampleRate);
        let earlyEnergy = 0;
        let lateEnergy = 0;
        
        for (let i = 0; i < impulseResponse.length; i++) {
            const energy = impulseResponse[i] * impulseResponse[i];
            
            if (i < earlysamples) {
                earlyEnergy += energy;
            } else {
                lateEnergy += energy;
            }
        }
        
        return lateEnergy > 0 ? 10 * Math.log10(earlyEnergy / lateEnergy) : Infinity;
    },

    // Calculate G (Strength/Loudness)
    calculateStrength: (impulseResponse, referenceEnergy) => {
        let totalEnergy = 0;
        
        for (let i = 0; i < impulseResponse.length; i++) {
            totalEnergy += impulseResponse[i] * impulseResponse[i];
        }
        
        return referenceEnergy > 0 ? 10 * Math.log10(totalEnergy / referenceEnergy) : 0;
    },

    // Calculate apparent source width (ASW)
    calculateASW: (impulseResponse, sampleRate) => {
        // Based on IACC in first 80ms
        const ms80Samples = Math.floor(0.08 * sampleRate);
        const early = impulseResponse.slice(0, ms80Samples);
        
        // Simplified ASW calculation
        let asw = 0;
        for (let i = 1; i < early.length; i++) {
            asw += Math.abs(early[i] - early[i-1]);
        }
        
        return asw / early.length;
    },

    // Calculate listener envelopment (LEV)
    calculateLEV: (impulseResponse, sampleRate) => {
        // Based on late arriving sound (after 80ms)
        const ms80Samples = Math.floor(0.08 * sampleRate);
        const late = impulseResponse.slice(ms80Samples);
        
        let lev = 0;
        for (let i = 0; i < late.length; i++) {
            lev += late[i] * late[i];
        }
        
        return 10 * Math.log10(lev / late.length + 1e-10);
    },

    // Statistical analysis functions
    mean: (values) => {
        return values.reduce((sum, val) => sum + val, 0) / values.length;
    },

    standardDeviation: (values) => {
        const avg = window.Calculations.mean(values);
        const squaredDiffs = values.map(val => (val - avg) ** 2);
        return Math.sqrt(window.Calculations.mean(squaredDiffs));
    },

    percentile: (values, p) => {
        const sorted = [...values].sort((a, b) => a - b);
        const index = (p / 100) * (sorted.length - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        
        if (lower === upper) {
            return sorted[lower];
        }
        
        const weight = index - lower;
        return sorted[lower] * (1 - weight) + sorted[upper] * weight;
    },

    // Interpolation functions
    linearInterpolation: (x0, y0, x1, y1, x) => {
        return y0 + (y1 - y0) * ((x - x0) / (x1 - x0));
    },

    logInterpolation: (x0, y0, x1, y1, x) => {
        const logX0 = Math.log10(x0);
        const logX1 = Math.log10(x1);
        const logX = Math.log10(x);
        
        return y0 + (y1 - y0) * ((logX - logX0) / (logX1 - logX0));
    },

    // Digital filter design helpers
    butterworthLowpass: (frequency, sampleRate, order = 2) => {
        const nyquist = sampleRate / 2;
        const normalizedFreq = frequency / nyquist;
        
        // Simplified Butterworth coefficients (2nd order)
        const w = Math.tan((Math.PI * normalizedFreq) / 2);
        const w2 = w * w;
        const sqrt2 = Math.sqrt(2);
        
        const denominator = 1 + sqrt2 * w + w2;
        
        return {
            b0: w2 / denominator,
            b1: 2 * w2 / denominator,
            b2: w2 / denominator,
            a1: (2 * (w2 - 1)) / denominator,
            a2: (1 - sqrt2 * w + w2) / denominator
        };
    },

    butterworthHighpass: (frequency, sampleRate, order = 2) => {
        const nyquist = sampleRate / 2;
        const normalizedFreq = frequency / nyquist;
        
        const w = Math.tan((Math.PI * normalizedFreq) / 2);
        const w2 = w * w;
        const sqrt2 = Math.sqrt(2);
        
        const denominator = 1 + sqrt2 * w + w2;
        
        return {
            b0: 1 / denominator,
            b1: -2 / denominator,
            b2: 1 / denominator,
            a1: (2 * (w2 - 1)) / denominator,
            a2: (1 - sqrt2 * w + w2) / denominator
        };
    },

    // Frequency response calculation
    calculateFilterResponse: (coeffs, frequency, sampleRate) => {
        const omega = 2 * Math.PI * frequency / sampleRate;
        const cosOmega = Math.cos(omega);
        const sinOmega = Math.sin(omega);
        const cos2Omega = Math.cos(2 * omega);
        const sin2Omega = Math.sin(2 * omega);
        
        // Calculate numerator and denominator
        const numReal = coeffs.b0 + coeffs.b1 * cosOmega + coeffs.b2 * cos2Omega;
        const numImag = -coeffs.b1 * sinOmega - coeffs.b2 * sin2Omega;
        
        const denReal = 1 + coeffs.a1 * cosOmega + coeffs.a2 * cos2Omega;
        const denImag = -coeffs.a1 * sinOmega - coeffs.a2 * sin2Omega;
        
        // Calculate magnitude and phase
        const numMag = Math.sqrt(numReal * numReal + numImag * numImag);
        const denMag = Math.sqrt(denReal * denReal + denImag * denImag);
        
        const magnitude = 20 * Math.log10(numMag / denMag);
        const phase = Math.atan2(numImag, numReal) - Math.atan2(denImag, denReal);
        
        return { magnitude, phase };
    },

    // Room dimension optimization
    optimizeRoomDimensions: (volume, constraints = {}) => {
        const ratios = [
            { name: 'Golden Ratio', ratios: [1.0, 1.618, 2.618] },
            { name: 'Louden', ratios: [1.0, 1.4, 1.9] },
            { name: 'Volkmann', ratios: [1.0, 1.5, 2.5] },
            { name: 'EBU Tech 3276', ratios: [1.0, 1.6, 2.33] }
        ];
        
        const recommendations = [];
        
        ratios.forEach(ratio => {
            // Calculate dimensions based on volume and ratios
            const factor = Math.pow(volume / (ratio.ratios[0] * ratio.ratios[1] * ratio.ratios[2]), 1/3);
            
            const dimensions = {
                width: factor * ratio.ratios[0],
                height: factor * ratio.ratios[1], 
                depth: factor * ratio.ratios[2]
            };
            
            // Check constraints
            let valid = true;
            if (constraints.maxWidth && dimensions.width > constraints.maxWidth) valid = false;
            if (constraints.maxHeight && dimensions.height > constraints.maxHeight) valid = false;
            if (constraints.maxDepth && dimensions.depth > constraints.maxDepth) valid = false;
            if (constraints.minWidth && dimensions.width < constraints.minWidth) valid = false;
            if (constraints.minHeight && dimensions.height < constraints.minHeight) valid = false;
            if (constraints.minDepth && dimensions.depth < constraints.minDepth) valid = false;
            
            if (valid) {
                recommendations.push({
                    name: ratio.name,
                    dimensions: dimensions,
                    ratios: ratio.ratios,
                    volume: dimensions.width * dimensions.height * dimensions.depth
                });
            }
        });
        
        return recommendations;
    },

    // Convert between units
    meterToFeet: (meters) => meters * 3.28084,
    feetToMeter: (feet) => feet / 3.28084,
    celsiusToFahrenheit: (celsius) => (celsius * 9/5) + 32,
    fahrenheitToCelsius: (fahrenheit) => (fahrenheit - 32) * 5/9,
    
    // Format numbers for display
    formatFrequency: (freq) => {
        if (freq >= 1000) {
            return `${(freq/1000).toFixed(1)}k`;
        }
        return freq.toFixed(0);
    },
    
    formatDecibel: (db) => `${db.toFixed(1)} dB`,
    formatTime: (seconds) => `${seconds.toFixed(2)} s`,
    formatDimension: (meters) => `${meters.toFixed(2)} m`
};

console.log('Calculations loaded with', Object.keys(window.Calculations).length, 'functions');