// File: src/components/audio/MeasurementTool.jsx

import React, { useState, useEffect, useRef } from 'react';
import { AudioUtils } from '../../utils/audio-utils.js';
import RealTimeFFT from './RealTimeFFT.jsx';

// NOTA: Questo componente è una base per la misurazione.
// Per una vera funzione di trasferimento, il segnale di riferimento interno 
// dovrebbe essere confrontato con quello registrato.
// Questo codice imposta le basi per quel workflow.

const MeasurementTool = ({ audioContext, onMeasurementComplete }) => {
    const [isMeasuring, setIsMeasuring] = useState(false);
    const [measurementTime, setMeasurementTime] = useState(0);
    const [playbackState, setPlaybackState] = useState('stopped');
    
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const analyserRef = useRef(null); // Per la visualizzazione in tempo reale
    const timerRef = useRef(null);
    const testSignalSourceRef = useRef(null);

    const isMeasuringRef = useRef(isMeasuring);
    isMeasuringRef.current = isMeasuring;

    useEffect(() => {
        // Funzione di cleanup
        return () => {
            streamRef.current?.getTracks().forEach(track => track.stop());
            clearInterval(timerRef.current);
            testSignalSourceRef.current?.stop();
        };
    }, []);

    const generateTestSignal = async (type = 'pink_noise') => {
        if (!audioContext) return;
        await AudioUtils.ensureAudioResumed(audioContext);
        
        testSignalSourceRef.current?.stop();
        
        const source = audioContext.createBufferSource();
        // Qui in futuro potremmo generare anche un impulso
        source.buffer = AudioUtils.generatePinkNoise(audioContext, 10); // Genera 10s di rumore
        
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.2; // Livello di sicurezza per l'output
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start();
        setPlaybackState('playing');
        source.onended = () => setPlaybackState('stopped');
        testSignalSourceRef.current = source;
    };

    const startMeasurement = async () => {
        try {
            if (!audioContext) throw new Error('Audio context not available');
            
            const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }});
            streamRef.current = stream;
            
            analyserRef.current = AudioUtils.createAnalyser(audioContext, 2048);
            const sourceNode = audioContext.createMediaStreamSource(stream);
            sourceNode.connect(analyserRef.current);
            
            const mediaRecorder = new MediaRecorder(stream);
            const audioChunks = [];
            mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
            mediaRecorder.onstop = () => {
                // In un sistema completo, qui partirebbe l'analisi di confronto.
                // Per ora, passiamo i dati registrati come prima.
                const audioBlob = new Blob(audioChunks);
                onMeasurementComplete(audioBlob); 
            };
            
            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();
            setIsMeasuring(true);
            
            setMeasurementTime(0);
            timerRef.current = setInterval(() => setMeasurementTime(prev => prev + 1), 1000);

            setTimeout(() => {
                if (isMeasuringRef.current) stopMeasurement();
            }, 15000); // Durata fissa di 15 secondi

        } catch (error) {
            alert(`Measurement failed: ${error.message}`);
            setIsMeasuring(false);
        }
    };

    const stopMeasurement = () => {
        mediaRecorderRef.current?.stop();
        streamRef.current?.getTracks().forEach(track => track.stop());
        clearInterval(timerRef.current);
        setIsMeasuring(false);
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold gradient-text mb-2">Acoustic Measurement</h2>
                <p className="text-gray-600 text-lg">Measure the response of your sound system in the acoustic space.</p>
            </div>

            <div className="card bg-white border border-gray-200">
                <div className="card-body text-center space-y-6">
                    <RealTimeFFT analyserNode={analyserRef.current} />

                    {isMeasuring && (
                        <div className="text-3xl font-mono text-purple-600">
                            {`Measuring... ${measurementTime}s / 15s`}
                        </div>
                    )}

                    <div className="p-4 bg-gray-50 rounded-lg border">
                        <h4 className="font-semibold text-gray-800">Professional Workflow</h4>
                        <div className="flex justify-center items-center space-x-4 mt-2">
                            <button onClick={() => generateTestSignal('pink_noise')} disabled={playbackState === 'playing'} className="control-btn px-6 py-3 rounded-lg bg-pink-600 text-white">
                                {playbackState === 'playing' ? 'Playing Signal...' : '1. Generate Test Signal'}
                            </button>
                            
                            {!isMeasuring ? (
                                <button onClick={startMeasurement} className="control-btn control-btn-success px-6 py-3 rounded-lg">
                                    2. Start Measurement
                                </button>
                            ) : (
                                <button onClick={stopMeasurement} className="control-btn control-btn-danger px-6 py-3 rounded-lg animate-pulse">
                                    Stop Measurement
                                </button>
                            )}
                        </div>
                         <p className="text-xs text-gray-500 mt-3">
                            Play the test signal through the target speaker system (e.g., Mains, Subs). Then, start the measurement with the microphone at the desired position.
                        </p>
                    </div>
                </div>
            </div>
            {/* Qui in futuro aggiungeremo una lista delle misurazioni salvate */}
        </div>
    );
};

export default MeasurementTool;