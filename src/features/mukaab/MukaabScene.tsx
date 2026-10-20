/**
 * KINGDOM OF MURABBA™ | SNBV™ COMMAND CORE
 * MukaabScene.tsx - High-Performance 3D Mukaab Visualization with React Three Fiber
 * Integrates Golden Ratio Φ = 1.618034 geometry, orbital camera, wireframe mode, and pulse telemetry.
 */

import React, { useRef, useMemo, useEffect, Suspense, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';
import { useCommandStore } from '../../store/useCommandStore';
import { PHI, TotemNode } from '../../types';
import { AudioManager } from '../../systems/AudioManager';
import { Box, RefreshCw, Zap, Shield, Sparkles, Activity } from 'lucide-react';
import type { CoreStatus } from '../../store/store.types';

// ================= HELPER FUNCTIONS =================

/**
 * Calculates geometric proportions for the Mukaab cube according to the Golden Ratio Φ.
 */
export function calculatePhiLattice(baseSize: number = PHI) {
  return {
    outerSize: baseSize,
    innerCoreSize: baseSize * 0.42,
    orbitRadiusPrimary: baseSize * 1.18,
    orbitRadiusSecondary: baseSize * 1.28,
    phiRatio: PHI,
  };
}

/**
 * Derives color parameters and emissive intensities for core status states.
 */
export function getCoreStatusColor(status: CoreStatus = 'nominal') {
  switch (status) {
    case 'overcharge':
      return { hex: '#ff3366', emissive: '#ff3366', intensity: 1.8, label: 'OVERCHARGE' };
    case 'warning':
      return { hex: '#ffe600', emissive: '#ffe600', intensity: 1.4, label: 'WARNING' };
    case 'nominal':
    default:
      return { hex: '#00f0ff', emissive: '#00f0ff', intensity: 1.2, label: 'NOMINAL' };
  }
}

/**
 * Lazy loading factory helper for MukaabScene
 */
export function createLazyMukaabScene() {
  return React.lazy(() => import('./MukaabScene').then((m) => ({ default: m.MukaabScene })));
}

// ================= TYPES & INTERFACES =================

export interface MukaabSceneProps {
  className?: string;
  autoRotate?: boolean;
  enableControls?: boolean;
}

export interface CubeLatticeProps {
  size: number;
  wireframe: boolean;
  pulseIntensity: number;
}

export interface NexusCoreProps {
  size: number;
  pulseCount: number;
  coreStatus?: CoreStatus;
  onCoreClick?: () => void;
}

export interface TotemOrbitsProps {
  activeCount: number;
}

// ================= SUBCOMPONENTS (MEMOIZED FOR 60 FPS) =================

/**
 * The Outer Mukaab Golden Cubic Lattice with explicit Three.js resource disposal
 */
const MukaabCubeMesh = memo(({ size, wireframe, pulseIntensity }: CubeLatticeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);

  // Compute and manage geometry lifecycle
  const { boxGeo, edgesGeo } = useMemo(() => {
    const bg = new THREE.BoxGeometry(size, size, size);
    const eg = new THREE.EdgesGeometry(bg);
    return { boxGeo: bg, edgesGeo: eg };
  }, [size]);

  // Proper cleanup of Three.js resources
  useEffect(() => {
    return () => {
      boxGeo.dispose();
      edgesGeo.dispose();
    };
  }, [boxGeo, edgesGeo]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <boxGeometry args={[size, size, size]} />
        <meshPhysicalMaterial
          color="#dfb15b"
          metalness={0.9}
          roughness={0.15}
          transparent
          opacity={wireframe ? 0.25 : 0.68}
          transmission={0.45}
          ior={1.618}
          wireframe={wireframe}
        />
        {/* Neon Gold Outer Accent Edges */}
        <lineSegments ref={edgesRef} geometry={edgesGeo}>
          <lineBasicMaterial 
            color="#ffd978" 
            linewidth={2} 
            transparent 
            opacity={0.85 + pulseIntensity * 0.15} 
          />
        </lineSegments>
      </mesh>
    </group>
  );
});

MukaabCubeMesh.displayName = 'MukaabCubeMesh';

/**
 * Inner Nexus Core - Hyper-dimensional Octahedron reacting to Global Pulse sequences
 */
const NexusCoreMesh = memo(({ size, pulseCount, coreStatus = 'nominal', onCoreClick }: NexusCoreProps) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const pulseScaleRef = useRef(1.0);

  // Trigger pulse surge whenever pulseCount increments
  useEffect(() => {
    pulseScaleRef.current = 1.618;
  }, [pulseCount]);

  useFrame((_, delta) => {
    if (!coreRef.current) return;
    
    // Rotate opposite direction
    coreRef.current.rotation.y -= delta * 0.4;
    coreRef.current.rotation.z += delta * 0.25;

    // Smoothly decay pulse surge back to nominal 1.0
    pulseScaleRef.current = THREE.MathUtils.lerp(pulseScaleRef.current, 1.0, delta * 3.5);
    const breathe = 1 + Math.sin(Date.now() * 0.003) * 0.08;
    const finalScale = pulseScaleRef.current * breathe;

    coreRef.current.scale.set(finalScale, finalScale, finalScale);
  });

  const coreColor = coreStatus === 'overcharge' ? '#ff3366' : 
                    coreStatus === 'warning' ? '#ffe600' : '#00f0ff';

  return (
    <mesh ref={coreRef} onClick={onCoreClick}>
      <octahedronGeometry args={[size * 0.42, 0]} />
      <meshStandardMaterial
        color={coreColor}
        emissive={coreColor}
        emissiveIntensity={coreStatus === 'overcharge' ? 1.8 : 1.2}
        wireframe
      />
    </mesh>
  );
});

