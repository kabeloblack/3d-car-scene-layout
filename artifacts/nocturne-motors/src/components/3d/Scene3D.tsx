import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom, Vignette, ToneMapping, ChromaticAberration, BrightnessContrast, HueSaturation } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { OrbitControls, Html } from '@react-three/drei';
import { Environment } from './Environment';
import { CarModel } from './CarModel';

function Loader() {
  return (
    <Html center>
      <div className="text-white font-mono tracking-widest text-sm uppercase">
        Loading scene...
      </div>
    </Html>
  );
}

export function Scene3D() {
  // Premium Automotive Palette
  const cars = useMemo(() => [
    {
      id: 'c1',
      color: '#8b0000', // Candy Red
      position: [0, 0, 5],
      rotation: [0, -0.2, 0],
      name: 'Rosso Corsa Hyper',
      specs: { hp: 1050, speed: 235, engine: 'Twin-Turbo V12' }
    },
    {
      id: 'c2',
      color: '#ffffff', // Pearl White
      position: [2.5, 0, -10],
      rotation: [0, -0.3, 0],
      name: 'Bianco Fuji Coupe',
      specs: { hp: 820, speed: 210, engine: 'Hybrid V8' }
    },
    {
      id: 'c3',
      color: '#001133', // Midnight Blue
      position: [-2.0, 0, -25],
      rotation: [0, 0.15, 0],
      name: 'Blu Tour Tourer',
      specs: { hp: 620, speed: 205, engine: '4.0L V8' }
    },
    {
      id: 'c4',
      color: '#1a1a1a', // Matte Charcoal
      position: [1.5, 0, -40],
      rotation: [0, -0.1, 0],
      name: 'Nero Stealth',
      specs: { hp: 1200, speed: 250, engine: 'Quad-Motor EV' }
    },
    {
      id: 'c5',
      color: '#ffcc00', // Electric Yellow
      position: [-1.8, 0, -55],
      rotation: [0, 0.25, 0],
      name: 'Giallo Modena Track',
      specs: { hp: 950, speed: 220, engine: 'V12' }
    },
    {
      id: 'c6',
      color: '#44444a', // Steel Gray
      position: [0.5, 0, -70],
      rotation: [0, -0.1, 0],
      name: 'Grigio Silverstone',
      specs: { hp: 880, speed: 215, engine: 'V8' }
    }
  ], []);

  return (
    <div className="relative w-full h-full bg-[#050404]">
      {/* Canvas */}
      <Canvas 
        shadows
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.65
        }}
        frameloop="always"
        camera={{ position: [2, 1.4, 12], fov: 40 }} // Cinematic low angle
      >
        <Suspense fallback={<Loader />}>
          <OrbitControls
            enableDamping
            dampingFactor={0.06}
            enablePan
            screenSpacePanning={false}
            panSpeed={1.2}
            zoomSpeed={1.1}
            rotateSpeed={0.9}
            minDistance={1.5}
            maxDistance={200}
            minPolarAngle={0.05}
            maxPolarAngle={Math.PI / 2 - 0.02}
            target={[0, 0.8, -25]}
            makeDefault
          />
          <Environment />
          
          {cars.map((c) => (
            <CarModel
              key={c.id}
              color={c.color}
              position={c.position as [number, number, number]}
              rotation={c.rotation as [number, number, number]}
              name={c.name}
              specs={c.specs}
            />
          ))}

          <EffectComposer disableNormalPass multisampling={4}>
            {/* Restrained cinematic grade — only true highlights bloom */}
            <Bloom intensity={0.18} luminanceThreshold={1.0} luminanceSmoothing={0.2} mipmapBlur radius={0.55} />
            <BrightnessContrast brightness={-0.06} contrast={0.22} />
            <HueSaturation hue={0} saturation={-0.15} />
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
            <ChromaticAberration offset={new THREE.Vector2(0.0004, 0.0004)} radialModulation={false} modulationOffset={0} />
            <Vignette offset={0.2} darkness={0.9} eskil={false} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* Global UI Overlays */}
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start z-20 pointer-events-none">
        <div className="font-serif text-2xl tracking-[0.2em] font-light text-white/90 pointer-events-auto">
          NOCTURNE
        </div>
        <div className="font-sans text-xs tracking-[0.2em] text-white/50 pointer-events-auto">
          SHOWROOM
        </div>
      </div>
      
      <div className="absolute bottom-10 left-0 w-full flex justify-center pointer-events-none z-20">
        <div className="bg-black/30 backdrop-blur-md border border-white/5 px-6 py-3 text-[10px] font-sans tracking-[0.2em] text-white/60 uppercase">
          Left-drag to orbit &bull; Right-drag to pan &bull; Scroll to zoom
        </div>
      </div>
    </div>
  );
}
