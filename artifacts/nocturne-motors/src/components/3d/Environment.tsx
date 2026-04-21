import React, { useRef, useMemo } from 'react';
import { MeshReflectorMaterial, Environment as DreiEnvironment, AccumulativeShadows, RandomizedLight, useTexture } from '@react-three/drei';
import * as THREE from 'three';

export function Environment() {
  // Real asphalt PBR textures from Poly Haven (CC0)
  const [asphaltDiff, asphaltNormal, asphaltRough] = useTexture([
    'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/aerial_asphalt_01/aerial_asphalt_01_diff_1k.jpg',
    'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/aerial_asphalt_01/aerial_asphalt_01_nor_gl_1k.jpg',
    'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/aerial_asphalt_01/aerial_asphalt_01_rough_1k.jpg',
  ]);

  useMemo(() => {
    [asphaltDiff, asphaltNormal, asphaltRough].forEach((t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(20, 60);
      t.anisotropy = 8;
    });
    asphaltDiff.colorSpace = THREE.SRGBColorSpace;
  }, [asphaltDiff, asphaltNormal, asphaltRough]);

  return (
    <>
      {/* Big realistic night HDRI as the actual sky/skybox */}
      <DreiEnvironment
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/dikhololo_night_2k.hdr"
        environmentIntensity={0.8}
        background
        backgroundBlurriness={0.0}
        backgroundIntensity={1.0}
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

      {/* Real asphalt road floor — PBR textured, slightly damp for subtle reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 10]} receiveShadow>
        <planeGeometry args={[400, 600]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mixBlur={1.0}
          mixStrength={0.6}
          mixContrast={1.0}
          depthScale={0.8}
          minDepthThreshold={0.5}
          maxDepthThreshold={1.4}
          color="#5a5a5a"
          metalness={0.15}
          roughness={0.85}
          mirror={0.15}
          map={asphaltDiff}
          normalMap={asphaltNormal}
          roughnessMap={asphaltRough}
          normalScale={new THREE.Vector2(0.6, 0.6)}
        />
      </mesh>
    </>
  );
}
