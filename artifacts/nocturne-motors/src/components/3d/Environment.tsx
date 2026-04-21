import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function Environment() {
  const streetlampPositions = useMemo(() => {
    const lamps = [];
    for (let i = 0; i < 20; i++) {
      const z = -i * 30;
      lamps.push({ x: -12, z });
      lamps.push({ x: 12, z });
    }
    return lamps;
  }, []);

  const skylineBuildings = useMemo(() => {
    const buildings = [];
    for (let i = 0; i < 60; i++) {
      buildings.push({
        x: (Math.random() - 0.5) * 200,
        z: -150 - Math.random() * 200,
        w: 5 + Math.random() * 15,
        h: 20 + Math.random() * 80,
        d: 5 + Math.random() * 15,
      });
    }
    return buildings;
  }, []);

  const laneMarkers = useMemo(() => {
    const markers = [];
    for (let i = 0; i < 100; i++) {
      markers.push({ z: -i * 6 });
    }
    return markers;
  }, []);

  return (
    <>
      <color attach="background" args={['#020202']} />
      <fog attach="fog" args={['#050508', 10, 150]} />

      {/* Dim ambient light */}
      <ambientLight intensity={0.1} color="#ffffff" />
      
      {/* Moonlight */}
      <directionalLight position={[100, 100, -50]} intensity={0.2} color="#a0b0ff" />

      {/* Road with wet reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 50]} receiveShadow>
        <planeGeometry args={[40, 600]} />
        <MeshReflectorMaterial
          blur={[300, 80]}
          resolution={512}
          mixBlur={1}
          mixStrength={1.2}
          roughness={0.3}
          depthScale={1}
          minDepthThreshold={0.5}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.7}
          mirror={0.4}
        />
      </mesh>

      {/* Sidewalks/Grass (no reflection) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-40, -0.1, 50]} receiveShadow>
        <planeGeometry args={[40, 600]} />
        <meshStandardMaterial color="#020202" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[40, -0.1, 50]} receiveShadow>
        <planeGeometry args={[40, 600]} />
        <meshStandardMaterial color="#020202" roughness={1} />
      </mesh>

      {/* Lane Markers */}
      {laneMarkers.map((m, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, m.z]}>
          <planeGeometry args={[0.2, 3]} />
          <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
        </mesh>
      ))}

      {/* Streetlamps */}
      {streetlampPositions.map((pos, i) => (
        <group key={`lamp-${i}`} position={[pos.x, 0, pos.z]}>
          {/* Post */}
          <mesh position={[0, 4, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 8]} />
            <meshStandardMaterial color="#111" roughness={0.8} />
          </mesh>
          {/* Arm */}
          <mesh position={[pos.x < 0 ? 1 : -1, 7.8, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 2]} />
            <meshStandardMaterial color="#111" roughness={0.8} />
          </mesh>
          {/* Light fixture */}
          <mesh position={[pos.x < 0 ? 2 : -2, 7.8, 0]}>
            <boxGeometry args={[0.6, 0.2, 0.4]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          {/* Bulb */}
          <mesh position={[pos.x < 0 ? 2 : -2, 7.7, 0]}>
            <planeGeometry args={[0.5, 0.3]} />
            <meshBasicMaterial color="#ffa500" />
          </mesh>
          {pos.z > -90 && i < 12 ? (
            <pointLight
              position={[pos.x < 0 ? 2 : -2, 7.5, 0]}
              color="#ffaa00"
              intensity={6}
              distance={45}
              decay={2}
            />
          ) : null}
        </group>
      ))}

      {/* Skyline */}
      {skylineBuildings.map((b, i) => (
        <mesh key={`building-${i}`} position={[b.x, b.h / 2 - 2, b.z]}>
          <boxGeometry args={[b.w, b.h, b.d]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      ))}

      {/* Sky & Atmosphere */}
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={500} scale={[40, 10, 200]} size={2} speed={0.2} opacity={0.1} color="#ffffff" />
    </>
  );
}
