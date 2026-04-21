import React, { useMemo } from 'react';
import { Environment as DreiEnvironment } from '@react-three/drei';
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
        environmentIntensity={0.35}
        background
        backgroundBlurriness={0.15}
        backgroundIntensity={0.45}
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

      {/* Dark asphalt road — flat dark material, no reflection blow-out */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 10]} receiveShadow>
        <planeGeometry args={[400, 600]} />
        <meshStandardMaterial
          color="#0a0a0c"
          roughness={0.95}
          metalness={0.05}
          normalMap={asphaltNormal}
          normalScale={new THREE.Vector2(0.5, 0.5)}
          envMapIntensity={0.15}
        />
      </mesh>
    </>
  );
}
