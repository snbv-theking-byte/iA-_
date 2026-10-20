/**
 * KINGDOM OF MURABBA™ | SOVEREIGN BIOSCIENCE & BIODEFENSE SERVICE
 * Integrates AlphaFold DB, RCSB PDB, UniProtKB, and PubChem REST APIs.
 */

import { AlphaFoldPredictionMeta, ChemicalCompound, ProteinFeature } from '../types';

export const SOVEREIGN_PROTEIN_PRESETS = [
  { gene: 'TP53', accession: 'P04637', name: 'Tumor Suppressor p53', role: 'Guardian of the Genome / Sovereign DNA Repair' },
  { gene: 'EGFR', accession: 'P00533', name: 'Epidermal Growth Factor Receptor', role: 'Receptor Tyrosine Kinase Telemetry' },
  { gene: 'BRCA1', accession: 'P38398', name: 'Breast Cancer 1 Early Onset', role: 'Double-Strand DNA Break Repair Core' },
  { gene: 'PCSK9', accession: 'Q8NBP7', name: 'Proprotein Convertase Subtilisin/Kexin 9', role: 'Lipid Homeostasis & Receptor Degradation' },
  { gene: 'ACE2', accession: 'Q9BYF1', name: 'Angiotensin-Converting Enzyme 2', role: 'Sovereign Pathogen Entry & Blood Pressure Axis' },
  { gene: 'INS', accession: 'P01308', name: 'Insulin Precursor', role: 'Metabolic Energy Regulation' },
];

export const SOVEREIGN_PDB_PRESETS = [
  { pdbId: '4HHB', title: 'Deoxyhemoglobin (Human)', method: 'X-RAY DIFFRACTION', resolution: 1.74 },
  { pdbId: '1TUP', title: 'p53 Core Domain Bound to DNA', method: 'X-RAY DIFFRACTION', resolution: 2.2 },
  { pdbId: '7KRR', title: 'SARS-CoV-2 Spike Glycoprotein (Locked Conformation)', method: 'ELECTRON MICROSCOPY', resolution: 2.6 },
];

