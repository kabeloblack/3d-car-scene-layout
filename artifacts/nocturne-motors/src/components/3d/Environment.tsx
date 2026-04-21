import React from 'react';
import { Environment as DreiEnvironment } from '@react-three/drei';

export function Environment() {
  return (
    <>
      {/* Studio HDR — used only for PBR reflections, not rendered as background */}
      <DreiEnvironment
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr"
        environmentIntensity={0.4}
        background={false}
      />

      {/* Explicit dark scene background */}
      <color attach="background" args={['#454545']} />

      {/* Key light — single soft source, low intensity since HDR handles ambient */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.6}
        color="#fff8f0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={220}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-bias={-0.001}
      />

      {/* Subtle rim light from behind for depth */}
      <directionalLight position={[-4, 6, -8]} intensity={0.25} color="#c8d8ff" />


    </>
  );
}
