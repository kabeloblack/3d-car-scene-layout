import React, { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom, Vignette, ToneMapping, BrightnessContrast, HueSaturation, DepthOfField } from '@react-three/postprocessing';
import { ToneMappingMode, DepthOfFieldEffect } from 'postprocessing';
import { OrbitControls, Html } from '@react-three/drei';
import { Environment } from './Environment';
import { CarModel } from './CarModel';
import { MercedesModel } from './MercedesModel';
import { BmwModel } from './BmwModel';
import { NissanModel } from './NissanModel';

// Z positions of each car slot
const CAR_Z = [5, -10, -25, -40, -55, -70];

// Scroll-driven camera that travels along the Z axis through cars
function ScrollRig({ disabled }: { disabled: boolean }) {
  const scrollProgress = useRef(0);
  const lerpedProgress = useRef(0);
  const disabledRef = useRef(disabled);

  useEffect(() => { disabledRef.current = disabled; }, [disabled]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (disabledRef.current) return;
      scrollProgress.current = THREE.MathUtils.clamp(
        scrollProgress.current + e.deltaY * 0.0012,
        0, 1
      );
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  useFrame((state, delta) => {
    if (disabled) return;
    lerpedProgress.current = THREE.MathUtils.lerp(
      lerpedProgress.current, scrollProgress.current, delta * 2.5
    );
    const targetCarZ = THREE.MathUtils.lerp(CAR_Z[0], CAR_Z[CAR_Z.length - 1], lerpedProgress.current);
    const camZ = targetCarZ + 12;
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, camZ, delta * 3);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 1.4, delta * 2);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 2, delta * 2);
  });

  return null;
}

// Smoothly moves camera to a zoom position in front of the selected car
function CameraZoomRig({ targetPos }: { targetPos: THREE.Vector3 | null }) {
  useFrame((state, delta) => {
    if (!targetPos) return;
    const zoomPos = new THREE.Vector3(
      targetPos.x + 1.5,
      targetPos.y + 1.4,
      targetPos.z + 7
    );
    state.camera.position.lerp(zoomPos, delta * 2.5);
  });
  return null;
}

// Every frame: points the DepthOfField effect at the nearest car (or selected car)
// target setter recalculates focusDistance internally — must reassign every frame
function FocusDriveEffect({
  carPositions,
  selectedCarPos,
  dofRef,
}: {
  carPositions: THREE.Vector3[];
  selectedCarPos: THREE.Vector3 | null;
  dofRef: React.MutableRefObject<DepthOfFieldEffect | null>;
}) {
  const { camera } = useThree();

  useFrame(() => {
    if (!dofRef.current) return;

    let best: THREE.Vector3 = carPositions[0];
    if (selectedCarPos) {
      best = selectedCarPos;
    } else {
      let minDist = Infinity;
      for (const pos of carPositions) {
        const d = camera.position.distanceTo(pos);
        if (d < minDist) { minDist = d; best = pos; }
      }
    }
    // Reassign every frame — the setter reads position at call time and updates the uniform
    dofRef.current.target = best;
  });

  return null;
}

