// File: src/components/audio/AudioRecorder.jsx
// VERSIONE FINALE E CORRETTA

window.AudioRecorder = ({ audioContext, onRecordingComplete, existingData }) => {
    const { useState, useEffect, useRef } = React;
    
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [recordedBuffer, setRecordedBuffer] = useState(existingData?.buffer || null);
    const [analysisData, setAnalysisData] = useState(existingData?.analysis || null);
    const [playbackState, setPlaybackState] = useState('stopped');

    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const analyserRef = useRef(null);
    const timerRef = useRef(null);
    const pinkNoiseSourceRef = useRef(null);
    
    // Un ref per tracciare lo stato di isRecording in modo affidabile nelle callback
    const isRecordingRef = useRef(isRecording);
    isRecordingRef.current = isRecording;

    // Funzione di cleanup
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            clearInterval(timerRef.current);
            pinkNoiseSourceRef.current?.stop();
        };
    }, []);

    const playPinkNoise = async () => {
        if (!audioContext) return;
        await window.AudioUtils.ensureAudioContextResumed(audioContext);
        
        pinkNoiseSourceRef.current?.stop(); // Ferma la riproduzione precedente
        
        const source = audioContext.createBufferSource();
        source.buffer = window.AudioUtils.generatePinkNoise(audioContext, 5);
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.1;
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start();
        setPlaybackState('playing');
        source.onended = () => setPlaybackState('stopped');
        pinkNoiseSourceRef.current = source;
    };

    const startRecording = async () => {
        try {
            if (!audioContext) throw new Error('Audio context not available');
            await window.AudioUtils.ensureAudioContextResumed(audioContext);
            
            const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }});
            streamRef.current = stream;
            
            analyserRef.current = window.AudioUtils.createAnalyser(audioContext, 2048);
            const sourceNode = audioContext.createMediaStreamSource(stream);
            sourceNode.connect(analyserRef.current);
            
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
            const audioChunks = [];
            mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                processRecording(audioBlob);
            };
            
            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();
            setIsRecording(true);
            
            setRecordingTime(0);
            timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);

            // Auto-stop dopo 15 secondi
            setTimeout(() => {
                if (isRecordingRef.current) { // Usa il ref per avere lo stato più recente
                    stopRecording();
                }
            }, 15000);

        } catch (error) {
            console.error('Failed to start recording:', error);
            alert(`Recording failed: ${error.message}`);
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
        streamRef.current?.getTracks().forEach(track => track.stop());
        clearInterval(timerRef.current);
        setIsRecording(false);
    };

    const processRecording = async (audioBlob) => {
        try {
            const arrayBuffer = await audioBlob.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            const analysis = await analyzeAudio(audioBuffer);
            
            const recordingData = {
                buffer: audioBuffer,
                analysis: analysis,
                timestamp: new Date().toISOString(),
            };
            
            setRecordedBuffer(audioBuffer);
            setAnalysisData(analysis);
            if (onRecordingComplete) {
                onRecordingComplete(recordingData);
            }
        } catch (error) {
            console.error('Failed to process recording:', error);
            alert(`Processing failed: ${error.message}`);
        }
    };
    
    const analyzeAudio = async (audioBuffer) => {
        // Usa un OfflineAudioContext per un'analisi precisa e non in tempo reale
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

        const frequencyResponse = window.EQ_FREQUENCIES.map(freq => {
            const bin = window.FrequencyUtils.getFrequencyBin(freq, audioBuffer.sampleRate, analyser.fftSize);
            const dbValue = dataArray[bin] || -140; // Default a un valore molto basso
            const dbSPL = dbValue + 94; // Calibrazione approssimativa a 94dB SPL per 0dBFS
            const reference = window.PINK_NOISE_REFERENCE[freq] || 70;
            return {
                frequency: freq,
                dbSPL: dbSPL,
                deviation: dbSPL - reference
            };
        });

        return {
            duration: audioBuffer.duration,
            sampleRate: audioBuffer.sampleRate,
            peakLevel: window.AudioUtils.calculatePeak(audioBuffer),
            rmsLevel: window.AudioUtils.calculateRMS(audioBuffer),
            frequencyResponse: frequencyResponse
        };
    };

    return React.createElement('div', { className: 'space-y-8' },
        React.createElement('div', { className: 'text-center' },
            React.createElement('h2', { className: 'text-3xl font-bold gradient-text mb-2' }, 'Audio Recording & Analysis'),
            React.createElement('p', { className: 'text-gray-400 text-lg' }, 'Record room acoustic response for analysis')
        ),
        React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-body text-center space-y-6' },
                React.createElement(window.RealTimeFFT, { analyserNode: analyserRef.current }),
                isRecording && React.createElement('div', { className: 'text-3xl font-mono text-purple-400' },
                    `${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, '0')} / 0:15`
                ),
                React.createElement('div', { className: 'flex justify-center items-center space-x-4' },
                    React.createElement('button', {
                        onClick: playPinkNoise,
                        disabled: playbackState === 'playing',
                        className: `control-btn px-6 py-3 rounded-lg ${playbackState === 'playing' ? 'opacity-50' : ''}`
                    }, playbackState === 'playing' ? 'Playing...' : '1. Play Pink Noise'),
                    
                    !isRecording ? 
                        React.createElement('button', {
                            onClick: startRecording,
                            className: 'control-btn control-btn-success px-6 py-3 rounded-lg'
                        }, '2. Start Recording') :
                        React.createElement('button', {
                            onClick: stopRecording,
                            className: 'control-btn control-btn-danger px-6 py-3 rounded-lg animate-pulse'
                        }, 'Stop Recording')
                ),
                React.createElement('p', { className: 'text-sm text-gray-400 max-w-md mx-auto' }, 
                    "First, play the pink noise through your speakers. Then, start the 15-second recording to measure the room's response."
                )
            )
        ),
        analysisData && React.createElement('div', { className: 'card' },
             React.createElement('div', { className: 'card-header' },
                React.createElement('h3', { className: 'text-xl font-semibold' }, 'Recording Analysis')
            ),
             React.createElement('div', { className: 'card-body space-y-4' },
                React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4' },
                    React.createElement('div', { className: 'text-center p-3 bg-gray-700/50 rounded-lg' },
                        React.createElement('div', { className: 'text-2xl font-bold text-blue-400' }, `${analysisData.peakLevel.toFixed(1)} dB`),
                        React.createElement('div', { className: 'text-sm text-gray-400' }, 'Peak Level')
                    ),
                    React.createElement('div', { className: 'text-center p-3 bg-gray-700/50 rounded-lg' },
                        React.createElement('div', { className: 'text-2xl font-bold text-green-400' }, `${analysisData.rmsLevel.toFixed(1)} dB`),
                        React.createElement('div', { className: 'text-sm text-gray-400' }, 'RMS Level')
                    )
                )
            )
        )
    );
};