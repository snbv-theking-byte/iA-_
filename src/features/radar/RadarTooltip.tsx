import React from "react";
import type { HoveredNodeInfo } from "./radar.types";
import styles from "./radar.module.css";

interface Props {
  info: HoveredNodeInfo | null;
}

export const RadarTooltip: React.FC<Props> = ({ info }) => {
  if (!info) return null;

  const { node, screenX, screenY } = info;

  const getThreatClass = (level: string) => {
    switch (level) {
      case 'ALPHA': return styles.threatBadgeAlpha;
      case 'BRAVO': return styles.threatBadgeBravo;
      case 'CHARLIE': return styles.threatBadgeCharlie;
      case 'DELTA': return styles.threatBadgeDelta;
      default: return '';
    }
  };

  return (
    <div
      className={styles.tooltip}
      style={{
        left: `${screenX + 16}px`,
        top: `${screenY - 32}px`
      }}
    >
      <div className={styles.tooltipHeader}>
        <span 
          className={styles.statusDot} 
          style={{ background: node.color, color: node.color }} 
        />
        <span className={styles.nodeName}>{node.name}</span>
        <span className={`${styles.threatBadge} ${getThreatClass(node.threatLevel)}`}>
          {node.threatLevel}
        </span>
      </div>

      <div className={styles.tooltipBody}>
        <div>
          <span>CLASS:</span> {node.classification}
        </div>
        <div>
          <span>STATUS:</span> {node.status.toUpperCase()}
        </div>
        <div>
          <span>COORDS:</span> {node.coordinates}
        </div>
        {node.description && <p className={styles.description}>{node.description}</p>}
      </div>
    </div>
  );
};
