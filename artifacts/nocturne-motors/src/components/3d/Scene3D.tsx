import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { OrbitControls, Html } from '@react-three/drei';
import { Environment } from './Environment';
import { CarModel } from './CarModel';
import { BikeModel } from './BikeModel';

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
  // Vehicle data
  const vehicles = useMemo(() => [
    {
      id: 'hero',
      type: 'car',
      carType: 'hypercar',
      color: '#ff0000',
      accentColor: '#111',
      position: [0, 0, 5],
      rotation: [0, -0.5, 0],
      name: 'N-Corsa Hyper',
      specs: { hp: 1050, speed: 235, engine: 'Twin-Turbo V12' }
    },
    {
      id: 'v1',
      type: 'bike',
      color: '#ffffff',
      accentColor: '#222',
      position: [3, 0, -5],
      rotation: [0, -0.2, 0],
      name: 'Veloce RR',
      specs: { hp: 215, speed: 190, engine: '1000cc V4' }
    },
    {
      id: 'v2',
      type: 'car',
      carType: 'coupe',
      color: '#0044ff',
      accentColor: '#fff',
      position: [-3.5, 0, -20],
      rotation: [0, 0.3, 0],
      name: 'GranTurismo S',
      specs: { hp: 620, speed: 205, engine: '4.0L V8' }
    },
    {
      id: 'v3',
      type: 'car',
      carType: 'hypercar',
      color: '#111111',
      accentColor: '#ffa500',
      position: [2.5, 0, -40],
      rotation: [0, -0.1, 0],
      name: 'Stealth Concept',
      specs: { hp: 1200, speed: 250, engine: 'Quad-Motor EV' }
    },
    {
      id: 'v4',
      type: 'bike',
      color: '#00ff88',
      accentColor: '#111',
      position: [-2.5, 0, -55],
      rotation: [0, 0.4, 0],
      name: 'Mantis Street',
      specs: { hp: 185, speed: 175, engine: '900cc Triple' }
    },
    {
      id: 'v5',
      type: 'car',
      carType: 'sedan',
      color: '#ffffff',
      accentColor: '#222',
      position: [3.5, 0, -70],
      rotation: [0, -0.2, 0],
      name: 'Executive RS',
      specs: { hp: 580, speed: 190, engine: 'Twin-Turbo V8' }
    }
  ], []);

  return (
    <div className="relative w-full h-full">
      {/* Canvas */}
      <Canvas 
        shadows
        dpr={[1, 1.75]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        frameloop="always"
        camera={{ position: [0, 4, 15], fov: 45 }}
      >
        <Suspense fallback={<Loader />}>
          <OrbitControls 
            enableDamping
            dampingFactor={0.05}
            enablePan
            minDistance={3}
            maxDistance={80}
            minPolarAngle={0.1}
            maxPolarAngle={Math.PI / 2 - 0.05}
            target={[0, 1, 0]}
          />
          <Environment />
          
          {vehicles.map((v) => (
            v.type === 'car' ? (
              <CarModel
                key={v.id}
                type={v.carType as any}
                color={v.color}
                accentColor={v.accentColor}
                position={v.position as [number, number, number]}
                rotation={v.rotation as [number, number, number]}
                name={v.name}
                specs={v.specs}
              />
            ) : (
              <BikeModel
                key={v.id}
                color={v.color}
                accentColor={v.accentColor}
                position={v.position as [number, number, number]}
                rotation={v.rotation as [number, number, number]}
                name={v.name}
                specs={v.specs}
              />
            )
          ))}

          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* Global UI Overlays */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-20 pointer-events-none">
        <div className="font-serif text-xl tracking-widest font-bold pointer-events-auto">
          NOCTURNE MOTORS
        </div>
      </div>
      
      <div className="absolute bottom-8 left-0 w-full flex justify-center pointer-events-none z-20">
        <div className="bg-black/50 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full text-xs font-mono tracking-widest text-white/70 uppercase">
          Drag to look around &bull; Scroll to zoom
        </div>
      </div>
    </div>
  );
}
