// src/App.jsx
import { useAudio } from './hooks/useAudio';
import RealTimeFFT from './components/RealTimeFFT';
import { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';
import ThreeDScanner from './components/ThreeDScanner';
import SpeakerAlignment from './components/SpeakerAlignment';
import EqControls from './components/EqControls';
import DspChainViewer from './components/DspChainViewer';
import ApiConfig from './components/ApiConfig';
import ExportReset from './components/ExportReset';
import { useAiAnalysis } from './hooks/useAiAnalysis';

export default function App() {
  const [apiConfig, setApiConfig] = useState({
    provider: 'openrouter',
    apiKey: '',
    model: 'deepseek/deepseek-r1-distill-llama-70b'
  });
  const [eqSettings, setEqSettings] = useState({});
  const [spatialData, setSpatialData] = useState(null);

  const {
    isRecording,
    recordingTime,
    audioData,
    microphoneStatus,
    realTimeFFT,
    deviationData,
    startRecording,
    stopRecording,
    initializeAudio
  } = useAudio();

  const { aiAnalysis, isAnalyzing, analyzeWithAI } = useAiAnalysis();

  const resetAnalysis = () => {
    setEqSettings({});
    setAiAnalysis(null);
    setAudioData(null);
    setSpatialData(null);
  };

  const handleAnalyze = () => {
    analyzeWithAI(audioData, spatialData, [], {}, apiConfig);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-8">🎙️ Acoustic Analyzer AI Pro</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonna 1 */}
        <div className="space-y-6">
          <AudioRecorder
            isRecording={isRecording}
            recordingTime={recordingTime}
            microphoneStatus={microphoneStatus}
            startRecording={startRecording}
            stopRecording={stopRecording}
            initializeAudio={initializeAudio}
          />
          <button
            onClick={handleAnalyze}
            disabled={!audioData || !spatialData || isAnalyzing}
            className="w-full py-3 px-4 bg-pink-600 hover:bg-pink-700 rounded disabled:opacity-70"
          >
            {isAnalyzing ? 'Analyzing...' : '🧠 Analyze with AI'}
          </button>
          <ApiConfig apiConfig={apiConfig} setApiConfig={setApiConfig} />
        </div>

        {/* Colonna 2 */}
        <div className="space-y-6">
          <ThreeDScanner spatialData={spatialData} />
          <EqControls eqSettings={eqSettings} setEqSettings={setEqSettings} realTimeFFT={realTimeFFT} />
        </div>
        <div className="space-y-6">
          <ThreeDScanner spatialData={spatialData} />
          <EqControls eqSettings={eqSettings} setEqSettings={setEqSettings} realTimeFFT={realTimeFFT} />
          <RealTimeFFT realTimeFFT={realTimeFFT} /> {/* ✅ Aggiunto */}
        </div>

        {/* Colonna 3 */}
        <div className="space-y-6">
          <SpeakerAlignment />
          {aiAnalysis && <DspChainViewer dspChain={aiAnalysis.dspChain} />}
          <ExportReset aiAnalysis={aiAnalysis} resetAnalysis={resetAnalysis} />
        </div>
      </div>
    </div>
  );
}
