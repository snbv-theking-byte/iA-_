import React from "react";
import { Activity, ShieldCheck, Zap, Radio, Cpu } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { PHI } from "../../types";
import styles from "./hud.module.css";

export const HUDBar: React.FC = () => {
  const metrics = useAppStore((state) => state.metrics);
  const coreStatus = useAppStore((state) => state.coreStatus);
  const radarNodes = useAppStore((state) => state.radarNodes);
  const activeNodes = radarNodes ? radarNodes.filter((n) => n.status === "active").length : 5;
  const totalNodes = radarNodes ? radarNodes.length : 7;
  const theme = useAppStore((state) => state.theme);

  const getStatusColor = () => {
    switch (coreStatus) {
      case "overcharge":
        return "text-[#ff3366]";
      case "warning":
        return "text-[#ffd978]";
      case "nominal":
      default:
        return "text-[#00f0ff]";
    }
  };

  return (
    <div className={styles.hudBar}>
      {/* 1. Mukaab Core Status */}
      <div className={styles.hudCard}>
        <div className={styles.cornerAccent} />
        <div className={styles.hudCardHeader}>
          <span>MUKAAB CORE STATE</span>
          <Cpu className="w-3.5 h-3.5 text-[#dfb15b]" />
        </div>
        <div className={`${styles.hudCardValue} ${getStatusColor()}`}>
          {coreStatus.toUpperCase()}
          <span className={styles.hudCardSub}>Φ = {PHI.toFixed(4)}</span>
        </div>
      </div>

      {/* 2. Strategic Radar Nodes */}
      <div className={styles.hudCard}>
        <div className={styles.cornerAccent} />
        <div className={styles.hudCardHeader}>
          <span>SOVEREIGN RADAR</span>
          <Radio className="w-3.5 h-3.5 text-[#00f0ff]" />
        </div>
        <div className={styles.hudCardValue}>
          <span className="text-[#00f0ff]">{activeNodes}</span>
          <span className="text-slate-500 font-normal">/ {totalNodes || 7}</span>
          <span className={styles.hudCardSub}>ACTIVE</span>
        </div>
      </div>

      {/* 3. Bio-Defense Shield */}
      <div className={styles.hudCard}>
        <div className={styles.cornerAccent} />
        <div className={styles.hudCardHeader}>
          <span>BIO-DEFENSE SCOUT</span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className={styles.hudCardValue}>
          <span className="text-emerald-400">{metrics.bioThreatLevel || "DEFCON 4"}</span>
          <span className={styles.hudCardSub}>ALPHA FOLD 3D</span>
        </div>
      </div>

      {/* 4. Sovereign Resonance Uptime */}
      <div className={styles.hudCard}>
        <div className={styles.cornerAccent} />
        <div className={styles.hudCardHeader}>
          <span>RESONANCE UPTIME</span>
          <Zap className="w-3.5 h-3.5 text-[#ffd978]" />
        </div>
        <div className={styles.hudCardValue}>
          <span className="text-[#ffd978]">{Math.floor((metrics.uptimeMs || 0) / 1000)}s</span>
          <span className={styles.hudCardSub}>RATE: 1.618 GHz</span>
        </div>
      </div>
    </div>
  );
};
