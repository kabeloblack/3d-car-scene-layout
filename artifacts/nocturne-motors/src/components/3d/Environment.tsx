import React, { useMemo } from 'react';
import { MeshReflectorMaterial, Environment as DreiEnvironment, AccumulativeShadows, RandomizedLight } from '@react-three/drei';
import * as THREE from 'three';

// Procedurally generated asphalt normal map — small grainy bumps, no external assets
function makeAsphaltNormal(): THREE.DataTexture {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const n = Math.random() * 0.4 - 0.2;
    data[i * 4 + 0] = 128 + n * 80;
    data[i * 4 + 1] = 128 + (Math.random() * 0.4 - 0.2) * 80;
    data[i * 4 + 2] = 255;
    data[i * 4 + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

export function Environment() {
  const asphaltNormal = useMemo(() => {
    const t = makeAsphaltNormal();
    t.repeat.set(40, 120);
    t.anisotropy = 8;
    return t;
  }, []);

  return (
    <>
      {/* Real moonless-night HDRI as the actual sky */}
      <DreiEnvironment
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/moonless_golf_2k.hdr"
        environmentIntensity={0.6}
        background
        backgroundBlurriness={0.05}
        backgroundIntensity={0.7}
      />

      {/* Soft atmospheric fog blending into the night */}
      <fog attach="fog" args={['#06070d', 12, 90]} />

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

      {/* Dark asphalt road — procedural, no external texture deps */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 10]} receiveShadow>
        <planeGeometry args={[400, 600]} />
        <MeshReflectorMaterial
          blur={[300, 80]}
          resolution={512}
          mixBlur={1.0}
          mixStrength={0.5}
          mixContrast={1.0}
          depthScale={0.6}
          minDepthThreshold={0.5}
          maxDepthThreshold={1.4}
          color="#0e0e10"
          metalness={0.1}
          roughness={0.92}
          mirror={0.1}
          normalMap={asphaltNormal}
          normalScale={new THREE.Vector2(0.4, 0.4)}
        />
      </mesh>
    </>
  );
}
