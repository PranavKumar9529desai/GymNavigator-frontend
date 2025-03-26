"use client";

import {
	ContactShadows,
	Environment,
	OrbitControls,
	PerspectiveCamera,
	SpotLight,
	useHelper,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import type * as THREE from "three";
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
	const spotLightRef = useRef<THREE.SpotLight>(null);
	const spotLightTarget = useRef<THREE.Object3D>(null);

	return (
		<>
			{/* Ambient lighting for base brightness */}
			<ambientLight intensity={0.25} color="#e6f1ff" />

			{/* Primary spotlight from top-front */}
			<SpotLight
				position={[0, 10, 5]}
				angle={0.3}
				penumbra={0.9}
				intensity={3.0}
				distance={20}
				color="#ffffff"
				castShadow
				shadow-mapSize={1024}
				attenuation={5}
				anglePower={5} // Sharper spotlight edge
			/>

			{/* Dramatic blue accent light from top-right - matching grip color */}
			<SpotLight
				position={[8, 10, 5]}
				angle={0.4}
				penumbra={0.8}
				intensity={1.8}
				distance={25}
				color={themeBlue.medium}
				castShadow
				shadow-mapSize={1024}
				attenuation={7}
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
					<PerspectiveCamera makeDefault position={[0, 1.5, 11]} fov={45} />

					{/* Controls */}
					<OrbitControls
						enableZoom={false}
						enablePan={false}
						minPolarAngle={Math.PI / 2.8}
						maxPolarAngle={Math.PI / 1.8}
						minAzimuthAngle={-Math.PI / 10}
						maxAzimuthAngle={Math.PI / 10}
						target={[0, 0.5, 0]}
					/>

					{/* Enhanced Cinematic Lighting Setup */}
					<CinematicLighting />

					{/* Dumbbell Component */}
					<DumbbellScene mousePos={mousePos} />

					{/* Enhanced Shadows */}
					<ContactShadows
						opacity={0.7}
						scale={15}
						blur={2.5}
						far={10}
						resolution={512}
						color="#000000"
						position={[0, -1.8, 0]}
					/>

					{/* Environment map for reflections */}
					<Environment preset="city" blur={0.6} />
				</Suspense>
			</Canvas>
		</div>
	);
}
