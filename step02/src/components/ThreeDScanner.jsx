// src/components/ThreeDScanner.jsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeDScanner({ spatialData }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    const camera = new THREE.PerspectiveCamera(75, 400 / 300, 0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(400, 300);
    canvasRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(4, 3, 5);
    const material = new THREE.MeshBasicMaterial({ color: 0x4a4a4a, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const animate = () => {
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (canvasRef.current && renderer.domElement.parentElement) {
        canvasRef.current.removeChild(renderer.domElement);
      }
    };
  }, [spatialData]);

  return (
    <div className="bg-gray-800 p-6 rounded-xl">
      <h3 className="text-xl font-bold mb-4">3D Room Visualization</h3>
      <div ref={canvasRef}></div>
    </div>
  );
}