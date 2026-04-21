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
      <fog attach="fog" args={['#050404', 15, 120]} />

      {/* HDRI Environment for realistic lighting and reflections */}
      <DreiEnvironment preset="warehouse" environmentIntensity={1.2} background={false} />

      {/* Key Light: Warm, strong, casting soft shadows */}
      <directionalLight 
        position={[10, 15, 10]} 
        intensity={2.5} 
        color="#ffecd6" 
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Fill Light: Cool, subtle */}
      <directionalLight position={[-10, 10, 10]} intensity={0.5} color="#b3c6ff" />

      {/* Rim Light: Behind the cars to separate from background */}
      <directionalLight position={[0, 5, -50]} intensity={3} color="#ffffff" />

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
