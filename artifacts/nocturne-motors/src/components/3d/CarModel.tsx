import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import * as THREE from 'three';
import { Html, useGLTF } from '@react-three/drei';

interface CarModelProps {
  color: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  name?: string;
  specs?: { hp: number; speed: number; engine: string };
}

useGLTF.preload('https://threejs.org/examples/models/gltf/ferrari.glb');

export function CarModel({
  color,
  scale = 1.5,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  name = 'Concept X',
  specs = { hp: 800, speed: 220, engine: 'V8' },
}: CarModelProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  const { scene } = useGLTF('https://threejs.org/examples/models/gltf/ferrari.glb');

  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    
    // Premium Materials
    // Real car paint: low metalness (diffuse base), shine comes from clearcoat layer only
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      metalness: 0.08,
      roughness: 0.42,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.2,
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0a0a14'),
      metalness: 0.0,
      roughness: 0.05,
      transmission: 0.9,
      ior: 1.5,
      thickness: 0.5,
      envMapIntensity: 1.5,
      transparent: true,
    });

    const tireMaterial = new THREE.MeshStandardMaterial({
      color: '#111',
      roughness: 0.95,
      metalness: 0.1,
      envMapIntensity: 1.5,
    });

    const rimMaterial = new THREE.MeshStandardMaterial({
      color: '#aaaaaa',
      roughness: 0.1,
      metalness: 0.9,
      envMapIntensity: 1.5,
    });

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        if (mesh.material) {
          const matName = (mesh.material as THREE.Material).name.toLowerCase();
          
          if (matName.includes('body') || matName.includes('paint') || matName.includes('yellow')) {
            mesh.material = bodyMaterial;
          } else if (matName.includes('glass') || matName.includes('window') || matName.includes('windshield')) {
            mesh.material = glassMaterial;
            mesh.castShadow = false;
          } else if (matName.includes('tire') || matName.includes('rubber')) {
            mesh.material = tireMaterial;
          } else if (matName.includes('rim') || matName.includes('alloy') || matName.includes('metal')) {
            mesh.material = rimMaterial;
          } else {
            // Apply envMapIntensity to any other mesh material
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat.envMapIntensity !== undefined) mat.envMapIntensity = 1.5;
          }
        }
      }
    });
    return clone;
  }, [scene, color]);

  // Animate hover effect gently
  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetScale = hovered ? scale * 1.02 : scale;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 4);
    }
  });
  
  return (
    <group 
      ref={groupRef} 
      position={position} 
      rotation={rotation} 
      scale={scale}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      {/* Note: Ferrari GLTF is usually facing backwards or needs Pi rotation depending on source.
          Adjusting rotation to face forward (along Z). */}
      <primitive object={clonedScene} rotation={[0, Math.PI, 0]} />

      {/* Headlight pool — restrained, only on hover */}
      {hovered && (
        <spotLight
          color="#fff5e0"
          intensity={3}
          angle={0.35}
          penumbra={0.9}
          distance={14}
          decay={2}
          position={[0, 0.6, 2.1]}
          target-position={[0, 0, 8]}
        />
      )}

      {hovered && (
        <Html position={[0, 1.2, 0]} center zIndexRange={[100, 0]}>
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-5 rounded-none text-white w-64 transform -translate-x-1/2 transition-opacity duration-500 opacity-100 shadow-2xl">
            <h3 className="text-lg font-serif font-light tracking-widest text-white mb-2 uppercase">{name}</h3>
            <div className="space-y-2 mb-5 text-[10px] font-sans tracking-widest text-white/50 uppercase">
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span>Power</span>
                <span className="text-white/90">{specs.hp} HP</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span>Speed</span>
                <span className="text-white/90">{specs.speed} MPH</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span>Motor</span>
                <span className="text-white/90">{specs.engine}</span>
              </div>
            </div>
            <button className="w-full bg-white/5 hover:bg-white/10 text-white/90 transition-colors py-3 text-[10px] font-sans tracking-[0.2em] uppercase border border-white/10 pointer-events-auto cursor-pointer">
              View Details
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}
