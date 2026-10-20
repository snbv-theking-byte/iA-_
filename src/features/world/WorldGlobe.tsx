import React, { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { RotateCw } from "lucide-react";
import { GlobeScene } from "./GlobeScene";
import { useAppStore } from "../../store/useAppStore";
import { WORLD_NODES } from "./worldUtils";
import { eventBus } from "../../systems/eventBus";
import styles from "./world.module.css";

export default function WorldGlobe() {
  const selectedNodeId = useAppStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);
  const globeAutoRotate = useAppStore((state) => state.globeAutoRotate);
  const toggleGlobeAutoRotate = useAppStore((state) => state.toggleGlobeAutoRotate);

  const selectedNode = WORLD_NODES.find((node) => node.id === selectedNodeId) ?? null;

  useEffect(() => {
    const unsub = eventBus.on("radar:node:selected", (payload) => {
      if ((payload as any)?.source !== "globe" && payload?.id) {
        setSelectedNodeId(payload.id);
      }
    });
    return () => unsub();
  }, [setSelectedNodeId]);

  return (
    <div className={styles.globeContainer}>
      {/* Header telemetry ribbon */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.pulseDot} />
          <span className={styles.title}>SOVEREIGN 3D GLOBE TELEMETRY</span>
        </div>
        <div className={styles.statusGroup}>
          <span className={styles.coords}>
            {selectedNode
              ? `${selectedNode.name} [${selectedNode.latitude.toFixed(2)}°, ${selectedNode.longitude.toFixed(2)}°]`
              : "GLOBAL ORBITAL GRID"}
          </span>

          {/* User-toggleable 'AUTO_ROTATE' setting */}
          <button
            type="button"
            onClick={toggleGlobeAutoRotate}
            className={`${styles.autoRotateButton} ${globeAutoRotate ? styles.autoRotateActive : ''}`}
            title={globeAutoRotate ? "Pause camera orbit auto-rotation" : "Enable camera orbit auto-rotation"}
            aria-pressed={globeAutoRotate}
          >
            <RotateCw className={`${styles.autoRotateIcon} ${globeAutoRotate ? styles.iconSpinning : ''}`} />
            <span>AUTO_ROTATE: {globeAutoRotate ? 'ON' : 'OFF'}</span>
          </button>

          <span className={styles.activeTag}>3D ACTIVE</span>
        </div>
      </div>

      {/* Three.js Canvas Container */}
      <div className={styles.canvasWrapper}>
        <Canvas
          camera={{ position: [0, 0, 5.5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          className={styles.canvas}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 3, 5]} intensity={1.3} color="#ffffff" />
          <pointLight position={[-5, -3, -5]} intensity={0.9} color="#00f0ff" />
          <Suspense fallback={null}>
            <GlobeScene selectedNodeId={selectedNodeId} />
          </Suspense>
          <OrbitControls
            enableZoom
            maxDistance={8}
            minDistance={3.2}
            enablePan={false}
            rotateSpeed={0.6}
          />
        </Canvas>
      </div>

      {/* Footer Quick Selection Bar */}
      <div className={styles.footerBar}>
        <div className={styles.nodeQuickList}>
          {WORLD_NODES.map((node) => {
            const isSel = node.id === selectedNodeId;
            return (
              <button
                key={node.id}
                onClick={() => {
                  setSelectedNodeId(node.id);
                  eventBus.emit("world:node:selected", {
                    id: node.id,
                    source: "globe",
                    timestamp: Date.now(),
                  });
                }}
                className={`${styles.nodeButton} ${isSel ? styles.nodeButtonActive : ""}`}
                style={{ borderColor: isSel ? node.color : undefined }}
                title={`${node.name} (${node.classification})`}
              >
                <span
                  className={styles.nodeIndicator}
                  style={{ backgroundColor: node.color }}
                />
                <span className={styles.nodeButtonName}>{node.name}</span>
              </button>
            );
          })}
        </div>
        <div className={styles.hint}>DRAG TO ROTATE • SCROLL TO ZOOM</div>
      </div>
    </div>
  );
}
