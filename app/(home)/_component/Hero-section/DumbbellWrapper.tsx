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

	// Track mouse position with properly inverted Y axis for 3D space
	useEffect(() => {
		const timer = setTimeout(() => { setIsLoading(false); }, 300);
		const handleMouseMove = (event: MouseEvent) => {
			mousePos.current = {
				x: (event.clientX / window.innerWidth) * 2 - 1,
				y: -(event.clientY / window.innerHeight) * 2 + 1,
			};
		};
		window.addEventListener('mousemove', handleMouseMove);
		return () => { 
			clearTimeout(timer); 
			window.removeEventListener('mousemove', handleMouseMove); 
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
				style={{ background: 'transparent' }}
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

					{/* Lighting Setup */}
					<ambientLight intensity={0.4} />
					<SpotLight 
						position={[10, 15, 10]} 
						angle={0.25} 
						penumbra={0.8} 
						intensity={1.8} 
						castShadow 
						shadow-mapSize-width={1024}
						shadow-mapSize-height={1024}
						color="#d8b4fe" 
					/>
					<pointLight position={[-10, -5, -10]} intensity={0.5} color="#ffffff" />

					{/* Dumbbell Component */}
					<DumbbellScene mousePos={mousePos} />

					{/* Shadows */}
					<ContactShadows 
						opacity={0.6} 
						scale={15} 
						blur={1.5} 
						far={10} 
						resolution={512} 
						color="#000000" 
						position={[0, -1.8, 0]} 
					/>
					
					{/* Try a different preset if city doesn't work */}
					<Environment preset="city" blur={0.6} />
				</Suspense>
			</Canvas>
		</div>
	);
}