// Wraps a car: handles world position + distance-based scale (bigger near camera, smaller far)
// When isSelected: pointer drag on the canvas rotates the car around its Y axis
function DepthScaleGroup({
  position,
  rotation,
  children,
  onClick,
  isSelected,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  isSelected?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const posVec = useMemo(() => new THREE.Vector3(...position), [position]);
  const extraRotY = useRef(0);
  const { gl } = useThree();

  useEffect(() => {
    if (!isSelected) return;
    let active = false;
    let lastX = 0;
    const onDown = (e: PointerEvent) => { active = true; lastX = e.clientX; };
    const onMove = (e: PointerEvent) => {
      if (!active) return;
      extraRotY.current += (e.clientX - lastX) * 0.012;
      lastX = e.clientX;
    };
    const onUp = () => { active = false; };
    gl.domElement.addEventListener('pointerdown', onDown);
    gl.domElement.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      gl.domElement.removeEventListener('pointerdown', onDown);
      gl.domElement.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [isSelected, gl]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const dist = state.camera.position.distanceTo(posVec);
    const scale = THREE.MathUtils.clamp(1.05 - Math.max(0, dist - 9) * 0.014, 0.48, 1.12);
    groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.07);
    if (isSelected) {
      groupRef.current.rotation.y = rotation[1] + extraRotY.current;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} onClick={onClick}>
      {children}
    </group>
  );
}

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
  const [selectedCar, setSelectedCar] = useState<{ id: string; position: [number, number, number] } | null>(null);
  const selectedCarPos = useMemo(
    () => (selectedCar ? new THREE.Vector3(...selectedCar.position) : null),
    [selectedCar]
  );

  // DoF: ref to the postprocessing effect — updated each frame by FocusDriveEffect
  const dofRef = useRef<DepthOfFieldEffect | null>(null);

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
      color: '#c8c8c8', // Pearl White
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

  // Pre-computed car world positions for nearest-car tracking
  const carPositions = useMemo(
    () => cars.map(c => new THREE.Vector3(...(c.position as [number, number, number]))),
    [cars]
  );

  return (
    <div className="relative w-full h-full" style={{ background: '#454545' }}>
      {/* Canvas */}
      <Canvas 
        shadows
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.75
        }}
        frameloop="always"
        camera={{ position: [2, 1.4, 12], fov: 40 }}
        onPointerMissed={() => setSelectedCar(null)}
      >
        <Suspense fallback={<Loader />}>
          <OrbitControls
            enabled={!selectedCar}
            enableDamping
            dampingFactor={0.06}
            enablePan
            enableZoom={false}
            screenSpacePanning={false}
            panSpeed={1.2}
            rotateSpeed={0.9}
            minPolarAngle={0.05}
            maxPolarAngle={Math.PI / 2 - 0.02}
            target={[0, 0.8, -25]}
            makeDefault
          />
          <fog attach="fog" color="#454545" near={28} far={115} />
          <ScrollRig disabled={!!selectedCar} />
          <CameraZoomRig targetPos={selectedCarPos} />
          <FocusDriveEffect
            carPositions={carPositions}
            selectedCarPos={selectedCarPos}
            dofRef={dofRef}
          />
          <Environment />
          
          {cars.map((c) => {
            const handleSelect = (e: React.MouseEvent) => {
              e.stopPropagation();
              setSelectedCar(prev => prev?.id === c.id ? null : { id: c.id, position: c.position as [number, number, number] });
            };
            return c.id === 'c1' ? (
              <DepthScaleGroup key={c.id} position={c.position as [number, number, number]} rotation={c.rotation as [number, number, number]} onClick={handleSelect} isSelected={selectedCar?.id === c.id}>
                <MercedesModel
                  position={[0, 0, 0]}
                  rotation={[0, 0, 0]}
                  name="Mercedes-AMG GT4"
                  specs={{ hp: 510, speed: 185, engine: 'AMG 4.0L V8' }}
                />
              </DepthScaleGroup>
            ) : c.id === 'c2' ? (
              <DepthScaleGroup key={c.id} position={c.position as [number, number, number]} rotation={c.rotation as [number, number, number]} onClick={handleSelect} isSelected={selectedCar?.id === c.id}>
                <BmwModel
                  position={[0, 0, 0]}
                  rotation={[0, 0, 0]}
                  name="BMW M3 E30"
                  specs={{ hp: 200, speed: 145, engine: '2.3L S14' }}
                />
              </DepthScaleGroup>
            ) : c.id === 'c3' ? (
              <DepthScaleGroup key={c.id} position={c.position as [number, number, number]} rotation={c.rotation as [number, number, number]} onClick={handleSelect} isSelected={selectedCar?.id === c.id}>
                <NissanModel
                  position={[0, 0, 0]}
                  rotation={[0, 0, 0]}
                  name="Nissan Skyline GT-R R34"
                  specs={{ hp: 500, speed: 185, engine: 'RB26DETT' }}
                />
              </DepthScaleGroup>
            ) : (
              <DepthScaleGroup key={c.id} position={c.position as [number, number, number]} rotation={c.rotation as [number, number, number]} onClick={handleSelect} isSelected={selectedCar?.id === c.id}>
                <CarModel
                  color={c.color}
                  position={[0, 0, 0]}
                  rotation={[0, 0, 0]}
                  name={c.name}
                  specs={c.specs}
                />
              </DepthScaleGroup>
            );
          })}

          <EffectComposer disableNormalPass multisampling={4}>
            <DepthOfField ref={dofRef} focalLength={0.008} bokehScale={1.5} height={480} />
            <Bloom intensity={0.08} luminanceThreshold={1.2} luminanceSmoothing={0.1} mipmapBlur radius={0.4} />
            <BrightnessContrast brightness={0.04} contrast={0.08} />
            <HueSaturation hue={0} saturation={-0.05} />
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
            <Vignette offset={0.35} darkness={0.45} eskil={false} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* Global UI Overlays */}
      <div className="absolute top-0 left-0 w-full p-8 flex justify-end items-start z-20 pointer-events-none">
        <div className="font-sans text-xs tracking-[0.2em] text-white/50 pointer-events-auto">
          SHOWROOM
        </div>
      </div>
      
      <div className="absolute bottom-10 left-0 w-full flex justify-center pointer-events-none z-20">
        <div className="bg-black/30 backdrop-blur-md border border-white/5 px-6 py-3 text-[10px] font-sans tracking-[0.2em] text-white/60 uppercase">
          {selectedCar ? 'Drag to rotate · Click car or empty space to exit' : 'Click a car to rotate · Scroll to travel · Drag to orbit'}
        </div>
      </div>
    </div>
  );
}
