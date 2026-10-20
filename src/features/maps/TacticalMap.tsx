import React, { useState, useEffect, useCallback } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow, 
  Polyline,
  useMap 
} from '@vis.gl/react-google-maps';
import { 
  MapPin, 
  Layers, 
  Navigation, 
  Radio, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Key, 
  Compass, 
  Globe, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { STRATEGIC_MAP_NODES, STRATEGIC_MAP_VECTORS, RIYADH_COORDINATES } from './maps.constants';
import type { TacticalMapNode, TacticalMapTheme } from './maps.types';
import { useAppStore } from '../../store/useAppStore';
import { AudioManager } from '../../systems/AudioManager';

// Map Camera Controller Component
function MapCameraController({ 
  selectedNode, 
  targetCoords 
}: { 
  selectedNode: TacticalMapNode | null; 
  targetCoords: { lat: number; lng: number; zoom: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (targetCoords) {
      map.panTo({ lat: targetCoords.lat, lng: targetCoords.lng });
      map.setZoom(targetCoords.zoom);
    } else if (selectedNode) {
      map.panTo({ lat: selectedNode.latitude, lng: selectedNode.longitude });
      map.setZoom(8);
    }
  }, [map, selectedNode, targetCoords]);

  return null;
}

export const TacticalMap: React.FC = () => {
  const setActiveView = useAppStore((s) => s.setActiveView);
  const addLog = useAppStore((s) => s.addLog);

  // API Key Resolution: Env Var -> Local Storage -> Fallback
  const [storedKey, setStoredKey] = useState<string>(() => {
    return (
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 
      localStorage.getItem('murabba_gmp_api_key') || 
      ''
    );
  });
  const [inputKey, setInputKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [mapTheme, setMapTheme] = useState<TacticalMapTheme>('hybrid');
  const [selectedNode, setSelectedNode] = useState<TacticalMapNode | null>(null);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);
  const [cameraTarget, setCameraTarget] = useState<{ lat: number; lng: number; zoom: number } | null>(null);

  // Quota event listener
  useEffect(() => {
    const handleQuota = () => {
      setQuotaExceeded(true);
      addLog('SYSTEM', 'Google Maps Platform quota limit reached or auth exception detected.', 'warning');
    };
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, [addLog]);

  const handleSaveKey = () => {
    const trimmed = inputKey.trim();
    if (trimmed) {
      localStorage.setItem('murabba_gmp_api_key', trimmed);
      setStoredKey(trimmed);
      setShowKeyModal(false);
      AudioManager.playBioScanChirp();
      addLog('SYSTEM', 'Custom Google Maps Platform API Key registered.', 'info');
    }
  };

  const handleNodeClick = useCallback((node: TacticalMapNode) => {
    setSelectedNode(node);
    setCameraTarget({ lat: node.latitude, lng: node.longitude, zoom: 8 });
    AudioManager.playRadarPing();
    addLog('RADAR', `Tactical Google Maps surveillance locked onto ${node.name} [${node.codeName}]`, 'info');
  }, [addLog]);

  return (
    <div className="relative w-full h-full flex flex-col bg-[#05080f] text-gray-200 overflow-hidden select-none">
      {/* 1. Quota Exceeded Notification Banner (Strict Section 8 Compliance) */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
          <button 
            onClick={() => setQuotaExceeded(false)}
            className="ml-3 text-xs text-amber-800 hover:text-amber-950 px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Top Sovereign Command Bar */}
      <div className="z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#0a0f1d]/90 backdrop-blur-md border-b border-[#dfb15b]/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#dfb15b]/10 border border-[#dfb15b]/30">
            <MapPin className="w-5 h-5 text-[#ffd978]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-widest text-[#ffd978] uppercase">
                STRATEGIC GEO-THEATER // GOOGLE MAPS
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                LIVE SAT-LINK
              </span>
            </div>
            <p className="text-[11px] font-mono text-gray-400">
              High-Precision Photogrammetric & Vector Surveillance Grid
            </p>
          </div>
        </div>

        {/* Map Type & Control Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layer Selector */}
          <div className="flex items-center bg-[#05080f]/80 p-1 rounded-lg border border-gray-800">
            {(['hybrid', 'satellite', 'roadmap', 'terrain'] as TacticalMapTheme[]).map((theme) => (
              <button
                key={theme}
                onClick={() => {
                  setMapTheme(theme);
                  AudioManager.playKeyClick();
                }}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors uppercase cursor-pointer ${
                  mapTheme === theme
                    ? 'bg-[#dfb15b]/20 text-[#ffd978] border border-[#dfb15b]/40 font-bold'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>

          {/* Toggle Vector Mesh */}
          <button
            onClick={() => {
              setShowVectors(!showVectors);
              AudioManager.playKeyClick();
            }}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
              showVectors
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                : 'bg-gray-900/60 text-gray-400 border-gray-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {showVectors ? 'MESH: ON' : 'MESH: OFF'}
          </button>

          {/* Jump to 3D Globe */}
          <button
            onClick={() => {
              setActiveView('WORLD_GLOBE');
              AudioManager.playKeyClick();
            }}
            className="px-3 py-1.5 text-xs font-mono rounded-lg bg-[#dfb15b]/10 text-[#ffd978] border border-[#dfb15b]/30 hover:bg-[#dfb15b]/20 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            3D GLOBE
          </button>

          {/* API Key Drawer / Status */}
          <button
            onClick={() => setShowKeyModal(true)}
            className="px-3 py-1.5 text-xs font-mono rounded-lg bg-gray-900/80 text-gray-300 border border-gray-700 hover:border-[#dfb15b]/50 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-[#dfb15b]" />
            {storedKey ? 'KEY: CONFIGURED' : 'ENTER API KEY'}
          </button>
        </div>
      </div>

      {/* 3. Preset Quick Jump Bar */}
      <div className="z-10 flex items-center gap-2 px-4 py-2 bg-[#080d19]/80 backdrop-blur border-b border-gray-800/80 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-mono text-gray-500 tracking-wider flex items-center gap-1 flex-shrink-0">
          <Navigation className="w-3 h-3 text-[#ffd978]" /> FOCUS TARGETS:
        </span>
        {STRATEGIC_MAP_NODES.map((node) => (
          <button
            key={node.id}
            onClick={() => handleNodeClick(node)}
            className={`px-2.5 py-1 text-[11px] font-mono rounded-md whitespace-nowrap transition-all flex items-center gap-1.5 border cursor-pointer ${
              selectedNode?.id === node.id
                ? 'bg-[#dfb15b]/20 border-[#ffd978] text-[#ffd978] shadow-sm'
                : 'bg-black/30 border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-700'
            }`}
          >
            <span 
              className="w-1.5 h-1.5 rounded-full" 
              style={{ backgroundColor: node.color }} 
            />
            {node.name.replace('SOVEREIGN', '').replace('HARMONIC', '').trim()}
          </button>
        ))}
        <button
          onClick={() => {
            setSelectedNode(null);
            setCameraTarget({ lat: 26.0, lng: 42.0, zoom: 4 });
            AudioManager.playKeyClick();
          }}
          className="ml-auto px-2 py-1 text-[10px] font-mono rounded bg-gray-800/60 text-gray-400 hover:text-gray-200 border border-gray-700 flex-shrink-0 cursor-pointer"
        >
          RESET VIEW
        </button>
      </div>

      {/* 4. Main Google Map Canvas Area */}
      <div className="relative flex-1 w-full h-[calc(100%-110px)] overflow-hidden">
        {storedKey ? (
          <APIProvider apiKey={storedKey} libraries={['marker', 'geometry']}>
            <div className="w-full h-full">
              <Map
                mapId="DEMO_MAP_ID"
                defaultCenter={RIYADH_COORDINATES}
                defaultZoom={5}
                mapTypeId={mapTheme}
                disableDefaultUI={false}
                gestureHandling="greedy"
                internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
                style={{ width: '100%', height: '100%' }}
              >
                <MapCameraController 
                  selectedNode={selectedNode} 
                  targetCoords={cameraTarget} 
                />

                {/* Tactical Vectors / Mesh Lines */}
                {showVectors && STRATEGIC_MAP_VECTORS.map((vec) => (
                  <Polyline
                    key={vec.id}
                    path={[vec.fromCoords, vec.toCoords]}
                    geodesic={true}
                    options={{
                      strokeColor: vec.color,
                      strokeOpacity: 0.75,
                      strokeWeight: 2,
                    }}
                  />
                ))}

                {/* Advanced Markers for Tactical Strategic Nodes */}
                {STRATEGIC_MAP_NODES.map((node) => (
                  <AdvancedMarker
                    key={node.id}
                    position={{ lat: node.latitude, lng: node.longitude }}
                    title={node.name}
                    onClick={() => handleNodeClick(node)}
                  >
                    <div className="relative flex items-center justify-center cursor-pointer group">
                      {/* Animated Radar Pulse Ring */}
                      <span 
                        className="absolute w-8 h-8 rounded-full animate-ping opacity-40"
                        style={{ backgroundColor: node.color }}
                      />
                      <Pin
                        background={node.color}
                        borderColor="#dfb15b"
                        glyphColor="#0a0f1d"
                        scale={1.15}
                      />
                    </div>
                  </AdvancedMarker>
                ))}

                {/* Interactive Info Window for Selected Node */}
                {selectedNode && (
                  <InfoWindow
                    position={{ lat: selectedNode.latitude, lng: selectedNode.longitude }}
                    onCloseClick={() => setSelectedNode(null)}
                    headerContent={
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#dfb15b]">
                        <Radio className="w-3.5 h-3.5" />
                        <span>{selectedNode.codeName} // {selectedNode.name}</span>
                      </div>
                    }
                  >
                    <div className="p-1 max-w-xs font-sans text-gray-800 text-xs">
                      <div className="mb-2 pb-1.5 border-b border-gray-200">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-gray-100 text-gray-700">
                          {selectedNode.classification}
                        </span>
                        <p className="mt-1 text-gray-600 text-[11px] leading-tight">
                          {selectedNode.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono text-gray-600 mb-2">
                        <div>
                          <span className="text-gray-400 block">LAT / LNG:</span>
                          <span className="font-semibold text-gray-900">
                            {selectedNode.latitude.toFixed(4)}, {selectedNode.longitude.toFixed(4)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">ELEVATION:</span>
                          <span className="font-semibold text-gray-900">{selectedNode.altitudeMeters}m MSL</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">FREQUENCY:</span>
                          <span className="font-semibold text-gray-900">{selectedNode.frequency}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">ENCRYPTION:</span>
                          <span className="font-semibold text-gray-900">{selectedNode.encryptionProtocol}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                        <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                          <Activity className="w-3 h-3" /> SIGNAL: {selectedNode.signalStrengthPercent}%
                        </span>
                        <button
                          onClick={() => {
                            setActiveView('WORLD_GLOBE');
                            AudioManager.playKeyClick();
                          }}
                          className="px-2 py-1 text-[10px] font-mono bg-amber-500 hover:bg-amber-600 text-white rounded transition-colors cursor-pointer"
                        >
                          OPEN IN 3D GLOBE
                        </button>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </div>
          </APIProvider>
        ) : (
          /* Empty API Key State / Prompt */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#0a0f1d] to-[#04060c]">
            <div className="max-w-md p-8 rounded-2xl glass-panel border border-[#dfb15b]/30 shadow-2xl space-y-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#dfb15b]/10 border border-[#dfb15b]/40 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-[#ffd978]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#ffd978] uppercase tracking-wider">
                  Google Maps Platform Integration
                </h3>
                <p className="mt-2 text-xs text-gray-400 leading-relaxed font-mono">
                  To initialize the satellite photogrammetric theater and live geostrategic telemetry vectors, please provide your Google Maps Platform API Key.
                </p>
              </div>

              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#ffd978]"
                />
                <button
                  onClick={handleSaveKey}
                  disabled={!inputKey.trim()}
                  className="w-full py-2.5 text-xs font-bold font-mono tracking-wider text-black bg-gradient-to-r from-[#dfb15b] to-[#ffd978] rounded-lg hover:brightness-110 disabled:opacity-50 transition-all uppercase cursor-pointer"
                >
                  Activate Tactical Map
                </button>
              </div>

              <div className="pt-3 border-t border-gray-800 text-[11px] text-gray-500 font-mono text-left space-y-1">
                <p className="flex items-center gap-1 text-gray-400">
                  <Info className="w-3.5 h-3.5 text-[#dfb15b]" /> Environment Variable:
                </p>
                <code className="text-[#ffd978] block bg-black/40 px-2 py-1 rounded text-[10px]">
                  VITE_GOOGLE_MAPS_API_KEY
                </code>
              </div>
            </div>
          </div>
        )}

        {/* 5. Tactical Telemetry Floating Overlay (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-10 pointer-events-none flex flex-col gap-2">
          <div className="px-3 py-2 rounded-lg bg-[#0a0f1d]/90 backdrop-blur-md border border-[#dfb15b]/30 shadow-lg text-[11px] font-mono">
            <div className="flex items-center gap-2 text-[#ffd978] font-bold mb-1">
              <Compass className="w-3.5 h-3.5" /> GEO-TELEMETRY STATUS
            </div>
            <div className="space-y-0.5 text-gray-400 text-[10px]">
              <div>COORDINATES: <span className="text-gray-200">24.7950° N, 46.5700° E</span></div>
              <div>SURVEILLANCE NODES: <span className="text-emerald-400">7 ONLINE</span></div>
              <div>GEODESIC ARCS: <span className="text-cyan-400">6 ACTIVE</span></div>
              <div>CORE DATUM: <span className="text-gray-200">WGS84 // EPSG:4326</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. API Key Management Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 rounded-xl glass-panel border border-[#dfb15b]/40 shadow-2xl bg-[#0a0f1d] text-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#ffd978]" />
                <h4 className="text-sm font-bold font-mono text-[#ffd978] uppercase">
                  Google Maps API Configuration
                </h4>
              </div>
              <button 
                onClick={() => setShowKeyModal(false)}
                className="text-gray-500 hover:text-gray-300 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-400 font-mono leading-relaxed">
              Enter your Google Maps Platform API key below. The key is securely used by your client browser to render maps, satellite photogrammetry, and advanced pins.
            </p>

            <div className="space-y-2">
              <label className="text-[11px] font-mono text-gray-400">API Key String:</label>
              <input
                type="text"
                placeholder="AIzaSy..."
                defaultValue={storedKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-black/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#ffd978]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-3 py-1.5 text-xs font-mono text-gray-400 hover:text-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKey}
                className="px-4 py-1.5 text-xs font-mono font-bold text-black bg-[#ffd978] hover:bg-[#dfb15b] rounded-lg transition-colors cursor-pointer"
              >
                Save & Reload Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
