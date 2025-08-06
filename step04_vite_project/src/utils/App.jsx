// Main Application Component
window.AcousticSpaceAnalyzer = () => {
    const { useState, useEffect, useRef } = React;
    
    // Main application state
    const [currentTab, setCurrentTab] = useState('record');
    const [audioData, setAudioData] = useState(null);
    const [roomModel, setRoomModel] = useState(null);
    const [materialAssignments, setMaterialAssignments] = useState({
        floor: 'concrete',
        ceiling: 'plasterboard', 
        wall: 'brick'
    });
    const [dspChain, setDspChain] = useState([]);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [apiConfig, setApiConfig] = useState({
        provider: 'openrouter',
        model: 'anthropic/claude-3-haiku',
        apiKey: '',
        temperature: 0.3
    });

    // Refs for audio context and 3D scene
    const audioContextRef = useRef(null);
    const sceneRef = useRef(null);

    // Initialize audio context
    useEffect(() => {
        const initAudio = async () => {
            try {
                audioContextRef.current = window.AudioUtils.createAudioContext();
                console.log('Audio context initialized');
            } catch (error) {
                console.error('Failed to initialize audio:', error);
            }
        };
        
        initAudio();
        
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    // Handle audio recording complete
    const handleAudioRecorded = (recordedData) => {
        setAudioData(recordedData);
        console.log('Audio recorded:', recordedData);
        
        // Auto-advance to next tab
        setTimeout(() => setCurrentTab('3d'), 500);
    };

    // Handle 3D model loaded
    const handleModelLoaded = (modelData) => {
        setRoomModel(modelData);
        console.log('3D model loaded:', modelData);
        
        // Auto-advance to next tab
        setTimeout(() => setCurrentTab('materials'), 500);
    };

    // Handle material assignments updated
    const handleMaterialsAssigned = (assignments) => {
        setMaterialAssignments(assignments);
        console.log('Materials assigned:', assignments);
    };

    // Generate DSP chain with AI
    const handleGenerateDSPChain = async () => {
        if (!audioData || !roomModel) {
            alert('Please complete audio recording and 3D model loading first');
            return;
        }

        if (!apiConfig.apiKey) {
            alert('Please configure your API key first');
            setCurrentTab('config');
            return;
        }

        setIsAnalyzing(true);
        
        try {
            // Calculate room acoustics
            const roomData = window.ThreeDUtils.calculateRoomAcoustics(
                roomModel.geometry,
                materialAssignments
            );

            // Generate DSP chain using AI
            const result = await window.AIUtils.generateDSPChain(
                roomData,
                audioData,
                apiConfig
            );

            if (result.success) {
                setDspChain(result.dspChain);
                setAnalysisResults({
                    roomData,
                    aiAnalysis: result,
                    timestamp: new Date().toISOString()
                });
                setCurrentTab('results');
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('DSP generation failed:', error);
            alert(`Analysis failed: ${error.message}`);
            
            // Use fallback chain
            const fallbackChain = window.AIUtils.generateFallbackChain(roomModel);
            setDspChain(fallbackChain);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Tab navigation
    const tabs = [
        { id: 'record', name: 'Audio Record', icon: '🎤', component: 'AudioRecorder' },
        { id: '3d', name: '3D Model', icon: '🏠', component: 'ModelLoader' },
        { id: 'materials', name: 'Materials', icon: '🎨', component: 'MaterialAssignment' },
        { id: 'analyze', name: 'AI Analysis', icon: '🧠', component: 'AIAnalyzer' },
        { id: 'results', name: 'Results', icon: '📊', component: 'AnalysisResults' },
        { id: 'config', name: 'API Config', icon: '⚙️', component: 'APIConfiguration' }
    ];

    // Get completion status for each tab
    const getTabStatus = (tabId) => {
        switch (tabId) {
            case 'record': return audioData ? 'complete' : 'pending';
            case '3d': return roomModel ? 'complete' : 'pending';
            case 'materials': return Object.keys(materialAssignments).length > 0 ? 'complete' : 'pending';
            case 'analyze': return dspChain.length > 0 ? 'complete' : 'pending';
            case 'results': return analysisResults ? 'complete' : 'pending';
            case 'config': return apiConfig.apiKey ? 'complete' : 'pending';
            default: return 'pending';
        }
    };

    // Render tab content
    const renderTabContent = () => {
        switch (currentTab) {
            case 'record':
                return React.createElement(window.AudioRecorder, {
                    audioContext: audioContextRef.current,
                    onRecordingComplete: handleAudioRecorded,
                    existingData: audioData
                });
                
            case '3d':
                return React.createElement(window.FileUploader, {
                    onModelLoaded: handleModelLoaded,
                    existingModel: roomModel
                });
                
            case 'materials':
                return React.createElement(window.MaterialAssignment, {
                    roomModel: roomModel,
                    assignments: materialAssignments,
                    onAssignmentsChange: handleMaterialsAssigned
                });
                
            case 'analyze':
                return React.createElement(window.AIAnalyzer, {
                    audioData: audioData,
                    roomModel: roomModel,
                    materialAssignments: materialAssignments,
                    apiConfig: apiConfig,
                    onGenerateChain: handleGenerateDSPChain,
                    isAnalyzing: isAnalyzing,
                    dspChain: dspChain
                });
                
            case 'results':
                return React.createElement(window.AnalysisResults, {
                    analysisResults: analysisResults,
                    dspChain: dspChain,
                    audioData: audioData,
                    roomModel: roomModel
                });
                
            case 'config':
                return React.createElement(window.APIConfiguration, {
                    config: apiConfig,
                    onConfigChange: setApiConfig
                });
                
            default:
                return React.createElement('div', { className: 'text-center py-12' },
                    React.createElement('h3', { className: 'text-xl text-gray-600' }, 
                        'Select a tab to get started'
                    )
                );
        }
    };

    return React.createElement('div', { className: 'min-h-screen bg-gray-100 text-gray-900' },
        // Demo Banner
        React.createElement(window.DemoBanner),
        
        // Header
        React.createElement('header', { className: 'bg-white/50 backdrop-blur-sm border-b border-gray-200' },
            React.createElement('div', { className: 'container mx-auto px-6 py-4' },
                React.createElement('div', { className: 'flex items-center justify-between' },
                    React.createElement('div', { className: 'flex items-center space-x-4' },
                        React.createElement('div', { className: 'text-2xl' }, '🎚️'),
                        React.createElement('div', null,
                            React.createElement('h1', { className: 'text-2xl font-bold gradient-text' },
                                'Acoustic Space Analyzer AI Pro'
                            ),
                            React.createElement('p', { className: 'text-sm text-gray-600' },
                                'Professional acoustic analysis with AI-powered DSP chain generation'
                            )
                        )
                    ),
                    React.createElement('div', { className: 'flex items-center space-x-4' },
                        React.createElement('div', { className: 'text-sm text-gray-600' },
                            `Status: ${getTabStatus(currentTab) === 'complete' ? '✅' : '⏳'} ${currentTab}`
                        ),
                        React.createElement('a', {
                            href: 'https://github.com/ninuxi/acoustic-space-analyzer-ai-pro',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            className: 'text-gray-600 hover:text-gray-900 transition-colors'
                        },
                            React.createElement(window.Icons.GithubIcon, { size: 20 })
                        )
                    )
                )
            )
        ),
        
        // Navigation Tabs
        React.createElement('nav', { className: 'bg-white/30 backdrop-blur-sm border-b border-gray-200' },
            React.createElement('div', { className: 'container mx-auto px-6' },
                React.createElement('div', { className: 'flex space-x-1 overflow-x-auto py-2' },
                    tabs.map(tab => {
                        const status = getTabStatus(tab.id);
                        const isActive = currentTab === tab.id;
                        const isComplete = status === 'complete';
                        
                        return React.createElement('button', {
                            key: tab.id,
                            onClick: () => setCurrentTab(tab.id),
                            className: `flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                isActive 
                                    ? 'bg-purple-600 text-gray-900 shadow-lg shadow-purple-600/30' 
                                    : isComplete
                                        ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                                        : 'bg-gray-200 text-gray-300 hover:bg-gray-700/70'
                            }`
                        },
                            React.createElement('span', { className: 'text-lg' }, tab.icon),
                            React.createElement('span', { className: 'hidden sm:inline' }, tab.name),
                            isComplete && React.createElement('span', { className: 'text-xs' }, '✓')
                        );
                    })
                )
            )
        ),
        
        // Progress Indicator
        React.createElement('div', { className: 'bg-white/20' },
            React.createElement('div', { className: 'container mx-auto px-6 py-2' },
                React.createElement('div', { className: 'flex items-center justify-between text-sm' },
                    React.createElement('div', { className: 'flex items-center space-x-4' },
                        React.createElement('span', { className: 'text-gray-600' }, 'Progress:'),
                        React.createElement('div', { className: 'flex space-x-1' },
                            tabs.map((tab, index) => {
                                const status = getTabStatus(tab.id);
                                const isActive = currentTab === tab.id;
                                
                                return React.createElement('div', {
                                    key: tab.id,
                                    className: `w-3 h-3 rounded-full transition-all duration-300 ${
                                        status === 'complete' 
                                            ? 'bg-green-500 shadow-lg shadow-green-500/50' 
                                            : isActive 
                                                ? 'bg-purple-500 shadow-lg shadow-purple-500/50' 
                                                : 'bg-gray-600'
                                    }`
                                });
                            })
                        )
                    ),
                    React.createElement('div', { className: 'text-gray-600' },
                        `${tabs.filter(tab => getTabStatus(tab.id) === 'complete').length}/${tabs.length} Complete`
                    )
                )
            )
        ),
        
        // Main Content
        React.createElement('main', { className: 'container mx-auto px-6 py-8' },
            React.createElement('div', { className: 'glass rounded-xl p-6 min-h-[600px]' },
                renderTabContent()
            )
        ),
        
        // Footer
        React.createElement('footer', { className: 'bg-white/30 border-t border-gray-200 mt-12' },
            React.createElement('div', { className: 'container mx-auto px-6 py-6' },
                React.createElement('div', { className: 'flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0' },
                    React.createElement('div', { className: 'text-gray-600 text-sm' },
                        React.createElement('p', null, '© 2024 Acoustic Space Analyzer AI Pro - Professional Audio Analysis Tool'),
                        React.createElement('p', { className: 'text-xs mt-1' }, 
                            'Built with React, Three.js, Web Audio API, and AI-powered analysis'
                        )
                    ),
                    React.createElement('div', { className: 'flex items-center space-x-4 text-sm' },
                        React.createElement('span', { className: 'text-gray-500' }, 'References:'),
                        React.createElement('a', {
                            href: 'https://www.roomeqwizard.com/',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            className: 'text-blue-400 hover:text-blue-300 transition-colors'
                        }, 'REW'),
                        React.createElement('a', {
                            href: 'https://opensoundmeter.com/',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            className: 'text-blue-400 hover:text-blue-300 transition-colors'
                        }, 'OpenSoundMeter'),
                        React.createElement('a', {
                            href: 'https://www.rationalacoustics.com/',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            className: 'text-blue-400 hover:text-blue-300 transition-colors'
                        }, 'Smaart')
                    )
                )
            )
        ),
        
        // Floating Action Button for Quick Analysis
        analysisResults && React.createElement('div', { 
            className: 'fixed bottom-6 right-6 z-50' 
        },
            React.createElement('button', {
                onClick: () => setCurrentTab('results'),
                className: 'bg-gradient-to-r from-purple-600 to-pink-600 text-gray-900 p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 animate-pulse'
            },
                React.createElement('div', { className: 'flex items-center space-x-2' },
                    React.createElement('span', { className: 'text-xl' }, '📊'),
                    React.createElement('span', { className: 'hidden sm:inline font-medium' }, 'View Results')
                )
            )
        )
    );
};

// Initialize the application
const initializeApp = () => {
    const root = document.getElementById('root');
    if (root) {
        ReactDOM.render(React.createElement(window.AcousticSpaceAnalyzer), root);
        console.log('🎚️ Acoustic Space Analyzer AI Pro initialized');
    } else {
        console.error('Root element not found');
    }
};

// Wait for all dependencies to load
const checkDependencies = () => {
    const required = [
        'React', 'ReactDOM', 'THREE',
        'MATERIALS', 'DSP_PROCESSORS', 'EQ_FREQUENCIES',
        'AudioUtils', 'ThreeDUtils', 'AIUtils', 'Calculations',
        'Icons', 'DemoBanner'
    ];
    
    const missing = required.filter(dep => !window[dep]);
    
    if (missing.length === 0) {
        initializeApp();
    } else {
        console.log('Waiting for dependencies:', missing);
        setTimeout(checkDependencies, 100);
    }
};

// Start the application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkDependencies);
} else {
    checkDependencies();
}

console.log('App.jsx loaded');