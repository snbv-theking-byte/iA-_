import React from "react";
import { useAppStore } from "../../store/useAppStore";
import styles from "./settings.module.css";

export const CRTOverlay: React.FC = () => {
  const crtEnabled = useAppStore((state) => state.crtFilterEnabled);

  if (!crtEnabled) return null;

  return <div className={styles.crtOverlay} aria-hidden="true" />;
};
