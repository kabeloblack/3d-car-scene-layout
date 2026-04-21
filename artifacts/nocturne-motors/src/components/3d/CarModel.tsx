import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group, SpotLight, PointLight } from 'three';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

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

export function CarModel({
  color,
  accentColor = '#111',
  headlightColor = '#ffffff',
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  type = 'hypercar',
  name = 'Concept X',
  specs = { hp: 800, speed: 220, engine: 'V8' },
}: CarModelProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  // Animate hover effect
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

  const glassParams = {
    color: '#050505',
    metalness: 0.9,
    roughness: 0.1,
    transmission: 0.9,
    opacity: 0.8,
    transparent: true,
  };

  const isHypercar = type === 'hypercar';
  
  return (
    <group 
      ref={groupRef} 
      position={position} 
      rotation={rotation} 
      scale={scale}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      {/* Main Body (Chassis) */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[1.8, 0.4, 4.2]} />
        <meshPhysicalMaterial color={color} {...materialParams} />
      </mesh>

      {/* Cabin / Windshield */}
      <mesh castShadow receiveShadow position={[0, 0.8, -0.2]}>
        <boxGeometry args={[1.4, 0.45, 2.0]} />
        <meshPhysicalMaterial {...glassParams} />
      </mesh>

      {/* Front Hood */}
      <mesh castShadow receiveShadow position={[0, 0.6, 1.3]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[1.6, 0.2, 1.4]} />
        <meshPhysicalMaterial color={color} {...materialParams} />
      </mesh>

      {/* Wheels */}
      {[-1, 1].map((x) =>
        [-1.3, 1.4].map((z) => (
          <group key={`wheel-${x}-${z}`} position={[x * 0.95, 0.35, z]}>
            <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.35, 0.35, 0.3, 32]} />
              <meshStandardMaterial color="#111" roughness={0.8} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.25, 0.25, 0.32, 16]} />
              <meshStandardMaterial color={accentColor} metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))
      )}

      {/* Headlights */}
      {[-0.7, 0.7].map((x) => (
        <group key={`headlight-${x}`} position={[x, 0.55, 2.1]}>
          <mesh>
            <boxGeometry args={[0.3, 0.1, 0.1]} />
            <meshStandardMaterial 
              color={headlightColor} 
              emissive={headlightColor} 
              emissiveIntensity={hovered ? 5 : 2} 
            />
          </mesh>
          <spotLight
            color={headlightColor}
            intensity={hovered ? 20 : 10}
            angle={0.5}
            penumbra={0.5}
            position={[0, 0, 0]}
            target-position={[0, -0.5, 5]}
            castShadow
          />
        </group>
      ))}

      {/* Tail lights */}
      {[-0.7, 0.7].map((x) => (
        <mesh key={`taillight-${x}`} position={[x, 0.55, -2.1]}>
          <boxGeometry args={[0.4, 0.1, 0.1]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={hovered ? 4 : 2} />
        </mesh>
      ))}
      
      {/* Spoiler for hypercars */}
      {isHypercar && (
        <group position={[0, 0.9, -1.9]}>
          <mesh castShadow>
            <boxGeometry args={[1.6, 0.05, 0.4]} />
            <meshPhysicalMaterial color={accentColor} {...materialParams} />
          </mesh>
          <mesh castShadow position={[-0.6, -0.15, 0]}>
            <boxGeometry args={[0.05, 0.3, 0.2]} />
            <meshPhysicalMaterial color={accentColor} {...materialParams} />
          </mesh>
          <mesh castShadow position={[0.6, -0.15, 0]}>
            <boxGeometry args={[0.05, 0.3, 0.2]} />
            <meshPhysicalMaterial color={accentColor} {...materialParams} />
          </mesh>
        </group>
      )}

      {hovered && (
        <Html position={[0, 2, 0]} center zIndexRange={[100, 0]}>
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
