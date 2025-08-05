// File: src/App.jsx
// VERSIONE FINALE con controllo di dipendenze completo per risolvere la race condition

window.AcousticSpaceAnalyzer = () => {
    const { useState, useEffect, useRef } = React;
    
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

    const audioContextRef = useRef(null);

    useEffect(() => {
        try { audioContextRef.current = window.AudioUtils.createAudioContext(); } 
        catch (error) { console.error('Failed to initialize audio:', error); }
        return () => { audioContextRef.current?.close(); };
    }, []);

    const handleAudioRecorded = (recordedData) => {
        setAudioData(recordedData);
        setTimeout(() => setCurrentTab('3d'), 500);
    };

    const handleModelLoaded = (modelData) => {
        setRoomModel(modelData);
        
        const initialAssignments = {};
        if (modelData?.analysis?.surfaces) {
            const types = [...new Set(modelData.analysis.surfaces.map(s => s.type))];
            types.forEach(type => {
                initialAssignments[type] = window.MaterialUtils.getMaterialRecommendation('studio', type);
            });
        }
        setMaterialAssignments(initialAssignments);
        setTimeout(() => setCurrentTab('materials'), 500);
    };

    const handleMaterialsAssigned = (assignments) => {
        setMaterialAssignments(assignments);
    };
    
    const handleGenerateDSPChain = async () => {
        if (!audioData || !roomModel || !apiConfig.apiKey) {
            alert('Please complete audio recording, 3D model loading, and API configuration first.');
            return;
        }

        setIsAnalyzing(true);
        setDspChain([]);
        setAnalysisResults(null);
        setCurrentTab('analyze');
        
        try {
            const roomData = window.ThreeDUtils.calculateRoomAcoustics(roomModel, materialAssignments);

            if (!roomData) {
                throw new Error("Failed to calculate room acoustics. The model analysis might be incomplete or material assignments are missing.");
            }
            
            const result = await window.AIUtils.generateDSPChain(roomData, audioData, apiConfig);

            if (result.success) {
                setDspChain(result.dspChain);
                setAnalysisResults({
                    roomData,
                    aiAnalysis: {
                        reasoning: result.reasoning,
                        confidence: result.confidence,
                        recommendations: result.recommendations,
                    },
                    timestamp: new Date().toISOString()
                });
                setTimeout(() => setCurrentTab('results'), 500);
            } else {
                throw new Error(result.error || 'Unknown AI error');
            }
        } catch (error) {
            console.error('DSP generation failed:', error);
            alert(`Analysis failed: ${error.message}`);
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    const renderTabContent = () => {
        switch (currentTab) {
            case 'record': return React.createElement(window.AudioRecorder, { audioContext: audioContextRef.current, onRecordingComplete: handleAudioRecorded });
            case '3d': return React.createElement(window.FileUploader, { onModelLoaded: handleModelLoaded });
            case 'materials': return React.createElement(window.MaterialAssignment, { roomModel: roomModel, assignments: materialAssignments, onAssignmentsChange: handleMaterialsAssigned });
            case 'analyze': return React.createElement(window.AIAnalyzer, { audioData, roomModel, apiConfig, onGenerateChain: handleGenerateDSPChain, isAnalyzing, dspChain });
            case 'results': return React.createElement(window.AnalysisResults, { analysisResults, dspChain, audioData, roomModel });
            case 'config': return React.createElement(window.APIConfiguration, { config: apiConfig, onConfigChange: setApiConfig });
            default: return React.createElement('div', null, 'Tab not found');
        }
    };

    const tabs = [
        { id: 'record', name: 'Audio', icon: '🎤' }, { id: '3d', name: '3D Model', icon: '🏠' },
        { id: 'materials', name: 'Materials', icon: '🎨' }, { id: 'analyze', name: 'AI Analysis', icon: '🧠' },
        { id: 'results', name: 'Results', icon: '📊' }, { id: 'config', name: 'Config', icon: '⚙️' }
    ];
    
    const getTabStatus = (tabId) => {
        // ... (logica per lo stato dei tab) ...
    };

    return React.createElement('div', { className: 'min-h-screen bg-gray-900 text-white' },
        React.createElement(window.DemoBanner),
        React.createElement('header', { className: 'bg-gray-800/50 backdrop-blur-sm border-b border-gray-700' },
             React.createElement('div', { className: 'container mx-auto px-4 sm:px-6 py-3' },
                React.createElement('h1', { className: 'text-xl sm:text-2xl font-bold gradient-text' }, 'Acoustic Space Analyzer AI Pro')
            )
        ),
        React.createElement('main', { className: 'container mx-auto px-4 sm:px-6 py-6' },
            React.createElement('div', { className: 'flex space-x-1 sm:space-x-2 overflow-x-auto pb-4' },
                tabs.map(tab => React.createElement('button', {
                    key: tab.id, onClick: () => setCurrentTab(tab.id),
                    className: `flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${currentTab === tab.id ? 'bg-purple-600 text-white' : 'bg-gray-700/50 hover:bg-gray-700'}`
                }, React.createElement('span', null, tab.icon), React.createElement('span', null, tab.name)))
            ),
            React.createElement('div', { className: 'mt-4' }, renderTabContent())
        )
    );
};

// --- INIZIO PARTE MODIFICATA ---

const initializeApp = () => {
    const root = document.getElementById('root');
    if (root) {
        ReactDOM.render(React.createElement(window.AcousticSpaceAnalyzer), root);
        console.log('🎚️ Acoustic Space Analyzer AI Pro INITIALIZED');
    } else {
        console.error('Root element not found');
    }
};

const checkDependencies = () => {
    // Array esteso per controllare TUTTE le dipendenze necessarie prima di partire
    const required = [
        // Librerie esterne
        'React', 'ReactDOM', 'THREE',
        // Costanti
        'MATERIALS', 'DSP_PROCESSORS', 'EQ_FREQUENCIES',
        // Utilities
        'AudioUtils', 'ThreeDUtils', 'AIUtils', 'Calculations', 'MaterialUtils', 'FrequencyUtils', 'DSPUtils',
        // Componenti UI
        'Icons', 'DemoBanner', 'APIConfiguration',
        // Componenti Audio
        'AudioRecorder', 'RealTimeFFT', 'Equalizer16Band',
        // Componenti 3D
        'FileUploader', 'Visualization3D', 'MaterialAssignment',
        // Componenti Analisi
        'AIAnalyzer', 'DSPChainDisplay', 'AnalysisResults', 'ExportControls'
    ];
    
    const missing = required.filter(dep => !window[dep]);
    
    if (missing.length === 0) {
        initializeApp();
    } else {
        console.log('Waiting for dependencies:', missing);
        setTimeout(checkDependencies, 100);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkDependencies);
} else {
    checkDependencies();
}

console.log('App.jsx loaded');
// --- FINE PARTE MODIFICATA ---