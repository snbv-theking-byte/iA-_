import React, { useEffect, useRef, useState } from 'react';
import SmilesDrawer from 'smiles-drawer';
import { 
  BioScienceService, 
  SOVEREIGN_CHEMICAL_PRESETS 
} from '../../services/BioScienceService';
import { ChemicalCompound } from '../../types';
import { useCommandStore } from '../../store/useCommandStore';
import { AudioManager } from '../../systems/AudioManager';
import { 
  FlaskConical, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Sparkles,
  Activity,
  Layers
} from 'lucide-react';

export const ChemicalDefenseScout: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { selectedCompound, setSelectedCompound, isBioScanning, setBioScanning } = useCommandStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentCompound, setCurrentCompound] = useState<ChemicalCompound>(
    selectedCompound || SOVEREIGN_CHEMICAL_PRESETS[0]
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Render 2D SMILES Structure onto HTML5 Canvas using SmilesDrawer
  useEffect(() => {
    if (!canvasRef.current || !currentCompound?.canonicalSmiles) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    try {
      const options = {
        width: 420,
        height: 320,
        bondThickness: 2.0,
        bondLength: 20,
        themes: {
          dark: {
            C: '#f8fafc',
            O: '#ef4444',
            N: '#38bdf8',
            S: '#eab308',
            P: '#f97316',
            Cl: '#22c55e',
            F: '#10b981',
            Br: '#a855f7',
            BACKGROUND: 'transparent',
          },
        },
      };

      const drawer = new (SmilesDrawer as any).Drawer(options);
      (SmilesDrawer as any).parse(
        currentCompound.canonicalSmiles,
        (tree: any) => {
          drawer.draw(tree, canvas, 'dark', false);
        },
        (err: any) => {
          console.warn('[SmilesDrawer] Parse warning:', err);
        }
      );
    } catch (err) {
      console.error('[SmilesDrawer] Render error:', err);
    }
  }, [currentCompound]);

  const handleSelectPreset = (compound: ChemicalCompound) => {
    setCurrentCompound(compound);
    setSelectedCompound(compound);
    setErrorMsg(null);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setBioScanning(true);
    setErrorMsg(null);
    AudioManager.playBioScanChirp();

    try {
      const result = await BioScienceService.searchPubChem(searchQuery);
      setCurrentCompound(result);
      setSelectedCompound(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Compound lookup failed.');
    } finally {
      setBioScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Preset Countermeasures Bar */}
      <div className="glass-panel rounded-xl p-4 border border-[#ffe600]/25 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <FlaskConical className="w-4 h-4 text-[#ffe600] animate-bounce" />
            <span className="font-sovereign text-xs font-bold text-[#ffe600] tracking-wider">
              SOVEREIGN COUNTERMEASURE & THERAPEUTIC PRESETS:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {SOVEREIGN_CHEMICAL_PRESETS.map((comp) => (
              <button
                key={comp.cid}
                onClick={() => handleSelectPreset(comp)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                  currentCompound.cid === comp.cid
                    ? 'bg-[#ffe600]/25 text-[#ffe600] border border-[#ffe600] font-bold shadow-[0_0_10px_rgba(255,230,0,0.3)]'
                    : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                }`}
              >
                {comp.name}
              </button>
            ))}
          </div>
        </div>

        {/* Compound Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-3 flex items-center space-x-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PubChem chemical database by name (e.g. Naloxone, Morphine, Penicillin, Dexamethasone)..."
              className="w-full bg-[#07090e]/90 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#ffe600] focus:ring-1 focus:ring-[#ffe600] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isBioScanning}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#ffe600]/20 to-[#ffe600]/40 hover:from-[#ffe600]/30 hover:to-[#ffe600]/50 border border-[#ffe600] text-[#ffe600] font-mono font-bold text-xs tracking-wider transition-all cursor-pointer disabled:opacity-50"
          >
            {isBioScanning ? 'QUERYING...' : 'PUBCHEM LOOKUP'}
          </button>
        </form>

        {errorMsg && (
          <div className="mt-3 p-2.5 rounded bg-rose-500/15 border border-rose-500/40 text-rose-400 text-xs font-mono flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Main Chemical Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 2D Chemical Structure Canvas */}
        <div className="lg:col-span-6 glass-panel rounded-xl p-5 border border-[#dfb15b]/30 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#dfb15b]/20">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#ffd978]" />
                <span className="font-sovereign text-sm font-bold text-[#ffd978] tracking-wider">
                  2D MOLECULAR TOPOLOGY
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#dfb15b]/15 text-[#ffd978] border border-[#dfb15b]/30">
                SMILES-DRAWER WEBGL
              </span>
            </div>

            <div className="my-4 flex items-center justify-center bg-[#05070c] rounded-xl border border-slate-800/80 p-4 h-[340px]">
              <canvas
                ref={canvasRef}
                width={420}
                height={320}
                className="max-w-full max-h-full block"
              />
            </div>

            <div className="space-y-1 font-mono text-xs">
              <div className="text-[10px] text-slate-400">CANONICAL SMILES STRING</div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-[#00f0ff] break-all select-all">
                {currentCompound.canonicalSmiles || 'N/A'}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#dfb15b]/20 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">CLASSIFICATION:</span>
            <span className="font-bold text-[#ffd978]">{currentCompound.classification}</span>
          </div>
        </div>

        {/* Right Column: Physicochemical Telemetry & Lipinski Evaluation */}
        <div className="lg:col-span-6 glass-panel rounded-xl p-5 border border-[#dfb15b]/30 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#dfb15b]/20">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-[#00f0ff]" />
                <span className="font-sovereign text-sm font-bold text-white tracking-wider">
                  PHYSICOCHEMICAL TELEMETRY
                </span>
              </div>
              <a
                href={`https://pubchem.ncbi.nlm.nih.gov/compound/${currentCompound.cid}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 text-xs font-mono text-[#00f0ff] hover:underline"
              >
                <span>CID: {currentCompound.cid}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Compound Title & IUPAC */}
            <div className="mt-4 font-mono">
              <div className="text-lg font-bold text-[#ffd978]">{currentCompound.name}</div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                IUPAC: <span className="text-slate-300">{currentCompound.iupacName}</span>
              </div>
            </div>

            {/* Metric Property Grid */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-2.5 rounded bg-slate-900/70 border border-slate-800">
                <div className="text-[10px] text-slate-400">FORMULA</div>
                <div className="text-sm font-bold text-white mt-0.5">{currentCompound.molecularFormula}</div>
              </div>
              <div className="p-2.5 rounded bg-slate-900/70 border border-slate-800">
                <div className="text-[10px] text-slate-400">MOL WEIGHT</div>
                <div className="text-sm font-bold text-[#ffd978] mt-0.5">{currentCompound.molecularWeight.toFixed(2)} g/mol</div>
              </div>
              <div className="p-2.5 rounded bg-slate-900/70 border border-slate-800">
                <div className="text-[10px] text-slate-400">XLOGP (LIPOPHILICITY)</div>
                <div className="text-sm font-bold text-[#00f0ff] mt-0.5">{currentCompound.xLogP ?? 'N/A'}</div>
              </div>
              <div className="p-2.5 rounded bg-slate-900/70 border border-slate-800">
                <div className="text-[10px] text-slate-400">H-BOND DONORS</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">{currentCompound.hBondDonorCount ?? 0}</div>
              </div>
              <div className="p-2.5 rounded bg-slate-900/70 border border-slate-800">
                <div className="text-[10px] text-slate-400">H-BOND ACCEPTORS</div>
                <div className="text-sm font-bold text-amber-400 mt-0.5">{currentCompound.hBondAcceptorCount ?? 0}</div>
              </div>
              <div className="p-2.5 rounded bg-slate-900/70 border border-slate-800">
                <div className="text-[10px] text-slate-400">POLAR AREA (TPSA)</div>
                <div className="text-sm font-bold text-purple-400 mt-0.5">{currentCompound.topologicalPolarSurfaceArea ?? 0} Å²</div>
              </div>
            </div>

            {/* Lipinski Rule of Five Assessment */}
            <div className="mt-5 p-3 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white">LIPINSKI RULE OF FIVE (ORAL DRUG-LIKENESS)</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  currentCompound.lipinskiCompliant
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  {currentCompound.lipinskiCompliant ? 'PASS' : 'VIOLATION DETECTED'}
                </span>
              </div>

              <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center space-x-1.5">
                  {currentCompound.molecularWeight <= 500 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  )}
                  <span className="text-slate-300">MW ≤ 500 ({currentCompound.molecularWeight.toFixed(1)})</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  {(currentCompound.xLogP == null || currentCompound.xLogP <= 5) ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  )}
                  <span className="text-slate-300">LogP ≤ 5 ({currentCompound.xLogP ?? 'N/A'})</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  {(currentCompound.hBondDonorCount == null || currentCompound.hBondDonorCount <= 5) ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  )}
                  <span className="text-slate-300">H-Donors ≤ 5 ({currentCompound.hBondDonorCount ?? 0})</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  {(currentCompound.hBondAcceptorCount == null || currentCompound.hBondAcceptorCount <= 10) ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  )}
                  <span className="text-slate-300">H-Acceptors ≤ 10 ({currentCompound.hBondAcceptorCount ?? 0})</span>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="mt-4 p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed">
              <span className="text-[#ffd978] font-bold">SOVEREIGN PROTOCOL: </span>
              {currentCompound.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
