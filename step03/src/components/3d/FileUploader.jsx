// File: src/components/3d/FileUploader.jsx
// VERSIONE DEFINITIVA con UI di upload e conferma manuale della scala

window.FileUploader = ({ onModelLoaded, existingModel }) => {
    const { useState, useEffect, useRef } = React;

    const [isLoading, setIsLoading] = useState(false);
    const [modelData, setModelData] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);
    
    const [needsScaleConfirmation, setNeedsScaleConfirmation] = useState(false);
    const [rawAnalysis, setRawAnalysis] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState('m');
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const containerRef = useRef(null);
    const controlsRef = useRef(null);
    const animationFrameRef = useRef(null);
    
    useEffect(() => { if (containerRef.current) initializeScene(); return () => cancelAnimationFrame(animationFrameRef.current); }, []);

    const initializeScene = () => {
        try {
            const container = containerRef.current;
            const width = container.clientWidth;
            const height = container.clientHeight;
            
            sceneRef.current = window.ThreeDUtils.createScene();
            cameraRef.current = window.ThreeDUtils.createCamera(width, height);
            rendererRef.current = window.ThreeDUtils.createRenderer(width, height);
            container.appendChild(rendererRef.current.domElement);
            window.ThreeDUtils.createLighting(sceneRef.current);
            
            controlsRef.current = new THREE.OrbitControls(cameraRef.current, rendererRef.current.domElement);
            controlsRef.current.enableDamping = true;
            
            const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
            sceneRef.current.add(gridHelper);
            
            animate();
        } catch (e) {
            setError('Failed to initialize 3D viewer');
        }
    };

    const animate = () => {
        animationFrameRef.current = requestAnimationFrame(animate);
        controlsRef.current?.update();
        rendererRef.current?.render(sceneRef.current, cameraRef.current);
    };

    const addModelToScene = (modelScene) => {
        if (!sceneRef.current || !cameraRef.current) return;
        
        const existing = sceneRef.current.children.find(child => child.userData.isModel);
        if (existing) sceneRef.current.remove(existing);

        modelScene.userData.isModel = true;
        sceneRef.current.add(modelScene);
        
        const box = new THREE.Box3().setFromObject(modelScene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        
        const fitOffset = 1.5;
        const distance = maxDim / (2 * Math.tan(cameraRef.current.fov * Math.PI / 360));
        
        cameraRef.current.position.copy(center).add(new THREE.Vector3(0, size.y / 2, distance * fitOffset));
        cameraRef.current.lookAt(center);

        if (controlsRef.current) {
            controlsRef.current.target.copy(center);
            controlsRef.current.maxDistance = maxDim * 10;
            controlsRef.current.saveState();
            controlsRef.current.update();
        }
    };
    
    const unitFactors = { m: 1, cm: 0.01, mm: 0.001, in: 0.0254, ft: 0.3048 };

    const handleScaleConfirmation = () => {
        const scaleFactor = unitFactors[selectedUnit];
        const { scene } = modelData;
        
        // Crea una copia della scena per non modificare l'originale
        const scaledScene = scene.clone();
        scaledScene.scale.set(scaleFactor, scaleFactor, scaleFactor);
        
        const newBox = new THREE.Box3().setFromObject(scaledScene);
        const newCenter = newBox.getCenter(new THREE.Vector3());
        scaledScene.position.sub(newCenter);
        
        const finalAnalysis = window.ThreeDUtils.analyzeGeometry(scaledScene);
        setAnalysis(finalAnalysis);
        setNeedsScaleConfirmation(false);

        const finalModelData = { ...modelData, scene: scaledScene, analysis: finalAnalysis };
        setModelData(finalModelData);
        if (onModelLoaded) {
            onModelLoaded(finalModelData);
        }
    };
    
    const processInitialLoad = (modelScene, fileData) => {
        addModelToScene(modelScene);
        const initialAnalysis = window.ThreeDUtils.analyzeGeometry(modelScene);
        
        setModelData({ scene: modelScene, ...fileData });
        setRawAnalysis(initialAnalysis);
        
        const { width, height, depth } = initialAnalysis.dimensions;
        const maxDim = Math.max(width, height, depth);

        if (maxDim > 50 || maxDim < 0.2) {
             setNeedsScaleConfirmation(true);
        } else {
            setSelectedUnit('m');
            const finalModelData = { scene: modelScene, analysis: initialAnalysis, ...fileData };
            setAnalysis(initialAnalysis);
            setModelData(finalModelData);
            if (onModelLoaded) {
                onModelLoaded(finalModelData);
            }
        }
    };

    const loadModelFile = async (file) => {
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        setModelData(null);
        setNeedsScaleConfirmation(false);

        try {
            const url = URL.createObjectURL(file);
            let modelScene;

            if (/\.ply$/i.test(file.name)) {
                const loader = new THREE.PLYLoader();
                const geometry = await new Promise((res, rej) => loader.load(url, res, undefined, rej));
                geometry.computeVertexNormals();
                modelScene = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0xcccccc }));
            } else {
                const gltf = await window.ThreeDUtils.loadGLBModel(url, null);
                modelScene = gltf.scene;
            }
            
            processInitialLoad(modelScene, { fileName: file.name, fileSize: file.size });
            URL.revokeObjectURL(url);
        } catch (error) {
            setError(`Failed to load model: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const loadDemoModel = () => {
        const file = { name: 'DEMO_Room.glb', size: 123456, isDemo: true };
        const loader = new THREE.GLTFLoader();
        setIsLoading(true);
        setError(null);
        loader.load(
            'https://raw.githubusercontent.com/ninuxi/acoustic-space-analyzer-ai-pro/main/samples/DEMO_Empty_old_Garage_room.glb',
            (gltf) => {
                processInitialLoad(gltf.scene, file);
                setIsLoading(false);
            },
            undefined,
            () => {
                setError('Failed to load demo model.');
                setIsLoading(false);
            }
        );
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return 'N/A';
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + ['Bytes', 'KB', 'MB', 'GB'][i];
    };

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files[0]) loadModelFile(e.dataTransfer.files[0]);
    };
    const onFileSelect = (e) => { if (e.target.files[0]) loadModelFile(e.target.files[0]); };

    const renderScaleConfirmation = () => {
        if (!needsScaleConfirmation || !rawAnalysis) return null;
        const dim = rawAnalysis.dimensions;
        const newDim = {
            w: (dim.width * unitFactors[selectedUnit]).toFixed(2),
            h: (dim.height * unitFactors[selectedUnit]).toFixed(2),
            d: (dim.depth * unitFactors[selectedUnit]).toFixed(2),
        };
        return React.createElement('div', { className: 'card bg-purple-900/30 border border-purple-600' },
            React.createElement('div', { className: 'card-body text-center' },
                React.createElement('h3', { className: 'text-xl font-semibold text-purple-300' }, 'Confirm Model Scale'),
                React.createElement('p', { className: 'text-gray-400 mt-2' }, `Detected raw dimensions: ${dim.width.toFixed(0)} x ${dim.height.toFixed(0)} x ${dim.depth.toFixed(0)}`),
                React.createElement('p', { className: 'text-gray-300 font-medium my-4' }, 'In which unit was this model created?'),
                React.createElement('div', { className: 'flex flex-wrap justify-center gap-2' },
                    Object.keys(unitFactors).map(unit =>
                        React.createElement('button', { key: unit, onClick: () => setSelectedUnit(unit), className: `px-4 py-2 rounded-lg ${selectedUnit === unit ? 'bg-purple-600' : 'bg-gray-700'}` }, unit.toUpperCase())
                    )
                ),
                React.createElement('div', { className: 'mt-4 p-4 bg-gray-800 rounded-lg' },
                    React.createElement('p', { className: 'text-gray-300' }, 'Resulting dimensions in meters:'),
                    React.createElement('p', { className: 'text-2xl font-bold text-green-400' }, `${newDim.w}m (W) × ${newDim.h}m (H) × ${newDim.d}m (D)`)
                ),
                React.createElement('button', { onClick: handleScaleConfirmation, className: 'control-btn control-btn-success w-full mt-4 py-3' }, 'Confirm and Analyze')
            )
        );
    };
    
    // --- IL RENDER PRINCIPALE ---
    return React.createElement('div', { className: 'space-y-8' },
        React.createElement('div', { className: 'text-center' },
            React.createElement('h2', { className: 'text-3xl font-bold gradient-text mb-2' }, '3D Room Model'),
            React.createElement('p', { className: 'text-gray-400 text-lg' }, 'Upload a .glb, .gltf, or .ply model')
        ),
        
        // ZONA DI UPLOAD (Corretta)
        !modelData && !isLoading && React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-body' },
                React.createElement('div', {
                    className: `border-2 border-dashed rounded-xl p-12 text-center transition-all ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600'}`,
                    onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop
                },
                    React.createElement('h3', { className: 'text-xl font-semibold' }, 'Drop your 3D model here'),
                    React.createElement('p', { className: 'text-gray-400 my-2' }, 'or'),
                    React.createElement('div', { className: 'flex flex-col sm:flex-row gap-4 justify-center' },
                        React.createElement('button', { onClick: () => fileInputRef.current?.click(), className: 'control-btn control-btn-primary px-6 py-3' }, 'Choose File'),
                        React.createElement('button', { onClick: loadDemoModel, className: 'control-btn px-6 py-3' }, 'Load Demo Model')
                    ),
                    React.createElement('input', { ref: fileInputRef, type: 'file', accept: '.glb,.gltf,.ply', onChange: onFileSelect, className: 'hidden' })
                )
            )
        ),

        isLoading && React.createElement('div', { className: 'card text-center p-8' }, 'Loading Model...'),
        error && React.createElement('div', { className: 'card text-center p-8 text-red-400' }, error),

        renderScaleConfirmation(),

        React.createElement('div', { className: `card ${!analysis || needsScaleConfirmation ? 'hidden' : ''}` },
             React.createElement('div', { className: 'card-header' }, React.createElement('h3', { className: 'text-xl font-semibold' }, '3D Visualization')),
             React.createElement('div', { className: 'card-body p-0' },
                 React.createElement('div', { ref: containerRef, className: 'w-full h-96 bg-gray-800' })
             )
        ),
        
        analysis && !needsScaleConfirmation && React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-header' }, React.createElement('h3', { className: 'text-xl font-semibold' }, 'Final Model Analysis')),
            React.createElement('div', { className: 'card-body grid grid-cols-2 md:grid-cols-4 gap-4' },
                React.createElement('div', null, React.createElement('div', { className: 'text-sm' }, 'File Name'), React.createElement('div', { className: 'font-bold' }, modelData.fileName)),
                React.createElement('div', null, React.createElement('div', { className: 'text-sm' }, 'File Size'), React.createElement('div', { className: 'font-bold' }, formatFileSize(modelData.fileSize))),
                React.createElement('div', null, React.createElement('div', { className: 'text-sm' }, 'Volume'), React.createElement('div', { className: 'font-bold' }, `${analysis.dimensions.volume.toFixed(1)} m³`)),
                React.createElement('div', null, React.createElement('div', { className: 'text-sm' }, 'Surface Area'), React.createElement('div', { className: 'font-bold' }, `${analysis.totalSurfaceArea.toFixed(1)} m²`))
            )
        )
    );
};