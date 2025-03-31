'use client';
import { Cylinder } from '@react-three/drei';
// components/Dumbbell.tsx
import { useFrame } from '@react-three/fiber';
import type React from 'react';
import { useRef } from 'react';
import * as THREE from 'three';

// --- Define Initial Orientation ---
const INITIAL_TILT_X_DEGREES = 30; // Downward tilt
const INITIAL_ROTATION_Y_DEGREES = -35; // Left side back, right side forward
// --- ADDED Z-AXIS ROLL ---
const INITIAL_ROLL_Z_DEGREES = 10; // Slight roll (positive makes right side lower) - Adjust as needed (e.g., 3 to 8)

// --- Define Movement Sensitivity (Higher numbers = LESS movement) ---
const BASE_ANIM_AMP_X = 180; // Further reduced movement
const BASE_ANIM_AMP_Y = 150; // Further reduced movement
const BASE_ANIM_AMP_Z = 350; // Make Z wobble very minimal
const MOUSE_SENSITIVITY_X = 100; // Further reduced movement
const MOUSE_SENSITIVITY_Y = 90; // Further reduced movement
const MOUSE_SENSITIVITY_Z = 300; // Make mouse effect on Z very minimal
const LERP_FACTOR = 0.025; // Slightly smoother lerp
const VERTICAL_BOB_SPEED = 3.5;
const VERTICAL_BOB_AMP = 0.015; // Reduced bobbing

// Convert degrees to radians for initial setup
const INITIAL_TILT_X_RAD = THREE.MathUtils.degToRad(INITIAL_TILT_X_DEGREES);
const INITIAL_ROTATION_Y_RAD = THREE.MathUtils.degToRad(
	INITIAL_ROTATION_Y_DEGREES,
);
const INITIAL_ROLL_Z_RAD = THREE.MathUtils.degToRad(INITIAL_ROLL_Z_DEGREES); // Radian for Z

interface DumbbellProps {
	mousePos: React.MutableRefObject<{ x: number; y: number }>;
}

// Export Dumbbell Scene directly without a Canvas wrapper
export function DumbbellScene({
	mousePos,
}: { mousePos?: React.MutableRefObject<{ x: number; y: number }> }) {
	// Create a default mousePos ref if none is provided
	const defaultMousePos = useRef({ x: 0, y: 0 });
	const safeMousePos = mousePos || defaultMousePos;

	return <Dumbbell mousePos={safeMousePos} />;
}

