import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GlobeMarkers } from "./GlobeMarkers";
import { GlobeArcs } from "./GlobeArcs";
import { GlobeCameraController } from "./GlobeCameraController";
import { GLOBE_RADIUS } from "./worldUtils";

interface Props {
  selectedNodeId: string | null;
}

export const GlobeScene: React.FC<Props> = ({ selectedNodeId }) => {
  const globeRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (globeRef.current && !selectedNodeId) {
      globeRef.current.rotation.y += delta * 0.05;
    }
  });

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
