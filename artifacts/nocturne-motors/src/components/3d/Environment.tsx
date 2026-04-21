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
      {/* Driving School — outdoor asphalt circuit, clear sky, high-contrast sun */}
      <DreiEnvironment
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/driving_school_2k.hdr"
        environmentIntensity={1.0}
        background
        backgroundBlurriness={0.8}
        backgroundIntensity={1.0}
      />

      {/* Dark asphalt road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 10]} receiveShadow>
        <planeGeometry args={[400, 600]} />
        <meshStandardMaterial
          color="#0a0a0c"
          roughness={0.95}
          metalness={0.05}
          normalMap={asphaltNormal}
          normalScale={new THREE.Vector2(0.5, 0.5)}
          envMapIntensity={0.2}
        />
      </mesh>
    </>
  );
}
