import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

interface BikeModelProps {
  color: string;
  accentColor?: string;
  headlightColor?: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  name?: string;
  specs?: { hp: number; speed: number; engine: string };
}

export function BikeModel({
  color,
  accentColor = '#222',
  headlightColor = '#ffffff',
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  name = 'Superbike',
  specs = { hp: 200, speed: 180, engine: 'Inline-4' },
}: BikeModelProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetScale = hovered ? scale * 1.05 : scale;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
    }
  });

  const materialParams = {
    metalness: 0.9,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  };

  return (
    <group 
      ref={groupRef} 
      position={position} 
      rotation={rotation} 
      scale={scale}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      {/* Main Body / Tank */}
      <mesh castShadow receiveShadow position={[0, 0.7, 0]}>
        <boxGeometry args={[0.5, 0.4, 1.8]} />
        <meshPhysicalMaterial color={color} {...materialParams} />
      </mesh>

      {/* Front Fairing */}
      <mesh castShadow receiveShadow position={[0, 0.8, 0.8]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.6, 0.5, 0.6]} />
        <meshPhysicalMaterial color={color} {...materialParams} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 1.1, 0.9]} rotation={[-0.4, 0, 0]}>
        <planeGeometry args={[0.4, 0.5]} />
        <meshPhysicalMaterial color="#000" transmission={0.9} opacity={0.8} transparent roughness={0.1} />
      </mesh>

      {/* Seat & Tail */}
      <mesh castShadow receiveShadow position={[0, 0.8, -0.6]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.4, 0.2, 1.0]} />
        <meshPhysicalMaterial color="#111" roughness={0.9} />
      </mesh>

      {/* Engine Area */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0.2]}>
        <boxGeometry args={[0.45, 0.5, 1.0]} />
        <meshStandardMaterial color={accentColor} metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Wheels */}
      {[-0.9, 1.1].map((z) => (
        <group key={`bike-wheel-${z}`} position={[0, 0.35, z]}>
          <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.35, 0.35, 0.2, 32]} />
            <meshStandardMaterial color="#111" roughness={0.8} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.22, 16]} />
            <meshStandardMaterial color={accentColor} metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Headlight */}
      <group position={[0, 0.8, 1.1]}>
        <mesh>
          <boxGeometry args={[0.3, 0.15, 0.1]} />
          <meshStandardMaterial color={headlightColor} emissive={headlightColor} emissiveIntensity={hovered ? 5 : 2} />
        </mesh>
        <spotLight
          color={headlightColor}
          intensity={hovered ? 15 : 8}
          angle={0.4}
          penumbra={0.5}
          position={[0, 0, 0]}
          target-position={[0, -0.5, 5]}
          castShadow
        />
      </group>

      {/* Tail light */}
      <mesh position={[0, 0.85, -1.1]}>
        <boxGeometry args={[0.2, 0.05, 0.1]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={hovered ? 4 : 2} />
      </mesh>

      {/* Exhaust */}
      <mesh position={[0.3, 0.3, -0.8]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6]} />
        <meshStandardMaterial color="#888" metalness={0.9} roughness={0.3} />
      </mesh>

      {hovered && (
        <Html position={[0, 1.8, 0]} center zIndexRange={[100, 0]}>
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
            <button className="w-full bg-primary/20 hover:bg-primary text-primary hover:text-black transition-colors py-2 text-xs font-mono tracking-widest uppercase border border-primary/50">
              Inquire
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}
