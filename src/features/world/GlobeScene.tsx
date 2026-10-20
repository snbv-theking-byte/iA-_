import React, { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GlobeMarkers } from "./GlobeMarkers";
import { GlobeArcs } from "./GlobeArcs";
import { GlobeCameraController } from "./GlobeCameraController";
import { GLOBE_RADIUS } from "./worldUtils";
import { useAppStore } from "../../store/useAppStore";

interface Props {
  selectedNodeId: string | null;
}

export const GlobeScene: React.FC<Props> = ({ selectedNodeId }) => {
  const globeRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const globeAutoRotate = useAppStore((state) => state.globeAutoRotate);

  // Implement a useEffect hook that updates the camera position orbit automatically when enabled
  useEffect(() => {
    if (!globeAutoRotate) return;

    let frameId: number | null = null;
    let lastTimestamp = performance.now();

    const orbitStep = (now: number) => {
      const deltaSec = Math.min((now - lastTimestamp) / 1000, 0.1);
      lastTimestamp = now;

      // Orbit camera smoothly around Y-axis in X-Z plane around origin (0, 0, 0)
      const x = camera.position.x;
      const z = camera.position.z;
      const radius = Math.hypot(x, z);

      if (radius > 0.001) {
        const currentAngle = Math.atan2(x, z);
        const angularVelocity = 0.12; // Radians per second for smooth orbital speed
        const newAngle = currentAngle + angularVelocity * deltaSec;

        camera.position.x = radius * Math.sin(newAngle);
        camera.position.z = radius * Math.cos(newAngle);
        camera.lookAt(0, 0, 0);
      }

      frameId = requestAnimationFrame(orbitStep);
    };

    frameId = requestAnimationFrame(orbitStep);

    return () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [globeAutoRotate, camera]);

  return (
    <group ref={globeRef}>
      <GlobeCameraController />

      {/* Primary Globe Sphere (Deep Obsidian) */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshStandardMaterial color="#07090e" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Sovereign Golden Wireframe Grid */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS + 0.005, 36, 36]} />
        <meshBasicMaterial color="#dfb15b" wireframe transparent opacity={0.14} />
      </mesh>

      {/* Atmospheric Cyan Rim Glow */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS + 0.15, 32, 32]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>

      {/* Sovereign Trajectory Arcs */}
      <GlobeArcs />

      {/* Strategic Geographical Nodes */}
      <GlobeMarkers selectedNodeId={selectedNodeId} />
    </group>
  );
};
