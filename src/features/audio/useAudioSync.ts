import { useEffect, useRef } from "react";
import { useAppStore } from "../../store/useAppStore";
import { audioEngine } from "./AudioEngine";

export function useAudioSync() {
  const audioEnabled = useAppStore((state) => state.audioEnabled);
  const audioVolume = useAppStore((state) => state.audioVolume);
  const logs = useAppStore((state) => state.logs);
  const prevLogsLength = useRef(logs.length);

  // Initialize audio context on first user click anywhere in the app
  useEffect(() => {
    const handleUserInteraction = () => {
      audioEngine.initialize();
      window.removeEventListener("pointerdown", handleUserInteraction);
    };

    window.addEventListener("pointerdown", handleUserInteraction);
    return () => window.removeEventListener("pointerdown", handleUserInteraction);
  }, []);

  // Update volume whenever audioVolume changes
  useEffect(() => {
    audioEngine.setVolume(audioVolume);
  }, [audioVolume]);

  // Listen to new log additions and trigger appropriate sound effects
  useEffect(() => {
    if (!audioEnabled || logs.length <= prevLogsLength.current) {
      prevLogsLength.current = logs.length;
      return;
    }

    const latestLog = logs[0]; // Newest logs are prepended

    if (latestLog) {
      if (latestLog.level === "critical") {
        audioEngine.play("critical", true);
      } else if (latestLog.level === "warning") {
        audioEngine.play("warning", true);
      } else if (latestLog.level === "sovereign") {
        audioEngine.play("pulse", true);
      } else if (latestLog.category === "RADAR") {
        audioEngine.play("blip", true);
      } else {
        audioEngine.play("click", true);
      }
    }

    prevLogsLength.current = logs.length;
  }, [logs, audioEnabled]);
}
