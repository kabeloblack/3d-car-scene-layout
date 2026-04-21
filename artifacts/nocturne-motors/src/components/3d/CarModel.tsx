import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import * as THREE from 'three';
import { Html, useGLTF } from '@react-three/drei';

interface CarModelProps {
  color: string;
  accentColor?: string;
  headlightColor?: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  type?: 'hypercar' | 'sedan' | 'coupe';
  name?: string;
  specs?: { hp: number; speed: number; engine: string };
}

useGLTF.preload('https://threejs.org/examples/models/gltf/ferrari.glb');

export function CarModel({
  color,
  accentColor = '#111',
  headlightColor = '#ffffff',
  scale = 1.5,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  type = 'hypercar',
  name = 'Concept X',
  specs = { hp: 800, speed: 220, engine: 'V8' },
}: CarModelProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  const { scene } = useGLTF('https://threejs.org/examples/models/gltf/ferrari.glb');

  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        // The ferrari model usually has materials that can be tinted
        if (mesh.material) {
          const mat = mesh.material as THREE.Material;
          if (mat.name.toLowerCase().includes('body') || mat.name.toLowerCase().includes('paint')) {
            mesh.material = mat.clone();
            (mesh.material as THREE.MeshStandardMaterial).color = new THREE.Color(color);
          }
        }
      }
    });
    return clone;
  }, [scene, color]);

  // Animate hover effect
  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetScale = hovered ? scale * 1.05 : scale;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
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
      <primitive object={clonedScene} rotation={[0, Math.PI, 0]} />

      {/* Headlight pool — single spotlight per car, no shadows for perf */}
      {hovered && (
        <spotLight
          color={headlightColor}
          intensity={25}
          angle={0.6}
          penumbra={0.6}
          distance={30}
          decay={2}
          position={[0, 0.55, 2.1]}
          target-position={[0, -0.5, 8]}
        />
      )}

      {hovered && (
        <Html position={[0, 1.5, 0]} center zIndexRange={[100, 0]}>
          <div className="bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-none text-white w-64 transform -translate-x-1/2 transition-opacity duration-300 opacity-100">
            <h3 className="text-xl font-serif font-semibold tracking-wider text-primary mb-1 uppercase">{name}</h3>
            <div className="space-y-1 mb-4 text-xs font-mono text-white/70">
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span>Power</span>
                <span className="text-white">{specs.hp} HP</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span>Top Speed</span>
                <span className="text-white">{specs.speed} MPH</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span>Engine</span>
                <span className="text-white">{specs.engine}</span>
              </div>
            </div>
            <button className="w-full bg-primary/20 hover:bg-primary text-primary hover:text-black transition-colors py-2 text-xs font-mono tracking-widest uppercase border border-primary/50 pointer-events-auto cursor-pointer">
              Inquire
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}
