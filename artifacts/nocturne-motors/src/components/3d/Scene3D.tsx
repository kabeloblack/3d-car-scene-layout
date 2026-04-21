import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useScroll, motion, useTransform } from 'framer-motion';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Environment } from './Environment';
import { CarModel } from './CarModel';
import { BikeModel } from './BikeModel';

function CameraRig({ scrollYProgress }: { scrollYProgress: any }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  useFrame((state, delta) => {
    // scrollYProgress goes from 0 to 1
    // We map 0 -> z=20 (hero view), 1 -> z=-150 (end of drive)
    const targetZ = 20 - scrollYProgress.get() * 170;
    
    // Smoothly interpolate camera position
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, delta * 5);
    
    // Add slight bobbing and weaving
    const bob = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    const weave = Math.cos(state.clock.elapsedTime * 1.5) * 0.05;
    
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 2.5 + bob, delta * 5);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, weave, delta * 5);
    
    // Look slightly down and forward
    state.camera.lookAt(weave * 2, 1, state.camera.position.z - 20);
  });

  return null;
}

export function Scene3D({ scrollYProgress }: { scrollYProgress: any }) {
  // Vehicle data
  const vehicles = useMemo(() => [
    {
      id: 'hero',
      type: 'car',
      carType: 'hypercar',
      color: '#ff2200',
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
      position: [3, 0, -20],
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
      position: [-3.5, 0, -45],
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
      position: [2.5, 0, -75],
      rotation: [0, -0.1, 0],
      name: 'Stealth Concept',
      specs: { hp: 1200, speed: 250, engine: 'Quad-Motor EV' }
    },
    {
      id: 'v4',
      type: 'bike',
      color: '#00ff88',
      accentColor: '#111',
      position: [-2.5, 0, -100],
      rotation: [0, 0.4, 0],
      name: 'Mantis Street',
      specs: { hp: 185, speed: 175, engine: '900cc Triple' }
    },
    {
      id: 'v5',
      type: 'car',
      carType: 'sedan',
      color: '#888888',
      accentColor: '#222',
      position: [3.5, 0, -125],
      rotation: [0, -0.2, 0],
      name: 'Executive RS',
      specs: { hp: 580, speed: 190, engine: 'Twin-Turbo V8' }
    }
  ], []);

  // Hero section overlay text that fades out as you scroll
  const heroOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.05], [0, -50]);

  return (
    <div className="relative w-full h-[600vh]">
      {/* Sticky container for Canvas */}
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-background">
        
        {/* Canvas */}
        <Canvas 
          shadows
          dpr={[1, 1.75]}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
          frameloop="always"
          camera={{ position: [0, 2.5, 20], fov: 45 }}
        >
          <Suspense fallback={null}>
            <CameraRig scrollYProgress={scrollYProgress} />
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

        {/* Hero HTML Overlay (only visible at top) */}
        <motion.div 
          style={{ opacity: heroOpacity, y: heroY }}
          className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center z-10"
        >
          <div className="space-y-4 px-4 max-w-4xl mt-32">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-primary tracking-[0.2em] font-mono text-sm uppercase"
            >
              The Night is Yours
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl lg:text-9xl font-serif text-foreground leading-[0.9] tracking-tighter"
            >
              NOCTURNE<br />MOTORS
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-muted-foreground max-w-xl mx-auto text-lg md:text-xl font-sans font-light"
            >
              Curators of automotive darkness. Rare machines built for the shadows.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center"
            >
              <span className="text-xs text-white/50 uppercase tracking-widest mb-4">Scroll to Explore</span>
              <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
            </motion.div>
          </div>
        </motion.div>

        {/* Global UI Overlays */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20 pointer-events-none">
          <div className="font-serif text-xl tracking-widest font-bold pointer-events-auto cursor-pointer">
            NOCTURNE
          </div>
          <nav className="hidden md:flex space-x-8 font-mono text-xs tracking-widest uppercase pointer-events-auto">
            <a href="#collection" className="hover:text-primary transition-colors">Collection</a>
            <a href="#concierge" className="hover:text-primary transition-colors">Concierge</a>
            <a href="#showroom" className="hover:text-primary transition-colors">Showroom</a>
          </nav>
          <button className="pointer-events-auto px-6 py-2 border border-white/20 hover:border-primary hover:text-primary transition-all font-mono text-xs uppercase tracking-widest">
            Inquire
          </button>
        </div>
      </div>
    </div>
  );
}
