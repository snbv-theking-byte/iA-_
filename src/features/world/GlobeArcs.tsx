import React, { useMemo } from "react";
import * as THREE from "three";
import { WORLD_ARCS } from "./world.constants";
import { latLngToVector3, createArcCurve, GLOBE_RADIUS } from "./worldUtils";

export const GlobeArcs: React.FC = () => {
  const lineObjects = useMemo(() => {
    return WORLD_ARCS.map((arc) => {
      const startVec = latLngToVector3(arc.startLat, arc.startLng, GLOBE_RADIUS + 0.02);
      const endVec = latLngToVector3(arc.endLat, arc.endLng, GLOBE_RADIUS + 0.02);
      const points = createArcCurve(startVec, endVec, 0.35, 40);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color(arc.color),
        transparent: true,
        opacity: 0.65,
      });
      return {
        id: arc.id,
        line: new THREE.Line(geometry, material),
      };
    });
  }, []);

  return (
    <group>
      {lineObjects.map(({ id, line }) => (
        <primitive key={id} object={line} />
      ))}
    </group>
  );
};
