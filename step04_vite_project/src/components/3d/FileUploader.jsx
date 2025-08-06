// File: src/components/3d/FileUploader.jsx

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { ThreeDUtils } from '../../utils/3d-utils.js';

const FileUploader = ({ onModelLoaded }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [modelData, setModelData] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);
    
    // Stati per la gestione della scala
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
    
    useEffect(() => {
        if (containerRef.current) {
            initializeScene();
        }
        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            // Aggiungi qui altre operazioni di cleanup se necessario
        };
    }, []);

    const initializeScene = () => {
        try {
            const container = containerRef.current;
            const width = container.clientWidth;
            const height = container.clientHeight;
            
            sceneRef.current = ThreeDUtils.createScene();
            cameraRef.current = ThreeDUtils.createCamera(width, height);
            rendererRef.current = ThreeDUtils.createRenderer(width, height);
            container.appendChild(rendererRef.current.domElement);
            ThreeDUtils.createLighting(sceneRef.current);
            
            controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
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
            controlsRef.current.update();
        }
    };
    
    const unitFactors = { m: 1, cm: 0.01, mm: 0.001, in: 0.0254, ft: 0.3048 };

    const handleScaleConfirmation = () => {
        const scaleFactor = unitFactors[selectedUnit];
        const { scene } = modelData;
        
        const scaledScene = scene.clone();
        scaledScene.scale.set(scaleFactor, scaleFactor, scaleFactor);
        
        const newBox = new THREE.Box3().setFromObject(scaledScene);
        const newCenter = newBox.getCenter(new THREE.Vector3());
        scaledScene.position.sub(newCenter);
        
        const finalAnalysis = ThreeDUtils.analyzeGeometry(scaledScene);
        setAnalysis(finalAnalysis);
        setNeedsScaleConfirmation(false);

        const finalModelData = { ...modelData, scene: scaledScene, analysis: finalAnalysis };
        setModelData(finalModelData);
        if (onModelLoaded) onModelLoaded(finalModelData);
    };
    
    const processInitialLoad = (modelScene, fileData) => {
        addModelToScene(modelScene);
        const initialAnalysis = ThreeDUtils.analyzeGeometry(modelScene);
        
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
            if (onModelLoaded) onModelLoaded(finalModelData);
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
                const geometry = await new PLYLoader().loadAsync(url);
                geometry.computeVertexNormals();
                modelScene = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0xcccccc }));
            } else {
                const gltf = await ThreeDUtils.loadGLBModel(url, null);
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
        setIsLoading(true);
        setError(null);
        ThreeDUtils.loadGLBModel('https://raw.githubusercontent.com/ninuxi/acoustic-space-analyzer-ai-pro/main/samples/DEMO_Empty_old_Garage_room.glb')
            .then(gltf => {
                processInitialLoad(gltf.scene, file);
            })
            .catch(() => setError('Failed to load demo model.'))
            .finally(() => setIsLoading(false));
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
        return (
            <div className="card bg-purple-900/30 border border-purple-600">
                <div className="card-body text-center">
                    <h3 className="text-xl font-semibold text-purple-300">Confirm Model Scale</h3>
                    <p className="text-gray-600 mt-2">{`Detected raw dimensions: ${dim.width.toFixed(0)} x ${dim.height.toFixed(0)} x ${dim.depth.toFixed(0)}`}</p>
                    <p className="text-gray-300 font-medium my-4">In which unit was this model created?</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {Object.keys(unitFactors).map(unit => (
                            <button key={unit} onClick={() => setSelectedUnit(unit)} className={`px-4 py-2 rounded-lg ${selectedUnit === unit ? 'bg-purple-600' : 'bg-gray-700'}`}>
                                {unit.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <div className="mt-4 p-4 bg-white rounded-lg">
                        <p className="text-gray-300">Resulting dimensions in meters:</p>
                        <p className="text-2xl font-bold text-green-400">{`${newDim.w}m (W) × ${newDim.h}m (H) × ${newDim.d}m (D)`}</p>
                    </div>
                    <button onClick={handleScaleConfirmation} className="control-btn control-btn-success w-full mt-4 py-3">Confirm and Analyze</button>
                </div>
            </div>
        );
    };
    
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold gradient-text mb-2">3D Room Model</h2>
                <p className="text-gray-600 text-lg">Upload a .glb, .gltf, or .ply model</p>
            </div>
            
            {!modelData && !isLoading && (
                <div className="card bg-white border border-gray-200">
                    <div className="card-body">
                        <div
                            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600'}`}
                            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                        >
                            <h3 className="text-xl font-semibold">Drop your 3D model here</h3>
                            <p className="text-gray-600 my-2">or</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button onClick={() => fileInputRef.current?.click()} className="control-btn control-btn-primary px-6 py-3">Choose File</button>
                                <button onClick={loadDemoModel} className="control-btn px-6 py-3">Load Demo Model</button>
                            </div>
                            <input ref={fileInputRef} type="file" accept=".glb,.gltf,.ply" onChange={onFileSelect} className="hidden" />
                        </div>
                    </div>
                </div>
            )}

            {isLoading && <div className="card text-center p-8">Loading Model...</div>}
            {error && <div className="card text-center p-8 text-red-400">{error}</div>}

            {renderScaleConfirmation()}

            <div className={`card ${!analysis || needsScaleConfirmation ? 'hidden' : ''}`}>
                <div className="card-header"><h3 className="text-xl font-semibold">3D Visualization</h3></div>
                <div className="card-body p-0">
                    <div ref={containerRef} className="w-full h-96 bg-white" />
                </div>
            </div>
            
            {analysis && !needsScaleConfirmation && (
                <div className="card bg-white border border-gray-200">
                    <div className="card-header"><h3 className="text-xl font-semibold">Final Model Analysis</h3></div>
                    <div className="card-body grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div><div className="text-sm">File Name</div><div className="font-bold">{modelData.fileName}</div></div>
                        <div><div className="text-sm">File Size</div><div className="font-bold">{formatFileSize(modelData.fileSize)}</div></div>
                        <div><div className="text-sm">Volume</div><div className="font-bold">{`${analysis.dimensions.volume.toFixed(1)} m³`}</div></div>
                        <div><div className="text-sm">Surface Area</div><div className="font-bold">{`${analysis.totalSurfaceArea.toFixed(1)} m²`}</div></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUploader;