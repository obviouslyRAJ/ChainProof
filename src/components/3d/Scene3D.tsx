"use client";

import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Accumulated mouse delta between frames
const pendingDelta = { x: 0, y: 0 };

function NetworkSphere() {
    const groupRef = useRef<THREE.Group>(null);

    // Icosahedron with detail=2 gives a nice geodesic sphere (like the reference image)
    const icoGeo = useMemo(() => new THREE.IcosahedronGeometry(2, 2), []);

    // Edges wireframe from the icosahedron faces
    const edgesGeo = useMemo(() => new THREE.EdgesGeometry(icoGeo), [icoGeo]);

    // Unique vertex positions for node dots
    const nodePositions = useMemo(() => {
        const pos = icoGeo.attributes.position;
        const seen = new Map<string, THREE.Vector3>();
        for (let i = 0; i < pos.count; i++) {
            const v = new THREE.Vector3(
                parseFloat(pos.getX(i).toFixed(4)),
                parseFloat(pos.getY(i).toFixed(4)),
                parseFloat(pos.getZ(i).toFixed(4))
            );
            const key = `${v.x},${v.y},${v.z}`;
            if (!seen.has(key)) seen.set(key, v);
        }
        return Array.from(seen.values());
    }, [icoGeo]);

    useFrame(() => {
        if (!groupRef.current) return;

        // Apply accumulated delta and immediately reset — stops when cursor stops
        groupRef.current.rotation.x += pendingDelta.y * 0.002;
        groupRef.current.rotation.y += pendingDelta.x * 0.002;

        pendingDelta.x = 0;
        pendingDelta.y = 0;
    });

    return (
        <group ref={groupRef}>
            {/* Connecting edges */}
            <lineSegments geometry={edgesGeo}>
                <lineBasicMaterial color="#29b6f6" transparent opacity={0.85} linewidth={1} />
            </lineSegments>

            {/* Nodes (dots) at every vertex */}
            {nodePositions.map((v, i) => (
                <mesh key={i} position={v}>
                    <sphereGeometry args={[0.1, 12, 12]} />
                    <meshStandardMaterial
                        color="#29b6f6"
                        emissive="#0d47a1"
                        emissiveIntensity={0.6}
                        roughness={0.2}
                        metalness={0.5}
                    />
                </mesh>
            ))}
        </group>
    );
}

export default function Scene3D() {
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Accumulate raw pixel deltas — direction follows cursor naturally
            pendingDelta.x += e.movementX;
            pendingDelta.y += e.movementY;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="absolute inset-0 z-0 opacity-70">
            <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.2} color="#29b6f6" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0d47a1" />
                <NetworkSphere />
            </Canvas>
        </div>
    );
}
