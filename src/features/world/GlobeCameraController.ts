import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { eventBus } from "../../systems/eventBus";
import { WORLD_NODES, latLngToVector3, GLOBE_RADIUS } from "./worldUtils";

export function GlobeCameraController() {
  const { camera } = useThree();

  useEffect(() => {
    let frameId: number | null = null;

    const handleFocus = (id: string) => {
      const worldNode = WORLD_NODES.find((node) => node.id === id);
      if (!worldNode) return;

      const target = latLngToVector3(worldNode.latitude, worldNode.longitude, GLOBE_RADIUS + 3.2);
      const start = camera.position.clone();
      let progress = 0;

      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      const animate = () => {
        progress += 0.04;
        const currentProgress = Math.min(progress, 1);
        camera.position.lerpVectors(start, target, currentProgress);
        camera.lookAt(0, 0, 0);

        if (currentProgress < 1) {
          frameId = requestAnimationFrame(animate);
        } else {
          frameId = null;
        }
      };

      animate();
    };

    const unsubRadar = eventBus.on("radar:node:selected", (payload) => {
      if (payload?.id) {
        handleFocus(payload.id);
      }
    });

    const unsubWorld = eventBus.on("world:node:selected", (payload) => {
      if (payload?.id) {
        handleFocus(payload.id);
      }
    });

    const unsubCamera = eventBus.on("world:camera:focus", (payload) => {
      const target = latLngToVector3(payload.latitude, payload.longitude, GLOBE_RADIUS + 3.2);
      const start = camera.position.clone();
      let progress = 0;

      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      const animate = () => {
        progress += 0.04;
        const currentProgress = Math.min(progress, 1);
        camera.position.lerpVectors(start, target, currentProgress);
        camera.lookAt(0, 0, 0);

        if (currentProgress < 1) {
          frameId = requestAnimationFrame(animate);
        } else {
          frameId = null;
        }
      };

      animate();
    });

    return () => {
      unsubRadar();
      unsubWorld();
      unsubCamera();
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [camera]);

  return null;
}
