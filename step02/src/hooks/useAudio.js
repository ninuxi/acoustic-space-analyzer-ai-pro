// src/hooks/useAudio.js
import { useState, useRef } from 'react';

const EQ_FREQUENCIES = [20, 31.5, 63, 125, 250, 500, 1000, 2000, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000];

// Riferimento ideale per pink noise (dB SPL)
const PINK_NOISE_REFERENCE = {
  20: 85, 31.5: 83, 63: 81, 125: 79, 250: 77, 500: 75,
  1000: 73, 2000: 71, 3150: 69, 4000: 68, 5000: 67,
  6300: 66, 8000: 65, 10000: 64, 12500: 63, 16000: 62
};

export const useAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioData, setAudioData] = useState(null);
  const [microphoneStatus, setMicrophoneStatus] = useState('not-initialized');
  const [realTimeFFT, setRealTimeFFT] = useState([]);
  const [deviationData, setDeviationData] = useState([]);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  const initializeAudio = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 48000 });
      }
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 48000,
          channelCount: 1
        }
      });

      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 16384;
      analyserRef.current.smoothingTimeConstant = 0.1;

      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);
      setMicrophoneStatus('granted');
    } catch (error) {
      setMicrophoneStatus('denied');
      console.error('Microphone access denied:', error);
    }
  };

  const performFFTAnalysis = () => {
    if (!analyserRef.current || !audioContextRef.current) return null;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const floatArray = new Float32Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);
    analyserRef.current.getFloatFrequencyData(floatArray);

    const sampleRate = audioContextRef.current.sampleRate;
    const nyquist = sampleRate / 2;

    const frequencyData = EQ_FREQUENCIES.map(freq => {
      const index = Math.round((freq / nyquist) * bufferLength);
      const amplitude = dataArray[index] || 0;
      const dbFS = floatArray[index] || -Infinity;
      const dbSPL = dbFS + 94; // Calibrazione approssimativa
      const reference = PINK_NOISE_REFERENCE[freq] || 70;
      const deviation = dbSPL - reference;
      return { frequency: freq, amplitude, dbFS, dbSPL, deviation, reference };
    });

    setRealTimeFFT(frequencyData);
    setDeviationData(frequencyData.map(f => f.deviation));

    return {
      timestamp: Date.now(),
      frequencyResponse: frequencyData
    };
  };

  const startRecording = async () => {
    if (microphoneStatus !== 'granted') await initializeAudio();
    if (microphoneStatus !== 'granted') return;

    setIsRecording(true);
    setRecordingTime(0);
    setAudioData([]);
    const startTime = Date.now();

    const recordInterval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setRecordingTime(elapsed);

      const analysis = performFFTAnalysis();
      if (analysis) {
        setAudioData(prev => [...(prev || []), analysis]);
      }

      if (elapsed >= 15) stopRecording();
    }, 100);

    recordingIntervalRef.current = recordInterval;
  };

  const stopRecording = () => {
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    setIsRecording(false);
  };

  return {
    isRecording,
    recordingTime,
    audioData,
    microphoneStatus,
    realTimeFFT,
    deviationData,
    startRecording,
    stopRecording,
    initializeAudio
  };
};