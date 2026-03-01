"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

function BlockchainCube() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Outer Glow Sphere */}
            <Sphere args={[2.5, 32, 32]}>
                <MeshDistortMaterial
                    color="#1e40af"
                    speed={2}
                    distort={0.4}
                    radius={1}
                    transparent
                    opacity={0.1}
                />
            </Sphere>

            {/* Main Cube */}
            <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                <mesh>
                    <boxGeometry args={[1.5, 1.5, 1.5]} />
                    <MeshWobbleMaterial
                        color="#3b82f6"
                        factor={0.4}
                        speed={1}
                        emissive="#1d4ed8"
                        emissiveIntensity={2}
                    />
                </mesh>
            </Float>

            {/* Wireframe Structure */}
            <mesh>
                <boxGeometry args={[2.2, 2.2, 2.2]} />
                <meshBasicMaterial color="#60a5fa" wireframe transparent opacity={0.2} />
            </mesh>
        </group>
    );
}

export default function Scene3D() {
    return (
        <div className="absolute inset-0 z-0 opacity-60">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#1d4ed8" />
                <BlockchainCube />
            </Canvas>
        </div>
    );
}
