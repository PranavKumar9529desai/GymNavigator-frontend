"use client";

import {
	ContactShadows,
	Environment,
	OrbitControls,
	PerspectiveCamera,
	SpotLight,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { DumbbellScene } from "./Dumbbell";

export default function DumbbellWrapper() {
	const [isLoading, setIsLoading] = useState(true);
	const mousePos = useRef({ x: 0, y: 0 });

	// Track mouse position
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			// Normalize mouse position to -1 to 1 range
			mousePos.current = {
				x: (e.clientX / window.innerWidth) * 2 - 1,
				y: (e.clientY / window.innerHeight) * 2 - 1,
			};
		};

		window.addEventListener("mousemove", handleMouseMove);

		// Set loading to false after component mounts
		const timeout = setTimeout(() => {
			setIsLoading(false);
		}, 500);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			clearTimeout(timeout);
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
				gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }} 
				style={{ backgroundColor: 'transparent' }}
			>
				<Suspense fallback={null}>
					<PerspectiveCamera makeDefault position={[0, 1.5, 11]} fov={45} />
					<OrbitControls
						enableZoom={false}
						enablePan={false}
						minPolarAngle={Math.PI / 2.8} 
						maxPolarAngle={Math.PI / 1.8}
						minAzimuthAngle={-Math.PI / 10}
						maxAzimuthAngle={Math.PI / 10}
						target={[0, 0.5, 0]}
					/>

					{/* Lighting Setup */}
					<ambientLight intensity={0.4} />
					<SpotLight 
						position={[10, 15, 10]} 
						angle={0.25} 
						penumbra={0.8} 
						intensity={1.8} 
						castShadow 
						shadow-mapSize={1024}
						color="#d8b4fe" 
					/>
					<pointLight position={[-10, -5, -10]} intensity={0.5} color="#ffffff" />

					{/* Dumbbell Component */}
					<DumbbellScene mousePos={mousePos} />

					<ContactShadows 
						opacity={0.6} 
						scale={15} 
						blur={1.5} 
						far={10} 
						resolution={512} 
						color="#000000" 
						position={[0, -1.8, 0]} 
					/>
					<Environment preset="city" blur={0.6} />
				</Suspense>
			</Canvas>
		</div>
	);
}
