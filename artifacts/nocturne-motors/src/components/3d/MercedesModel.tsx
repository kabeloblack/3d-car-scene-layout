import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import * as THREE from 'three';
import { Html, useGLTF } from '@react-three/drei';

const MODEL_URL = '/mercedes_amg_gt4.glb';

interface MercedesModelProps {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  name?: string;
  specs?: { hp: number; speed: number; engine: string };
}

useGLTF.preload(MODEL_URL);

export function MercedesModel({
  scale = 1.5,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  name = 'Mercedes-AMG GT4',
  specs = { hp: 510, speed: 185, engine: 'AMG 4.0L V8' },
}: MercedesModelProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const { scene } = useGLTF(MODEL_URL);

  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat.envMapIntensity !== undefined) mat.envMapIntensity = 1.5;
        }
      }
    });
    return clone;
  }, [scene]);

  useFrame((_state, delta) => {
    if (groupRef.current) {
      const targetScale = hovered ? scale * 1.02 : scale;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        delta * 4,
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <primitive object={clonedScene} />

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
            <h3 className="text-lg font-serif font-light tracking-widest text-white mb-2 uppercase">
              {name}
            </h3>
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
