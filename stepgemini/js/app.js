// Main Application Component
const { useState, useRef, useEffect, useCallback } = React;

const AcousticAnalyzerAI = () => {
    // State Management
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isScanning3D, setIsScanning3D] = useState(false);
    const [audioData, setAudioData] = useState(null);
    const [spatialData, setSpatialData] = useState(null);
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [realTimeFFT, setRealTimeFFT] = useState([]);
    const [deviationData, setDeviationData] = useState([]);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [microphoneStatus, setMicrophoneStatus] = useState('not-initialized');
    const [selectedMaterials, setSelectedMaterials] = useState({});
    const [surfaces, setSurfaces] = useState([]);
    const [dspChain, setDspChain] = useState([]);
    const [eqSettings, setEqSettings] = useState(
        EQ_FREQUENCIES.reduce((acc, freq) => ({ ...acc, [freq]: 0 }), {})
    );
    const [demoLoaded, setDemoLoaded] = useState(false);
    const [apiConfig, setApiConfig] = useState({
        provider: 'openrouter',
        apiKey: '',
        model: 'deepseek/deepseek-r1-distill-llama-70b'
    });

    // Refs for audio and 3D
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const microphoneRef = useRef(null);
    const animationRef = useRef(null);
    const recordingIntervalRef = useRef(null);
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);

    // Initialize app on mount
    useEffect(() => {
        initializeApp();
        return cleanup;
    }, []);

    // Initialize application
    const initializeApp = async () => {
        try {
            await initialize3DVisualization();
            loadApiConfig();
            console.log('Application initialized successfully');
        } catch (error) {
            console.error('Failed to initialize application:', error);
        }
    };

    // Cleanup function
    const cleanup = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
        if (recordingIntervalRef.current) {
            clearInterval(recordingIntervalRef.current);
        }
    };

    // Load API configuration from localStorage
    const loadApiConfig = () => {
        try {
            const saved = localStorage.getItem('acousticAnalyzerApiConfig');
            if (saved) {
                setApiConfig(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to load API config:', e);
        }
    };

    // Save API configuration
    const saveApiConfig = (config) => {
        setApiConfig(config);
        try {
            localStorage.setItem('acousticAnalyzerApiConfig', JSON.stringify(config));
        } catch (e) {
            console.error('Failed to save API config:', e);
        }
    };

    // Initialize audio system
    const initializeAudio = async () => {
        try {
            setMicrophoneStatus('requesting');
            
            // Initialize audio context
            audioContextRef.current = await initializeAudioContext();
            
            // Request microphone access
            const stream = await requestMicrophoneAccess();
            
            // Create analyzer
            analyserRef.current = createAnalyzer(audioContextRef.current);
            
            // Connect microphone to analyzer
            microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
            microphoneRef.current.connect(analyserRef.current);
            
            setMicrophoneStatus('granted');
            startRealTimeFFT();
            
            console.log('Audio system initialized successfully');
        } catch (error) {
            console.error('Audio initialization error:', error);
            setMicrophoneStatus('denied');
            alert(error.message);
        }
    };

    // Start real-time FFT visualization
    const startRealTimeFFT = () => {
        if (!analyserRef.current) return;
        
        const updateFFT = () => {
            if (microphoneStatus === 'granted' && analyserRef.current && audioContextRef.current) {
                const analysis = performFFTAnalysis(analyserRef.current, audioContextRef.current);
                if (analysis) {
                    setRealTimeFFT(analysis.frequencyResponse);
                    setDeviationData(analysis.frequencyResponse.map(f => f.deviation));
                }
            }
            animationRef.current = requestAnimationFrame(updateFFT);
        };
        updateFFT();
    };

    // Start recording
    const startRecording = async () => {
        if (microphoneStatus !== 'granted') {
            await initializeAudio();
            if (microphoneStatus !== 'granted') return;
        }
        
        setIsRecording(true);
        setRecordingTime(0);
        setAudioData([]);
        
        const startTime = Date.now();
        recordingIntervalRef.current = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            setRecordingTime(elapsed);
            
            if (analyserRef.current && audioContextRef.current) {
                const analysis = performFFTAnalysis(analyserRef.current, audioContextRef.current);
                if (analysis) {
                    setAudioData(prev => [...(prev || []), analysis]);
                }
            }
            
            if (elapsed >= 15) {
                stopRecording();
            }
        }, 100); // Sample every 100ms for high temporal resolution
    };

    // Stop recording
    const stopRecording = () => {
        if (recordingIntervalRef.current) {
            clearInterval(recordingIntervalRef.current);
            recordingIntervalRef.current = null;
        }
        setIsRecording(false);
        console.log('Recording completed');
    };

    // Initialize 3D visualization
    const initialize3DVisualization = async () => {
        if (!canvasRef.current) return;
        
        try {
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x0a0a0a);
            scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);
            
            const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ 
                canvas: canvasRef.current, 
                antialias: true,
                alpha: true
            });
            renderer.setSize(400, 300);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            
            // Enhanced lighting setup
            const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(5, 10, 5);
            directionalLight.castShadow = true;
            directionalLight.shadow.camera.near = 0.1;
            directionalLight.shadow.camera.far = 50;
            directionalLight.shadow.camera.left = -10;
            directionalLight.shadow.camera.right = 10;
            directionalLight.shadow.camera.top = 10;
            directionalLight.shadow.camera.bottom = -10;
            scene.add(directionalLight);
            
            // Add rim light for better depth perception
            const rimLight = new THREE.DirectionalLight(0x4444ff, 0.3);
            rimLight.position.set(-5, 5, -5);
            scene.add(rimLight);
            
            // Grid helper
            const gridHelper = new THREE.GridHelper(20, 20, 0x333333, 0x333333);
            scene.add(gridHelper);
            
            // Camera positioning
            camera.position.set(8, 6, 8);
            camera.lookAt(0, 0, 0);
            
            // Store references
            sceneRef.current = scene;
            rendererRef.current = renderer;
            cameraRef.current = camera;
            
            // Start animation loop
            const animate = () => {
                if (sceneRef.current && rendererRef.current && cameraRef.current) {
                    // Smooth camera rotation
                    const time = Date.now() * 0.0003;
                    cameraRef.current.position.x = Math.cos(time) * 12;
                    cameraRef.current.position.z = Math.sin(time) * 12;
                    cameraRef.current.position.y = 6 + Math.sin(time * 0.5) * 2;
                    cameraRef.current.lookAt(0, 0, 0);
                    
                    rendererRef.current.render(sceneRef.current, cameraRef.current);
                }
                requestAnimationFrame(animate);
            };
            animate();
            
        } catch (error) {
            console.error('3D visualization initialization error:', error);
        }
    };

    // Load demo file from GitHub
    const loadDemoFile = async () => {
        setIsScanning3D(true);
        setDemoLoaded(false);
        
        try {
            // Simulate loading demo GLB file
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const demoData = {
                source: 'DEMO - Empty Old Garage Room',
                fileName: 'DEMO_Empty_old_Garage_room.glb',
                roomDimensions: {
                    width: 6.2,
                    height: 2.8,
                    depth: 5.8
                },
                volume: 6.2 * 2.8 * 5.8,
                surfaceArea: 2 * (6.2 * 2.8 + 6.2 * 5.8 + 2.8 * 5.8),
                uploadedAt: new Date().toISOString(),
                isDemo: true,
                treatments: [
                    { x: -2, y: 0, z: -2, type: 'absorption', material: 'acoustic_panel' },
                    { x: 2, y: 0, z: -2, type: 'absorption', material: 'foam_panel' },
                    { x: 0, y: 1, z: 2, type: 'diffusion', material: 'rockwool_panel' }
                ]
            };
            
            setSpatialData(demoData);
            generateSurfaces(demoData.roomDimensions);
            visualize3DData(demoData);
            
            // Auto-assign realistic garage materials
            const demoMaterials = {
                'floor': 'concrete',
                'ceiling': 'plasterboard',
                'wall_front': 'concrete',
                'wall_back': 'concrete', 
                'wall_left': 'brick',
                'wall_right': 'brick'
            };
            setSelectedMaterials(demoMaterials);
            
            setDemoLoaded(true);
            console.log('Demo loaded successfully');
            
        } catch (error) {
            console.error('Demo loading error:', error);
            alert('Error loading demo: ' + error.message);
        }
        
        setIsScanning3D(false);
    };

    // Generate surfaces from room dimensions
    const generateSurfaces = (dimensions) => {
        const { width, height, depth } = dimensions;
        const newSurfaces = [
            { id: 'floor', name: 'Floor', area: width * depth, normal: [0, 1, 0] },
            { id: 'ceiling', name: 'Ceiling', area: width * depth, normal: [0, -1, 0] },
            { id: 'wall_front', name: 'Front Wall', area: width * height, normal: [0, 0, -1] },
            { id: 'wall_back', name: 'Back Wall', area: width * height, normal: [0, 0, 1] },
            { id: 'wall_left', name: 'Left Wall', area: depth * height, normal: [1, 0, 0] },
            { id: 'wall_right', name: 'Right Wall', area: depth * height, normal: [-1, 0, 0] }
        ];
        setSurfaces(newSurfaces);
    };

    // Visualize 3D data
    const visualize3DData = (data) => {
        if (!sceneRef.current) return;
        
        // Clear existing room objects
        const toRemove = [];
        sceneRef.current.traverse((child) => {
            if (child.userData.isRoom) {
                toRemove.push(child);
            }
        });
        toRemove.forEach(child => sceneRef.current.remove(child));
        
        const { roomDimensions } = data;
        
        // Create room wireframe
        const roomGeometry = new THREE.BoxGeometry(
            roomDimensions.width, 
            roomDimensions.height, 
            roomDimensions.depth
        );
        const roomMaterial = new THREE.MeshBasicMaterial({
            color: 0x444444,
            wireframe: true,
            opacity: 0.3,
            transparent: true
        });
        const room = new THREE.Mesh(roomGeometry, roomMaterial);
        room.userData.isRoom = true;
        sceneRef.current.add(room);
        
        // Add acoustic treatment indicators
        if (data.treatments) {
            data.treatments.forEach(treatment => {
                const geometry = new THREE.SphereGeometry(0.3);
                const material = new THREE.MeshPhongMaterial({
                    color: treatment.type === 'absorption' ? 0x00ff00 : 0xff6600,
                    emissive: treatment.type === 'absorption' ? 0x004400 : 0x331100,
                    emissiveIntensity: 0.2
                });
                const sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(treatment.x, treatment.y, treatment.z);
                sphere.userData.isRoom = true;
                sceneRef.current.add(sphere);
            });
        }
    };

    return React.createElement('div', {
        className: "min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white"
    },
        // Demo Banner
        React.createElement(DemoBanner),
        
        React.createElement('div', {
            className: "container mx-auto p-6 max-w-7xl"
        },
            // Header
            React.createElement('div', {
                className: "text-center mb-8 animate-fade-in"
            },
                React.createElement('h1', {
                    className: "text-5xl font-bold mb-2 gradient-text"
                }, 'Acoustic Space Analyzer AI Pro'),
                React.createElement('p', {
                    className: "text-gray-300 text-lg"
                }, 'Professional acoustic analysis with AI-powered DSP Chain Generator'),
                React.createElement(GitHubLink)
            ),

            // Demo Status
            React.createElement(DemoStatus, { 
                isDemo: spatialData?.isDemo, 
                demoData: spatialData 
            }),

            // API Configuration
            React.createElement(APIConfiguration, {
                apiConfig: apiConfig,
                onConfigChange: saveApiConfig
            }),

            // Main Controls
            React.createElement('div', {
                className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            },
                // Audio Recorder
                React.createElement(AudioRecorder, {
                    isRecording: isRecording,
                    recordingTime: recordingTime,
                    audioData: audioData,
                    microphoneStatus: microphoneStatus,
                    onInitialize: initializeAudio,
                    onStartRecording: startRecording,
                    onStopRecording: stopRecording
                }),

                // File Uploader
                React.createElement(FileUploader, {
                    isScanning: isScanning3D,
                    spatialData: spatialData,
                    uploadedFile: uploadedFile,
                    onLoadDemo: loadDemoFile,
                    onFileUpload: (file) => {
                        // Handle file upload logic here
                        console.log('File uploaded:', file);
                    }
                }),

                // AI Analyzer
                React.createElement(AIAnalyzer, {
                    isAnalyzing: isAnalyzing,
                    audioData: audioData,
                    spatialData: spatialData,
                    apiConfig: apiConfig,
                    aiAnalysis: aiAnalysis,
                    onAnalyze: () => {
                        // Handle AI analysis logic here
                        console.log('Starting AI analysis...');
                    }
                })
            ),

            // Real-time FFT (when microphone is active)
            microphoneStatus === 'granted' && React.createElement(RealTimeFFT, {
                frequencyData: realTimeFFT,
                deviationData: deviationData
            }),

            // Material Assignment (when surfaces are available)
            surfaces.length > 0 && React.createElement(MaterialAssignment, {
                surfaces: surfaces,
                selectedMaterials: selectedMaterials,
                spatialData: spatialData,
                demoLoaded: demoLoaded,
                onMaterialChange: (surfaceId, materialKey) => {
                    setSelectedMaterials(prev => ({
                        ...prev,
                        [surfaceId]: materialKey
                    }));
                    if (spatialData) {
                        visualize3DData(spatialData);
                    }
                }
            }),

            // 3D Visualization and EQ
            React.createElement('div', {
                className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            },
                React.createElement(Visualization3D, {
                    canvasRef: canvasRef,
                    spatialData: spatialData
                }),
                React.createElement(Equalizer16Band, {
                    eqSettings: eqSettings,
                    aiAnalysis: aiAnalysis,
                    onEQChange: setEqSettings
                })
            ),

            // DSP Chain Display
            dspChain.length > 0 && React.createElement(DSPChainDisplay, {
                dspChain: dspChain,
                aiAnalysis: aiAnalysis
            }),

            // Analysis Results
            aiAnalysis && React.createElement(AnalysisResults, {
                aiAnalysis: aiAnalysis,
                spatialData: spatialData,
                surfaces: surfaces,
                selectedMaterials: selectedMaterials,
                dspChain: dspChain
            }),

            // Export Controls
            React.createElement(ExportControls, {
                aiAnalysis: aiAnalysis,
                onExport: () => {
                    // Handle export logic
                    console.log('Exporting results...');
                },
                onReset: () => {
                    // Handle reset logic
                    console.log('Resetting application...');
                }
            }),

            // Footer
            React.createElement('div', {
                className: "mt-12 text-center text-gray-400 text-sm animate-fade-in"
            },
                React.createElement('div', {
                    className: "mb-4"
                },
                    React.createElement('a', {
                        href: "https://github.com/ninuxi/acoustic-space-analyzer-ai-pro",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "inline-flex items-center hover:text-white transition-colors"
                    },
                        React.createElement(GithubIcon, { className: "mr-2" }),
                        'Acoustic Space Analyzer AI Pro'
                    )
                ),
                React.createElement('div', {
                    className: "space-y-1"
                },
                    React.createElement('p', null, '🎚️ Professional acoustic analysis tool with AI-powered DSP chain generation'),
                    React.createElement('p', null, '📡 Working online demo • 🔧 Open Source'),
                    React.createElement('p', null,
                        'Technologies: React • Three.js • Web Audio API • ',
                        React.createElement('a', {
                            href: "https://openrouter.ai",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "ml-1 text-blue-400 hover:underline"
                        }, 'OpenRouter'),
                        ' • ',
                        React.createElement('a', {
                            href: "https://console.groq.com",
                            target: "_blank", 
                            rel: "noopener noreferrer",
                            className: "ml-1 text-blue-400 hover:underline"
                        }, 'Groq')
                    )
                )
            )
        )
    );
};

// Render the application
ReactDOM.render(React.createElement(AcousticAnalyzerAI), document.getElementById('root'));