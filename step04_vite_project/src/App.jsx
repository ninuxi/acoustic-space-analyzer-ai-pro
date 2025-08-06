// File: src/App.jsx

import React, { useState, useEffect } from 'react';

// Import Utilities
import { AudioUtils } from './utils/audio-utils.js';
import { ThreeDUtils } from './utils/3d-utils.js';
import { AIUtils } from './utils/ai-utils.js';
import { MaterialUtils } from './constants/materials.js';

// Import Components
import DemoBanner from './components/ui/DemoBanner.jsx';
import APIConfiguration from './components/ui/APIConfiguration.jsx';
import MeasurementTool from './components/audio/MeasurementTool.jsx';
import FileUploader from './components/3d/FileUploader.jsx';
import MaterialAssignment from './components/3d/MaterialAssignment.jsx';
import AIAnalyzer from './components/analysis/AIAnalyzer.jsx';
import AnalysisResults from './components/analysis/AnalysisResults.jsx';

function App() {
    const [currentTab, setCurrentTab] = useState('record');
    const [audioData, setAudioData] = useState(null);
    const [roomModel, setRoomModel] = useState(null);
    const [materialAssignments, setMaterialAssignments] = useState({});
    const [dspChain, setDspChain] = useState([]);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [apiConfig, setApiConfig] = useState({
        provider: 'openrouter',
        model: 'google/gemini-flash-1.5',
        apiKey: '',
    });

    // Use useState for the audio context to trigger re-renders
    const [audioContext, setAudioContext] = useState(null);

    useEffect(() => {
        // Initialize the AudioContext once when the app loads
        try {
            const context = AudioUtils.createAudioContext();
            setAudioContext(context);
        } catch (error) {
            console.error('Failed to initialize audio:', error);
            alert("Could not initialize the Web Audio API. Please use a modern browser.");
        }

        // Cleanup function to close the context when the app unmounts
        return () => {
            if (audioContext && audioContext.state !== 'closed') {
                audioContext.close();
            }
        };
    }, []); // Empty dependency array ensures this runs only once

    const handleMeasurementComplete = async (recordedBlob) => {
        if (audioContext) {
            try {
                const arrayBuffer = await recordedBlob.arrayBuffer();
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                setAudioData({ buffer: audioBuffer, blob: recordedBlob });
                setTimeout(() => setCurrentTab('3d'), 500);
            } catch (e) {
                alert("Could not process the recorded audio.");
            }
        }
    };

    const handleModelLoaded = (modelData) => {
        setRoomModel(modelData);
        const initialAssignments = {};
        if (modelData?.analysis?.surfaces) {
            const types = [...new Set(modelData.analysis.surfaces.map(s => s.type))];
            types.forEach(type => {
                initialAssignments[type] = MaterialUtils.getMaterialRecommendation('studio', type);
            });
        }
        setMaterialAssignments(initialAssignments);
        setTimeout(() => setCurrentTab('materials'), 500);
    };

    const handleGenerateDSPChain = async () => {
        if (!audioData?.buffer || !roomModel || !apiConfig.apiKey) {
            alert('Please complete all previous steps and API configuration.');
            return;
        }
        setIsAnalyzing(true);
        setCurrentTab('analyze');
        try {
            const roomData = ThreeDUtils.calculateRoomAcoustics(roomModel, materialAssignments);
            const audioAnalysis = await AudioUtils.analyzeAudioBuffer(audioData.buffer);

            if (!roomData || !audioAnalysis) {
                throw new Error("Failed to analyze room or audio data.");
            }
            
            const result = await AIUtils.generateDSPChain(roomData, { analysis: audioAnalysis }, apiConfig);
            
            if (result.success) {
                setDspChain(result.dspChain);
                setAnalysisResults({ roomData, aiAnalysis: result, timestamp: new Date().toISOString() });
                setTimeout(() => setCurrentTab('results'), 500);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            alert(`Analysis failed: ${error.message}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const renderTabContent = () => {
        switch (currentTab) {
            case 'record': return <MeasurementTool audioContext={audioContext} onMeasurementComplete={handleMeasurementComplete} />;
            case '3d': return <FileUploader onModelLoaded={handleModelLoaded} />;
            case 'materials': return <MaterialAssignment roomModel={roomModel} assignments={materialAssignments} onAssignmentsChange={setMaterialAssignments} />;
            case 'analyze': return <AIAnalyzer {...{ audioData, roomModel, apiConfig, onGenerateChain: handleGenerateDSPChain, isAnalyzing, dspChain }} />;
            case 'results': return <AnalysisResults {...{ analysisResults, dspChain, audioData, roomModel }} />;
            case 'config': return <APIConfiguration config={apiConfig} onConfigChange={setApiConfig} />;
            default: return <div>Tab not found</div>;
        }
    };

    const tabs = [
        { id: 'record', name: 'Audio', icon: '🎤' },
        { id: '3d', name: '3D Model', icon: '🏠' },
        { id: 'materials', name: 'Materials', icon: '🎨' },
        { id: 'analyze', name: 'AI Analysis', icon: '🧠' },
        { id: 'results', name: 'Results', icon: '📊' },
        { id: 'config', name: 'Config', icon: '⚙️' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <DemoBanner />
            <header className="bg-white/50 backdrop-blur-sm border-b border-gray-200">
                <div className="container mx-auto px-4 sm:px-6 py-3">
                    <h1 className="text-xl sm:text-2xl font-bold gradient-text">Acoustic Space Analyzer AI Pro</h1>
                </div>
            </header>
            <main className="container mx-auto px-4 sm:px-6 py-6">
                <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-4">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setCurrentTab(tab.id)}
                            className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${currentTab === tab.id ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.name}</span>
                        </button>
                    ))}
                </div>
                <div className="mt-4">{renderTabContent()}</div>
            </main>
        </div>
    );
}

export default App;