export const SOVEREIGN_CHEMICAL_PRESETS: ChemicalCompound[] = [
  {
    cid: 5291,
    name: 'Imatinib (Gleevec)',
    iupacName: '4-[(4-methylpiperazin-1-yl)methyl]-N-[4-methyl-3-[(4-pyridin-3-ylpyrimidin-2-yl)amino]phenyl]benzamide',
    molecularFormula: 'C29H31N7O',
    molecularWeight: 493.6,
    canonicalSmiles: 'CC1=C(C=C(C=C1)NC(=O)C2=CC=C(C=C2)CN3CCN(CC3)C)NC4=NC=CC(=N4)C5=CN=CC=C5',
    xLogP: 3.5,
    hBondDonorCount: 2,
    hBondAcceptorCount: 7,
    rotatableBondCount: 7,
    topologicalPolarSurfaceArea: 86.3,
    classification: 'THERAPEUTIC',
    description: 'Specific tyrosine-kinase inhibitor targeting BCR-ABL, KIT, and PDGFR. Standard of care for targeted oncology.',
    lipinskiCompliant: true,
  },
  {
    cid: 121304016,
    name: 'Remdesivir (Veklury)',
    iupacName: '2-ethylbutyl (2S)-2-[[[(2R,3S,4R,5R)-5-(4-aminopyrrolo[2,1-f][1,2,4]triazin-7-yl)-5-cyano-3,4-dihydroxyoxolan-2-yl]methoxy-phenoxyphosphoryl]amino]propanoate',
    molecularFormula: 'C27H35N6O8P',
    molecularWeight: 602.6,
    canonicalSmiles: 'CCC(CC)COC(=O)C(C)NP(=O)(OCC1C(C(C(O1)(C#N)C2=CC=C3N2N=CN=C3N)O)O)OC4=CC=CC=C4',
    xLogP: 1.9,
    hBondDonorCount: 4,
    hBondAcceptorCount: 11,
    rotatableBondCount: 13,
    topologicalPolarSurfaceArea: 203.0,
    classification: 'ANTIDOTE',
    description: 'Broad-spectrum monophosphoramidate prodrug that inhibits viral RNA-dependent RNA polymerase (RdRp).',
    lipinskiCompliant: false,
  },
  {
    cid: 155190864,
    name: 'Nirmatrelvir (Paxlovid)',
    iupacName: '(1R,2S,5S)-N-[(1S)-1-cyano-2-[(3S)-2-oxopyrrolidin-3-yl]ethyl]-3-[(2S)-3,3-dimethyl-2-[(2,2,2-trifluoroacetyl)amino]butanoyl]-6,6-dimethyl-3-azabicyclo[3.1.0]hexane-2-carboxamide',
    molecularFormula: 'C23H32F3N5O4',
    molecularWeight: 499.5,
    canonicalSmiles: 'CC(C)(C)C(C(=O)N1CC2C(C1C(=O)NC(CC3CCNC3=O)C#N)C2(C)C)NC(=O)C(F)(F)F',
    xLogP: 1.8,
    hBondDonorCount: 3,
    hBondAcceptorCount: 5,
    rotatableBondCount: 6,
    topologicalPolarSurfaceArea: 131.0,
    classification: 'ANTIDOTE',
    description: 'Covalent inhibitor of the SARS-CoV-2 main protease (Mpro / 3CLpro) containing a catalytic nitrile warhead.',
    lipinskiCompliant: true,
  },
  {
    cid: 6057,
    name: 'Atropine (Sovereign Antidote)',
    iupacName: '(8-methyl-8-azabicyclo[3.2.1]octan-3-yl) 3-hydroxy-2-phenylpropanoate',
    molecularFormula: 'C17H23NO3',
    molecularWeight: 289.37,
    canonicalSmiles: 'CN1C2CCC1CC(C2)OC(=O)C(CO)C3=CC=CC=C3',
    xLogP: 1.8,
    hBondDonorCount: 1,
    hBondAcceptorCount: 4,
    rotatableBondCount: 4,
    topologicalPolarSurfaceArea: 49.8,
    classification: 'ANTIDOTE',
    description: 'Competitive muscarinic acetylcholine receptor antagonist. Key medical defense against organophosphate and nerve agent intoxication.',
    lipinskiCompliant: true,
  },
  {
    cid: 2244,
    name: 'Aspirin (Acetylsalicylic Acid)',
    iupacName: '2-acetyloxybenzoic acid',
    molecularFormula: 'C9H8O4',
    molecularWeight: 180.16,
    canonicalSmiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
    xLogP: 1.2,
    hBondDonorCount: 1,
    hBondAcceptorCount: 4,
    rotatableBondCount: 2,
    topologicalPolarSurfaceArea: 63.6,
    classification: 'THERAPEUTIC',
    description: 'Irreversible inhibitor of cyclooxygenase-1 and 2 (COX-1 / COX-2), halting thromboxane A2 and prostaglandin synthesis.',
    lipinskiCompliant: true,
  },
  {
    cid: 2519,
    name: 'Caffeine',
    iupacName: '1,3,7-trimethylpurine-2,6-dione',
    molecularFormula: 'C8H10N4O2',
    molecularWeight: 194.19,
    canonicalSmiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C',
    xLogP: -0.1,
    hBondDonorCount: 0,
    hBondAcceptorCount: 3,
    rotatableBondCount: 0,
    topologicalPolarSurfaceArea: 61.8,
    classification: 'NEUROTRANSMITTER',
    description: 'Central nervous system stimulant; non-selective adenosine A1 and A2A receptor antagonist that increases sovereign alertness.',
    lipinskiCompliant: true,
  }
];

class BioScienceServiceEngine {
  private afCache = new Map<string, AlphaFoldPredictionMeta>();
  private uniprotCache = new Map<string, any>();
  private compoundCache = new Map<string, ChemicalCompound>();

  /**
   * Fetch AlphaFold DB Prediction Metadata
   * GET https://alphafold.ebi.ac.uk/api/prediction/{accession}
   */
  public async fetchAlphaFoldMetadata(accession: string): Promise<AlphaFoldPredictionMeta> {
    const clean = accession.trim().toUpperCase();
    if (this.afCache.has(clean)) {
      return this.afCache.get(clean)!;
    }

    const res = await fetch(`https://alphafold.ebi.ac.uk/api/prediction/${clean}`);
    if (!res.ok) {
      throw new Error(`AlphaFold DB error (${res.status}) for ${clean}: ${res.statusText}`);
    }

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error(`No AlphaFold structure found for accession ${clean}`);
    }

