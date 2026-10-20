import * as THREE from "three";
import type { WorldNode } from "./world.types";
import { WORLD_NODES as WORLD_NODES_CONST, GLOBE_RADIUS as GLOBE_RADIUS_CONST } from "./world.constants";

export const GLOBE_RADIUS = GLOBE_RADIUS_CONST;
export const WORLD_NODES: WorldNode[] = WORLD_NODES_CONST;

/**
 * Converts Latitude and Longitude to 3D Cartesian coordinates on sphere
 */
export function latLngToVector3(lat: number, lng: number, radius: number = GLOBE_RADIUS): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export function getWorldNodeById(id: string | null): WorldNode | null {
  if (!id) return null;
  return WORLD_NODES.find((node) => node.id === id) ?? null;
}

/**
 * Creates 3D quadratic bezier curve points between two coordinates on the globe
 */
export function createArcCurve(
  start: THREE.Vector3,
  end: THREE.Vector3,
  elevationScale: number = 0.35,
  pointsCount: number = 40
): THREE.Vector3[] {
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const distance = start.distanceTo(end);
  mid.normalize().multiplyScalar(GLOBE_RADIUS + Math.max(0.2, distance * elevationScale));
  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  return curve.getPoints(pointsCount);
}
