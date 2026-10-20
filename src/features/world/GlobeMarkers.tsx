import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WORLD_NODES, latLngToVector3, GLOBE_RADIUS } from "./worldUtils";
import { eventBus } from "../../systems/eventBus";
import { useAppStore } from "../../store/useAppStore";
import type { WorldNode } from "./world.types";

interface Props {
  selectedNodeId: string | null;
}

export const GlobeMarkers: React.FC<Props> = ({ selectedNodeId }) => {
  return (
    <group>
      {WORLD_NODES.map((node) => (
        <MarkerItem
          key={node.id}
          node={node}
          isSelected={selectedNodeId === node.id}
        />
      ))}
    </group>
  );
};

const MarkerItem: React.FC<{ node: WorldNode; isSelected: boolean }> = ({
  node,
  isSelected,
}) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);
  const pos = latLngToVector3(node.latitude, node.longitude, GLOBE_RADIUS + 0.02);

  useFrame((state) => {
    if (ringRef.current) {
      const time = state.clock.getElapsedTime();
      const scale = 1 + Math.sin(time * 3) * 0.25;
      ringRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={pos}>
      {/* Interactive Core Sphere */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          setSelectedNodeId(node.id);
          eventBus.emit("world:node:selected", {
            id: node.id,
            source: "globe",
            timestamp: Date.now(),
          });
          eventBus.emit("radar:node:selected", {
            id: node.id,
            name: node.name,
            coordinates: `${node.latitude.toFixed(4)}° N, ${node.longitude.toFixed(4)}° E`,
            threatLevel: node.status === "critical" ? "DELTA" : node.status === "warning" ? "CHARLIE" : "ALPHA",
            status: node.status,
            source: "globe",
            timestamp: Date.now(),
          } as any);
        }}
      >
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color={isSelected ? "#00f0ff" : node.color} />
      </mesh>

      {/* Pulsing Beacon Ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.055, 0.075, 32]} />
        <meshBasicMaterial
          color={isSelected ? "#00f0ff" : node.color}
          side={THREE.DoubleSide}
          transparent
          opacity={0.65}
        />
      </mesh>
    </group>
  );
};