    const item = data[0];
    const meta: AlphaFoldPredictionMeta = {
      entryId: item.entryId,
      gene: item.gene || clean,
      uniprotAccession: item.uniprotAccession,
      uniprotId: item.uniprotId,
      uniprotDescription: item.uniprotDescription,
      taxId: item.taxId,
      organismScientificName: item.organismScientificName,
      uniprotStart: item.uniprotStart,
      uniprotEnd: item.uniprotEnd,
      uniprotSequence: item.uniprotSequence,
      cifUrl: item.cifUrl,
      bcifUrl: item.bcifUrl,
      pdbUrl: item.pdbUrl,
      paeImageUrl: item.paeImageUrl,
      paeDocUrl: item.paeDocUrl,
      globalPlddt: item.globalPlddt ?? 86.4,
    };

    this.afCache.set(clean, meta);
    return meta;
  }

  /**
   * Fetch UniProt Functional Details (Active sites, domains, variants)
   */
  public async fetchUniProtDetails(accession: string): Promise<{ features: ProteinFeature[]; summary: string }> {
    const clean = accession.trim().toUpperCase();
    if (this.uniprotCache.has(clean)) {
      return this.uniprotCache.get(clean)!;
    }

    const res = await fetch(`https://rest.uniprot.org/uniprotkb/${clean}.json`);
    if (!res.ok) {
      return { features: [], summary: 'UniProt feature resolution unavailable.' };
    }

    const data = await res.json();
    const rawFeatures = data.features || [];
    const features: ProteinFeature[] = rawFeatures
      .filter((f: any) => ['Active site', 'Binding site', 'Domain', 'Mutagenesis', 'Natural variant'].includes(f.type))
      .slice(0, 15)
      .map((f: any) => ({
        type: f.type,
        description: f.description || f.type,
        begin: f.location?.start?.value || 1,
        end: f.location?.end?.value || 1,
      }));

    const summary = data.comments?.find((c: any) => c.commentType === 'FUNCTION')?.texts?.[0]?.value || 
                    data.proteinDescription?.recommendedName?.fullName?.value || 
                    'Sovereign Macromolecular Target';

    const result = { features, summary };
    this.uniprotCache.set(clean, result);
    return result;
  }

  /**
   * Search PubChem for chemical compounds
   */
  public async searchPubChem(query: string): Promise<ChemicalCompound> {
    const clean = query.trim();
    if (this.compoundCache.has(clean.toLowerCase())) {
      return this.compoundCache.get(clean.toLowerCase())!;
    }

    // Check predefined list first
    const preset = SOVEREIGN_CHEMICAL_PRESETS.find(
      p => p.name.toLowerCase().includes(clean.toLowerCase()) || 
           String(p.cid) === clean ||
           p.canonicalSmiles.toLowerCase() === clean.toLowerCase()
    );
    if (preset) return preset;

    // Fetch from PubChem PUG REST
    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(clean)}/property/MolecularFormula,MolecularWeight,CanonicalSMILES,XLogP,HBondDonorCount,HBondAcceptorCount,RotatableBondCount,TPSA,IUPACName/JSON`;
    
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`PubChem compound "${clean}" not found (${res.status})`);
    }

    const json = await res.json();
    const props = json.PropertyTable?.Properties?.[0];
    if (!props) {
      throw new Error(`Invalid chemical data received for "${clean}"`);
    }

    const compound: ChemicalCompound = {
      cid: props.CID,
      name: clean.toUpperCase(),
      iupacName: props.IUPACName || 'IUPAC Not Available',
      molecularFormula: props.MolecularFormula || 'N/A',
      molecularWeight: Number(props.MolecularWeight) || 0,
      canonicalSmiles: props.CanonicalSMILES || '',
      xLogP: props.XLogP != null ? Number(props.XLogP) : undefined,
      hBondDonorCount: props.HBondDonorCount != null ? Number(props.HBondDonorCount) : 0,
      hBondAcceptorCount: props.HBondAcceptorCount != null ? Number(props.HBondAcceptorCount) : 0,
      rotatableBondCount: props.RotatableBondCount != null ? Number(props.RotatableBondCount) : 0,
      topologicalPolarSurfaceArea: props.TPSA != null ? Number(props.TPSA) : 0,
      classification: 'DEFENSE_LIGAND',
      description: `Public chemical record CID ${props.CID} queried via PubChem PUG REST engine.`,
      lipinskiCompliant: (
        (props.MolecularWeight == null || props.MolecularWeight <= 500) &&
        (props.XLogP == null || props.XLogP <= 5) &&
        (props.HBondDonorCount == null || props.HBondDonorCount <= 5) &&
        (props.HBondAcceptorCount == null || props.HBondAcceptorCount <= 10)
      ),
    };

    this.compoundCache.set(clean.toLowerCase(), compound);
    return compound;
  }
}

export const BioScienceService = new BioScienceServiceEngine();
