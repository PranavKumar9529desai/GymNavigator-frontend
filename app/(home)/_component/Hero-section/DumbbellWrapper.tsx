"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";
import { DumbbellScene } from "./Dumbbell";

// Theme colors from theme.ts
const themeBlue = {
  light: "#66a9ff", // primary.300
  medium: "#3390ff", // primary.400
  main: "#0077ff", // primary.500
  dark: "#004eac", // primary.700
};

// Cinematic lighting component for better visual control
function CinematicLighting() {
  // Main top spotlight - dramatic effect
  const _spotLightRef = useRef<THREE.SpotLight>(null);
  const _spotLightTarget = useRef<THREE.Object3D>(null);

  return (
    <>
      {/* Ambient lighting for base brightness */}
      <ambientLight intensity={0.25} color="#e6f1ff" />

      {/* Primary spotlight from top-front */}
      <spotLight
        position={[0, 10, 5]}
        angle={0.3}
        penumbra={0.9}
        intensity={3.0}
        distance={20}
        color="#ffffff"
        castShadow
        shadow-mapSize={1024}
      />

      {/* Dramatic blue accent light from top-right - matching grip color */}
      <spotLight
        position={[8, 10, 5]}
        angle={0.4}
        penumbra={0.8}
        intensity={1.8}
        distance={25}
        color={themeBlue.medium}
        castShadow
        shadow-mapSize={1024}
      />

      {/* Rim light from back to create definition */}
      <pointLight
        position={[-5, 3, -10]}
        intensity={0.8}
        color={themeBlue.light}
        castShadow
      />

      {/* Subtle fill light from left */}
      <pointLight position={[-8, 0, 5]} intensity={0.3} color="#ffffff" />

      {/* Subtle light from bottom for under-lighting */}
      <pointLight position={[0, -3, 8]} intensity={0.15} color="#fed6e3" />
    </>
  );
}
function Controls() {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 2.8;
    controls.maxPolarAngle = Math.PI / 1.8;
    controls.minAzimuthAngle = -Math.PI / 10;
    controls.maxAzimuthAngle = Math.PI / 10;
    controls.target.set(0, 0.5, 0);
    return () => controls.dispose();
  }, [camera, gl]);
  return null;
}

export default function DumbbellWrapper() {
  const [isLoading, setIsLoading] = useState(true);
  const mousePos = useRef({ x: 0, y: 0 });

  // Track mouse position with properly inverted Y axis for 3D space
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    const handleMouseMove = (event: MouseEvent) => {
      mousePos.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className="h-[500px] w-full rounded-lg transition-opacity duration-500 ease-in-out"
      style={{ opacity: isLoading ? 0 : 1 }}
    >
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
        camera={{ position: [0, 1.5, 11], fov: 45 }}
      >
        <Suspense fallback={null}>
          {/* Main camera */}
          {/* using default Canvas camera; explicit PerspectiveCamera removed */}

          {/* Controls */}
          <Controls />

          {/* Enhanced Cinematic Lighting Setup */}
          <CinematicLighting />

          {/* Dumbbell Component */}
          <DumbbellScene mousePos={mousePos} />

          {/* Enhanced Shadows */}
          {/* Floor for shadows */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
            <planeGeometry args={[15, 15]} />
            <shadowMaterial transparent opacity={0.7} />
          </mesh>

          {/* Environment map for reflections */}
          {/* Removed Environment; using default scene lighting/environment */}
        </Suspense>
      </Canvas>
    </div>
  );
}
