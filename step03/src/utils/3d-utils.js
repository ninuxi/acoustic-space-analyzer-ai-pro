// File: src/utils/3d-utils.js
// VERSIONE 3 - Correzione calcolo area su modelli scalati

window.ThreeDUtils = {
    createScene: () => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a1a);
        scene.fog = new THREE.FogExp2(0x1a1a1a, 0.025);
        return scene;
    },

    createCamera: (width, height) => {
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.set(10, 5, 10);
        camera.lookAt(0, 0, 0);
        return camera;
    },

    createRenderer: (width, height) => {
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        return renderer;
    },

    createLighting: (scene) => {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(5, 10, 7.5);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        scene.add(dirLight);
    },

    loadGLBModel: (url, onProgress) => {
        return new Promise((resolve, reject) => {
            const loader = new THREE.GLTFLoader();
            loader.load(url, resolve, onProgress, reject);
        });
    },

    analyzeGeometry: (model) => {
        const analysis = {
            totalVertices: 0,
            totalFaces: 0,
            meshes: [],
            surfaces: [],
            totalSurfaceArea: 0
        };

        // --- INIZIO CODICE CORRETTO ---
        // Prima calcoliamo le dimensioni corrette tenendo conto della scala del modello
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        analysis.dimensions = {
            width: size.x,
            height: size.y,
            depth: size.z,
            volume: size.x * size.y * size.z
        };
        analysis.boundingBox = box;

        // Ora analizziamo la geometria, ma teniamo conto della scala per le aree
        const areaScaleFactor = model.scale.x * model.scale.y; // Assumiamo che la scala sia uniforme o quasi

        model.traverse((child) => {
            if (child.isMesh && child.geometry) {
                const geometry = child.geometry;
                if (!geometry.attributes.position) return;

                const vertices = geometry.attributes.position.count;
                const faces = geometry.index ? geometry.index.count / 3 : vertices / 3;
                analysis.totalVertices += vertices;
                analysis.totalFaces += Math.round(faces);

                const surfaceInfo = window.ThreeDUtils.categorizeSurfaces(geometry);
                
                // Applica il fattore di scala all'area di ogni superficie
                const scaledSurfaceInfo = surfaceInfo.map(s => ({
                    ...s,
                    area: s.area * areaScaleFactor 
                }));

                analysis.surfaces.push(...scaledSurfaceInfo);
            }
        });
        // --- FINE CODICE CORRETTO ---
        
        analysis.totalSurfaceArea = analysis.surfaces.reduce((sum, s) => sum + s.area, 0);

        return analysis;
    },

    categorizeSurfaces: (geometry) => {
        const surfaces = [];
        const positions = geometry.attributes.position.array;
        
        if (!geometry.attributes.normal) {
            geometry.computeVertexNormals();
        }
        const normals = geometry.attributes.normal.array;
        const indices = geometry.index ? geometry.index.array : null;

        const processTriangle = (i1, i2, i3) => {
            const n1 = new THREE.Vector3().fromArray(normals, i1 * 3);
            const n2 = new THREE.Vector3().fromArray(normals, i2 * 3);
            const n3 = new THREE.Vector3().fromArray(normals, i3 * 3);
            const avgNormal = n1.add(n2).add(n3).normalize();
            
            const v1 = new THREE.Vector3().fromArray(positions, i1 * 3);
            const v2 = new THREE.Vector3().fromArray(positions, i2 * 3);
            const v3 = new THREE.Vector3().fromArray(positions, i3 * 3);
            const area = new THREE.Triangle(v1, v2, v3).getArea();
            
            let surfaceType = 'wall';
            if (avgNormal.y > 0.85) surfaceType = 'ceiling';
            else if (avgNormal.y < -0.85) surfaceType = 'floor';
            
            surfaces.push({ type: surfaceType, area: area });
        };
        
        if (indices) {
            for (let i = 0; i < indices.length; i += 3) {
                processTriangle(indices[i], indices[i + 1], indices[i + 2]);
            }
        } else {
            for (let i = 0; i < positions.length / 9; i++) {
                processTriangle(i * 3, i * 3 + 1, i * 3 + 2);
            }
        }
        return surfaces;
    },
    
    handleResize: (camera, renderer, width, height) => {
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    },
    
    dispose: (scene, renderer) => {
        scene.traverse(object => {
            if (object.isMesh) {
                object.geometry.dispose();
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        renderer.dispose();
    },

    calculateRoomAcoustics: (roomModel, materialAssignments) => {
        if (!roomModel || !materialAssignments || !roomModel.analysis) return null;

        const volume = roomModel.analysis.dimensions.volume;
        const surfaces = roomModel.analysis.surfaces;
        const frequencyBands = window.OCTAVE_BANDS;

        const totalAbsorptionPerBand = {};
        frequencyBands.forEach(freq => {
            let totalAbsorption = 0;
            const surfacesByType = {};

            surfaces.forEach(s => {
                surfacesByType[s.type] = (surfacesByType[s.type] || 0) + s.area;
            });

            for (const type in surfacesByType) {
                const materialKey = materialAssignments[type];
                if (materialKey) {
                    const absorptionCoeff = window.MaterialUtils.getAbsorptionAtFrequency(materialKey, freq);
                    totalAbsorption += surfacesByType[type] * absorptionCoeff;
                }
            }
            totalAbsorptionPerBand[freq] = totalAbsorption;
        });

        const rt60PerBand = {};
        frequencyBands.forEach(freq => {
            rt60PerBand[freq] = window.Calculations.sabineRT60(volume, totalAbsorptionPerBand[freq]);
        });
        
        const validRt60Values = Object.values(rt60PerBand).filter(val => isFinite(val));
        const avgRT60 = validRt60Values.length > 0 ? validRt60Values.reduce((a, b) => a + b, 0) / validRt60Values.length : 0;
        
        return {
            volume,
            totalSurfaceArea: surfaces.reduce((sum, s) => sum + s.area, 0),
            rt60PerBand,
            avgRT60
        };
    }
};

console.log('3d-utils.js loaded and attached to window.');