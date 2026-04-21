import React, { useRef, useMemo } from 'react';
import { MeshReflectorMaterial, Environment as DreiEnvironment, AccumulativeShadows, RandomizedLight } from '@react-three/drei';
import * as THREE from 'three';

export function Environment() {
  const laneMarkers = useMemo(() => {
    const markers = [];
    for (let i = 0; i < 40; i++) {
      markers.push({ z: -i * 6 });
    }
    return markers;
  }, []);

  return (
    <>
      <color attach="background" args={['#050404']} />
      {/* Tighter, denser fog for volumetric depth */}
      <fog attach="fog" args={['#050404', 8, 70]} />

      {/* HDRI Environment for reflections only — kept low so it doesn't over-light */}
      <DreiEnvironment
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_03_1k.hdr"
        environmentIntensity={0.45}
        background={false}
      />

      {/* Key Light — warm, controlled, the only strong source */}
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.1}
        color="#ffe2b8"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Fill Light — cool, very subtle, just lifts the shadow side */}
      <directionalLight position={[-8, 6, 4]} intensity={0.18} color="#9ab4ff" />

      {/* Rim / Kicker — narrow back light for silhouette separation */}
      <directionalLight position={[-2, 3, -15]} intensity={0.6} color="#cfd8ff" />

      {/* High Quality Contact Shadows */}
      <AccumulativeShadows 
        temporal 
        frames={60} 
        color="#000000" 
        colorBlend={2} 
        toneMapped={true} 
        alphaTest={0.9} 
        opacity={1.5} 
        scale={100}
        position={[0, 0.02, -20]}
      >
        <RandomizedLight amount={8} radius={4} ambient={0.5} intensity={1} position={[5, 5, -10]} bias={0.001} />
      </AccumulativeShadows>

      {/* Cinematic Studio Floor / Wet Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 10]} receiveShadow>
        <planeGeometry args={[100, 300]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={512}
          mixBlur={1.5}
          mixStrength={2}
          roughness={0.2}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a0a0a"
          metalness={0.8}
          mirror={0.6}
        />
      </mesh>

      {/* Sidewalks/Grass (no reflection) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-52, -0.1, 10]} receiveShadow>
        <planeGeometry args={[4, 300]} />
        <meshStandardMaterial color="#020202" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[52, -0.1, 10]} receiveShadow>
        <planeGeometry args={[4, 300]} />
        <meshStandardMaterial color="#020202" roughness={1} />
      </mesh>

      {/* Lane Markers */}
      {laneMarkers.map((m, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, m.z]}>
          <planeGeometry args={[0.15, 2.5]} />
          <meshBasicMaterial color="#ffffff" opacity={0.15} transparent />
        </mesh>
      ))}
    </>
  );
}