// The actual Dumbbell component that uses Three.js hooks
function Dumbbell({ mousePos }: DumbbellProps) {
	const group = useRef<THREE.Group>(null);

	// Theme colors (remain the same)
	const purpleAccent = '#a855f7';
	const purpleDark = '#581c87';
	const handleColor = '#404040';
	const plateColor = '#1f1f1f';
	const detailColor = '#525252';

	useFrame((state) => {
		if (!group.current) return;
		const t = state.clock.getElapsedTime();

		// Calculate Subtle Deviations including Z
		const baseRotX = Math.cos(t / (BASE_ANIM_AMP_X / 25)) / BASE_ANIM_AMP_X;
		const baseRotY = Math.sin(t / (BASE_ANIM_AMP_Y / 20)) / BASE_ANIM_AMP_Y;
		const baseRotZ = Math.cos(t / (BASE_ANIM_AMP_Z / 15)) / BASE_ANIM_AMP_Z; // Z wobble
		const mouseRotX = (-mousePos.current.y * Math.PI) / MOUSE_SENSITIVITY_X;
		const mouseRotY = (mousePos.current.x * Math.PI) / MOUSE_SENSITIVITY_Y;
		// Optional: Minimal mouse effect on Z roll (can be removed if distracting)
		const mouseRotZ = (mousePos.current.x * Math.PI) / MOUSE_SENSITIVITY_Z;

		// Target Rotation: Start from initial pose and add small deviations
		const targetX = INITIAL_TILT_X_RAD + baseRotX + mouseRotX;
		const targetY = INITIAL_ROTATION_Y_RAD + baseRotY + mouseRotY;
		const targetZ = INITIAL_ROLL_Z_RAD + baseRotZ + mouseRotZ; // Target Z including initial roll

		// Apply smooth interpolation (Lerp) towards the target rotation for all axes
		group.current.rotation.x = THREE.MathUtils.lerp(
			group.current.rotation.x,
			targetX,
			LERP_FACTOR,
		);
		group.current.rotation.y = THREE.MathUtils.lerp(
			group.current.rotation.y,
			targetY,
			LERP_FACTOR,
		);
		group.current.rotation.z = THREE.MathUtils.lerp(
			group.current.rotation.z,
			targetZ,
			LERP_FACTOR,
		); // Lerp Z rotation

		// Subtle Vertical Bobbing
		const targetYPos =
			0.3 + Math.sin(t / VERTICAL_BOB_SPEED) * VERTICAL_BOB_AMP;
		group.current.position.y = THREE.MathUtils.lerp(
			group.current.position.y,
			targetYPos,
			LERP_FACTOR,
		);
	});

	// Geometry and Material definitions remain the same...
	const numDetails = 6;
	const detailPositions = Array.from({ length: numDetails }, (_, i) => {
		const angle = (i / numDetails) * Math.PI * 2;
		const radius = 1.1;
		return {
			id: `detail-${i}`,
			position: [0, Math.cos(angle) * radius, Math.sin(angle) * radius] as [
				number,
				number,
				number,
			],
		};
	});
	const numGrips = 12;
	const gripLength = 0.25;
	const handleLength = 4.5;
	const totalGripSpan = numGrips * gripLength;
	const gripStart = -totalGripSpan / 2 + gripLength / 2;
	const gripDetails = Array.from({ length: numGrips }, (_, i) => ({
		id: `grip-${i}`,
		position: [gripStart + i * gripLength, 0, 0] as [number, number, number],
		isCenter:
			i === Math.floor(numGrips / 2) || i === Math.floor(numGrips / 2) - 1,
	}));
	const plateArgs: [number, number, number, number] = [1.4, 1.4, 0.65, 64];
	const handleArgs: [number, number, number, number] = [
		0.25,
		0.25,
		handleLength,
		32,
	];
	const gripArgs: [number, number, number, number] = [
		0.26,
		0.26,
		gripLength * 0.8,
		16,
	];
	const detailArgs: [number, number, number, number] = [0.05, 0.05, 0.68, 8];
	const labelPlateArgs: [number, number, number, number] = [0.5, 0.5, 0.67, 32];
	const physicalMaterialProps = {
		roughness: 0.4,
		metalness: 0.8,
		clearcoat: 0.3,
		clearcoatRoughness: 0.3,
		reflectivity: 0.6,
	};
	const plateDetailMaterial = (
		<meshPhysicalMaterial color={detailColor} roughness={0.5} metalness={0.6} />
	);
	const labelPlateMaterialLeft = (
		<meshPhysicalMaterial
			color="#333333"
			roughness={0.3}
			metalness={0.7}
			clearcoat={0.2}
			emissive={purpleDark}
			emissiveIntensity={0.1}
		/>
	);
	const labelPlateMaterialRight = (
		<meshPhysicalMaterial
			color="#333333"
			roughness={0.3}
			metalness={0.7}
			clearcoat={0.2}
			emissive={'#000000'}
			emissiveIntensity={0}
		/>
	);

	return (
		// Apply the combined initial rotation (X, Y, and Z) directly to the group
		<group
			ref={group}
			scale={1.5}
			position={[0, 0.3, 0]}
			// --- Use all three initial rotation radian values ---
			rotation={[
				INITIAL_TILT_X_RAD,
				INITIAL_ROTATION_Y_RAD,
				INITIAL_ROLL_Z_RAD,
			]}
		>
			{/* Handle */}
			<Cylinder
				args={handleArgs}
				rotation={[0, 0, Math.PI / 2]}
				castShadow
				receiveShadow
			>
				{' '}
				<meshPhysicalMaterial
					color={handleColor}
					{...physicalMaterialProps}
					metalness={0.9}
				/>{' '}
			</Cylinder>
			{/* Handle grip texture */}
			{gripDetails.map((grip) => (
				<Cylinder
					key={grip.id}
					args={gripArgs}
					position={grip.position}
					rotation={[0, 0, Math.PI / 2]}
					castShadow
				>
					{' '}
					<meshPhysicalMaterial
						color={grip.isCenter ? purpleAccent : '#333333'}
						roughness={0.8}
						metalness={0.5}
						emissive={grip.isCenter ? purpleDark : '#000000'}
						emissiveIntensity={grip.isCenter ? 0.5 : 0}
					/>{' '}
				</Cylinder>
			))}
			{/* Left Weight */}
			<group position={[-handleLength / 2 - 0.1, 0, 0]}>
				<Cylinder
					args={plateArgs}
					rotation={[0, 0, Math.PI / 2]}
					castShadow
					receiveShadow
				>
					{' '}
					<meshPhysicalMaterial
						color={plateColor}
						{...physicalMaterialProps}
					/>{' '}
				</Cylinder>
				{detailPositions.map((detail) => (
					<Cylinder
						key={`left-${detail.id}`}
						args={detailArgs}
						position={detail.position}
						rotation={[0, 0, Math.PI / 2]}
						castShadow
					>
						{' '}
						{plateDetailMaterial}{' '}
					</Cylinder>
				))}
				<Cylinder
					args={labelPlateArgs}
					rotation={[0, 0, Math.PI / 2]}
					castShadow
				>
					{' '}
					{labelPlateMaterialLeft}{' '}
				</Cylinder>
			</group>
			{/* Right Weight */}
			<group position={[handleLength / 2 + 0.1, 0, 0]}>
				<Cylinder
					args={plateArgs}
					rotation={[0, 0, Math.PI / 2]}
					castShadow
					receiveShadow
				>
					{' '}
					<meshPhysicalMaterial
						color={plateColor}
						{...physicalMaterialProps}
					/>{' '}
				</Cylinder>
				{detailPositions.map((detail) => (
					<Cylinder
						key={`right-${detail.id}`}
						args={detailArgs}
						position={detail.position}
						rotation={[0, 0, Math.PI / 2]}
						castShadow
					>
						{' '}
						{plateDetailMaterial}{' '}
					</Cylinder>
				))}
				<Cylinder
					args={labelPlateArgs}
					rotation={[0, 0, Math.PI / 2]}
					castShadow
				>
					{' '}
					{labelPlateMaterialRight}{' '}
				</Cylinder>
			</group>
		</group>
	);
}
