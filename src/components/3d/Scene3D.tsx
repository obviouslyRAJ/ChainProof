"use client";

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Shared mouse position (normalized -1 to 1)
const mouse = { x: 0, y: 0 };

function BlockchainCube() {
    const meshRef = useRef<THREE.Mesh>(null);
    const wireRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (!meshRef.current || !wireRef.current) return;

        const targetX = -mouse.y * Math.PI * 0.55;
        const targetY = -mouse.x * Math.PI * 0.55;

        meshRef.current.rotation.x = THREE.MathUtils.lerp(
            meshRef.current.rotation.x,
            targetX,
            0.07
        );
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
            meshRef.current.rotation.y,
            targetY,
            0.07
        );

        wireRef.current.rotation.x = meshRef.current.rotation.x;
        wireRef.current.rotation.y = meshRef.current.rotation.y;
    });

    return (
        <group>
            {/* Perfect solid cube — equal sides */}
            <mesh ref={meshRef}>
                <boxGeometry args={[1.8, 1.8, 1.8]} />
                <meshStandardMaterial
                    color="#3b5fd9"
                    emissive="#1a3baa"
                    emissiveIntensity={0.5}
                    roughness={0.15}
                    metalness={0.6}
                />
            </mesh>

            {/* Wireframe overlay */}
            <mesh ref={wireRef}>
                <boxGeometry args={[1.82, 1.82, 1.82]} />
                <meshBasicMaterial color="#60a5fa" wireframe transparent opacity={0.3} />
            </mesh>
        </group>
    );
}

export default function Scene3D() {
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="absolute inset-0 z-0 opacity-60">
            {/* Low FOV (40°) + camera pulled back = minimal perspective distortion */}
            <Canvas camera={{ position: [0, 0, 7], fov: 40 }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[8, 8, 8]} intensity={1.5} color="#3b82f6" />
                <pointLight position={[-8, -8, -8]} intensity={0.6} color="#1d4ed8" />
                <directionalLight position={[0, 5, 5]} intensity={0.8} color="#93c5fd" />
                <BlockchainCube />
            </Canvas>
        </div>
    );
}