NexusCoreMesh.displayName = 'NexusCoreMesh';

/**
 * Orbital Rings and 7 Totemic Satellite Nodes
 */
const TotemNodesOrbital = memo(({ activeCount }: TotemOrbitsProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const totems = useAppStore((state) => state.totems);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  const totemList = useMemo(() => Object.values(totems) as TotemNode[], [totems]);

  return (
    <group ref={groupRef}>
      {/* Concentric Golden Orbit Ring */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[PHI * 1.18, 0.015, 16, 90]} />
        <meshBasicMaterial color="#dfb15b" wireframe transparent opacity={0.35} />
      </mesh>

      {/* Cyan Counter-Orbit Ring */}
      <mesh rotation={[0, Math.PI / 4, Math.PI / 6]}>
        <torusGeometry args={[PHI * 1.28, 0.012, 16, 90]} />
        <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.28} />
      </mesh>

      {/* 7 Totem Satellites */}
      {totemList.map((totem, idx) => {
        const angle = (idx / totemList.length) * Math.PI * 2;
        const radius = 2.15;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 2) * 0.35;

        return (
          <group key={totem.id} position={[x, y, z]}>
            <mesh>
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshStandardMaterial
                color={totem.isActive ? '#ffd978' : '#334155'}
                emissive={totem.isActive ? (totem.id === 'G' ? '#ff3366' : '#00f0ff') : '#0f172a'}
                emissiveIntensity={totem.isActive ? 1.4 : 0.1}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
});

TotemNodesOrbital.displayName = 'TotemNodesOrbital';

/**
 * Background Sovereign Dust Particles
 */
const StarfieldParticles = memo(({ count = 400 }: { count?: number }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 14;
      pos[i + 1] = (Math.random() - 0.5) * 14;
      pos[i + 2] = (Math.random() - 0.5) * 14;

      if (Math.random() > 0.45) {
        // Gold #dfb15b
        col[i] = 0.87; col[i + 1] = 0.69; col[i + 2] = 0.35;
      } else {
        // Cyan #00f0ff
        col[i] = 0.0; col[i + 1] = 0.94; col[i + 2] = 1.0;
      }
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.65}
      />
    </points>
  );
});

StarfieldParticles.displayName = 'StarfieldParticles';

// ================= MAIN COMPONENT =================

export const MukaabScene: React.FC<MukaabSceneProps> = ({
  className = '',
  autoRotate = true,
  enableControls = true,
}) => {
  const coreStatus = useAppStore((state) => state.coreStatus);
  const setCoreStatus = useAppStore((state) => state.setCoreStatus);
  const wireframeMode = useAppStore((state) => state.wireframeMode);
  const toggleWireframe = useAppStore((state) => state.toggleWireframe);
  const pulseCount = useAppStore((state) => state.pulseCount);
  const executeGlobalPulse = useAppStore((state) => state.executeGlobalPulse);
  const metrics = useAppStore((state) => state.metrics);

  const [rotating, setRotating] = React.useState(autoRotate);

  const cycleCoreStatus = () => {
    const nextStatus: CoreStatus = 
      coreStatus === 'nominal' ? 'warning' :
      coreStatus === 'warning' ? 'overcharge' : 'nominal';
    setCoreStatus(nextStatus);
  };

  const handlePulseTrigger = () => {
    executeGlobalPulse();
  };

  return (
    <div className={`relative w-full h-[620px] rounded-xl overflow-hidden glass-panel border border-[#dfb15b]/30 shadow-2xl flex flex-col justify-between p-4 ${className}`}>
      {/* Three.js Canvas Container */}
      <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center text-slate-500 font-mono text-xs">
            <Sparkles className="w-4 h-4 text-[#dfb15b] animate-spin mr-2" />
            INITIALIZING THREE.JS MUKAAB LATTICE...
          </div>
        }>
          <Canvas
            camera={{ position: [0, 2.4, 5.6], fov: 45 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            dpr={[1, 2]}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 8, 5]} intensity={2.5} color="#ffd978" />
            <directionalLight position={[-5, -4, -5]} intensity={1.8} color="#00f0ff" />
            <pointLight position={[0, 0, 0]} intensity={3.0} color="#ffd978" distance={10} />

            <MukaabCubeMesh 
              size={PHI} 
              wireframe={wireframeMode} 
              pulseIntensity={pulseCount % 2 === 0 ? 1 : 0.5} 
            />
            <NexusCoreMesh 
              size={PHI} 
              pulseCount={pulseCount} 
              coreStatus={coreStatus}
              onCoreClick={cycleCoreStatus}
            />
            <TotemNodesOrbital 
              activeCount={metrics.activeNodes} 
            />
            <StarfieldParticles count={450} />

            {enableControls && (
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={3.5}
                maxDistance={12}
                autoRotate={rotating}
                autoRotateSpeed={1.2}
              />
            )}
          </Canvas>
        </Suspense>
      </div>

      {/* Top HUD Telemetry Overlay */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="bg-[#07090e]/85 backdrop-blur-md px-3.5 py-2 rounded-lg border border-[#dfb15b]/30 shadow-lg pointer-events-auto">
          <div className="flex items-center space-x-2">
            <Box className="w-4 h-4 text-[#ffd978] animate-spin" />
            <span className="font-sovereign text-[#ffd978] font-bold text-sm tracking-wider">
              AL-MUKAAB NEXUS CORE
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-300 mt-1 space-x-2">
            <span>DIMENSIONS: <strong className="text-[#dfb15b]">{PHI.toFixed(4)} Φ³</strong></span>
            <span>•</span>
            <span>HARMONIC: <strong className="text-[#00f0ff]">1074 Hz</strong></span>
            <span>•</span>
            <span>NODES: <strong className="text-emerald-400">{metrics.activeNodes} / 7</strong></span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          {/* Core Status Cycle Button */}
          <button
            onClick={cycleCoreStatus}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer ${
              coreStatus === 'overcharge'
                ? 'bg-rose-500/25 border-rose-500 text-rose-400 shadow-[0_0_12px_rgba(255,51,102,0.4)]'
                : coreStatus === 'warning'
                ? 'bg-amber-500/25 border-amber-500 text-amber-300'
                : 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff]'
            }`}
            title="Cycle Core Status: Nominal / Warning / Overcharge"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>CORE: {coreStatus.toUpperCase()}</span>
          </button>

          <button
            onClick={() => setRotating(!rotating)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer ${
              rotating
                ? 'bg-[#dfb15b]/20 border-[#dfb15b] text-[#ffd978]'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
            title="Toggle Orbital Auto-Rotation"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${rotating ? 'animate-spin' : ''}`} />
            <span>{rotating ? 'ORBIT: AUTO' : 'ORBIT: MANUAL'}</span>
          </button>

          <button
            onClick={toggleWireframe}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer ${
              wireframeMode
                ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff]'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
            title="Toggle Wireframe Structural Mode"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{wireframeMode ? 'LATTICE: WIRE' : 'LATTICE: SOLID'}</span>
          </button>

          <button
            onClick={handlePulseTrigger}
            className="px-3.5 py-1.5 rounded-lg border border-[#ffd978] bg-[#dfb15b]/25 hover:bg-[#dfb15b]/40 text-[#ffd978] font-bold text-xs font-mono flex items-center space-x-1.5 transition-all shadow-[0_0_15px_rgba(223,177,91,0.3)] cursor-pointer active:scale-95"
            title="Emit Sovereign Pulse from Mukaab Core"
          >
            <Zap className="w-3.5 h-3.5 text-[#ffd978] animate-bounce" />
            <span>EMIT PULSE</span>
          </button>
        </div>
      </div>

      {/* Bottom HUD Metrics Overlay */}
      <div className="relative z-10 flex flex-wrap items-end justify-between gap-3 pointer-events-none">
        <div className="bg-[#07090e]/85 backdrop-blur-md p-3 rounded-lg border border-[#dfb15b]/20 text-xs font-mono text-slate-300 max-w-md pointer-events-auto">
          <div className="text-[#dfb15b] font-bold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#dfb15b] animate-ping" />
            <span>SOVEREIGN MUKAAB TELEMETRY SPECIFICATION</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Architectural cubic monument of New Murabba. Geometric cubic envelope housing the Totemic Resonance Core, orchestrating the 7 sovereign node harmonic frequencies into an uninterrupted cellular and spatial defense lattice.
          </p>
        </div>

        <div className="bg-[#07090e]/85 backdrop-blur-md px-3 py-2 rounded-lg border border-[#00f0ff]/30 text-xs font-mono pointer-events-auto flex items-center space-x-4">
          <div>
            <div className="text-[10px] text-slate-400">PULSE SEQUENCES</div>
            <div className="text-sm font-bold text-[#ffd978]">#{metrics.pulseCount}</div>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <div>
            <div className="text-[10px] text-slate-400">GOLDEN RATIO FACTOR</div>
            <div className="text-sm font-bold text-[#00f0ff]">{metrics.resonanceRatio.toFixed(6)}</div>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <div>
            <div className="text-[10px] text-slate-400">CAMERA</div>
            <div className="text-[11px] text-slate-300">ORBIT CONTROLS ACTIVE</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MukaabScene;
