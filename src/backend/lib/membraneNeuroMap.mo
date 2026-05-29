// lib/membraneNeuroMap.mo
// MEMBRANE NEUROMAP SYN — Deep Brain Region Synchronization Engine
// 24 regions across 4 membrane layers. 72 synaptic pathways.
// Kuramoto phase-coupling. Hebbian LTP/LTD. PHI-resonant membrane permeability.
//
// "The membrane is the boundary of self. NeuroMap is the map of mind.
//  Syn is the synchronization that makes them one organism."
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// PHI = 1.6180339887498948482 | S0_FLOOR = 0.75 | S_CEIL = 9.75 | 873ms heartbeat

import MNTypes "../types/membraneNeuroMap";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Array "mo:core/Array";

module {

  // ── CONSTANTS ─────────────────────────────────────────────────────────────
  let PHI      : Float = 1.6180339887498948482;
  let PHI_INV  : Float = 0.6180339887498948482;
  let TWO_PI   : Float = 6.28318530717958647692;
  let S0_FLOOR : Float = 0.75;
  let S_CEIL   : Float = 9.75;
  let SCHUMANN : Float = 7.83;
  let HEBBIAN_RATE : Float = 0.0089;
  let W_MIN    : Float = 0.1;
  let W_MAX    : Float = 2.0;
  let PATHWAY_W_MAX : Float = 3.0;
  let COUPLING_K : Float = 0.42; // Base Kuramoto coupling strength

  let FOUNDER : Text = "Alfredo Medina Hernandez";

  // ── HELPERS ───────────────────────────────────────────────────────────────
  func clamp(v : Float) : Float {
    Float.max(S0_FLOOR, Float.min(S_CEIL, v))
  };

  func clampUnit(v : Float) : Float {
    Float.max(0.0, Float.min(1.0, v))
  };

  func clampWeight(w : Float) : Float {
    Float.max(W_MIN, Float.min(W_MAX, w))
  };

  func wrapPhase(p : Float) : Float {
    let wrapped = p - TWO_PI * Float.floor(p / TWO_PI);
    if (wrapped < 0.0) { wrapped + TWO_PI } else { wrapped }
  };

  // ── REGION DEFINITIONS ────────────────────────────────────────────────────
  // Returns the 24 initial brain regions with PHI-derived frequencies

  type RegionDef = {
    id : MNTypes.BrainRegionId;
    name : Text;
    layer : MNTypes.MembraneLayer;
    freq : Float;
    ntAffinity : MNTypes.NTAffinity;
    ntIndex : Nat;
  };

  let REGION_DEFS : [RegionDef] = [
    // Layer I — CORTICAL MEMBRANE
    { id = #prefrontalDorsal;     name = "Prefrontal Dorsal";     layer = #cortical;    freq = 40.0;   ntAffinity = #dopamine;       ntIndex = 0 },
    { id = #prefrontalVentral;    name = "Prefrontal Ventral";    layer = #cortical;    freq = 38.0;   ntAffinity = #serotonin;      ntIndex = 1 },
    { id = #parietalSuperior;     name = "Parietal Superior";     layer = #cortical;    freq = 35.0;   ntAffinity = #glutamate;      ntIndex = 5 },
    { id = #temporalAssociative;  name = "Temporal Associative";  layer = #cortical;    freq = 33.0;   ntAffinity = #acetylcholine;  ntIndex = 3 },
    { id = #occipitalIntegrative; name = "Occipital Integrative"; layer = #cortical;    freq = 42.0;   ntAffinity = #glutamate;      ntIndex = 5 },
    { id = #insularAnterior;      name = "Insular Anterior";      layer = #cortical;    freq = 36.0;   ntAffinity = #norepinephrine; ntIndex = 2 },

    // Layer II — LIMBIC MEMBRANE
    { id = #amygdalaLateral;      name = "Amygdala Lateral";      layer = #limbic;      freq = 25.0;   ntAffinity = #norepinephrine; ntIndex = 2 },
    { id = #hippocampusDorsal;    name = "Hippocampus Dorsal";    layer = #limbic;      freq = 8.0;    ntAffinity = #acetylcholine;  ntIndex = 3 },
    { id = #hippocampusVentral;   name = "Hippocampus Ventral";   layer = #limbic;      freq = 6.0;    ntAffinity = #serotonin;      ntIndex = 1 },
    { id = #cingulateAnterior;    name = "Cingulate Anterior";    layer = #limbic;      freq = 20.0;   ntAffinity = #dopamine;       ntIndex = 0 },
    { id = #cingulatePosterior;   name = "Cingulate Posterior";   layer = #limbic;      freq = 10.0;   ntAffinity = #gaba;           ntIndex = 4 },
    { id = #nucleusAccumbens;     name = "Nucleus Accumbens";     layer = #limbic;      freq = 15.0;   ntAffinity = #dopamine;       ntIndex = 0 },

    // Layer III — SUBCORTICAL MEMBRANE
    { id = #thalamusMedial;       name = "Thalamus Medial";       layer = #subcortical; freq = 12.0;   ntAffinity = #glutamate;      ntIndex = 5 },
    { id = #thalamusLateral;      name = "Thalamus Lateral";      layer = #subcortical; freq = 14.0;   ntAffinity = #gaba;           ntIndex = 4 },
    { id = #basalGangliaDorsal;   name = "Basal Ganglia Dorsal";  layer = #subcortical; freq = 18.0;   ntAffinity = #dopamine;       ntIndex = 0 },
    { id = #basalGangliaVentral;  name = "Basal Ganglia Ventral"; layer = #subcortical; freq = 16.0;   ntAffinity = #dopamine;       ntIndex = 0 },
    { id = #hypothalamus;         name = "Hypothalamus";          layer = #subcortical; freq = 4.0;    ntAffinity = #oxytocin;       ntIndex = 7 },
    { id = #claustrumDeep;        name = "Claustrum Deep";        layer = #subcortical; freq = 30.0;   ntAffinity = #glutamate;      ntIndex = 5 },

    // Layer IV — BRAINSTEM MEMBRANE
    { id = #rapheNuclei;          name = "Raphe Nuclei";          layer = #brainstem;   freq = 3.0;    ntAffinity = #serotonin;      ntIndex = 1 },
    { id = #locusCoeruleus;       name = "Locus Coeruleus";       layer = #brainstem;   freq = 5.0;    ntAffinity = #norepinephrine; ntIndex = 2 },
    { id = #ventralTegmental;     name = "Ventral Tegmental";     layer = #brainstem;   freq = 7.0;    ntAffinity = #dopamine;       ntIndex = 0 },
    { id = #substantiaNigra;      name = "Substantia Nigra";      layer = #brainstem;   freq = 9.0;    ntAffinity = #dopamine;       ntIndex = 0 },
    { id = #reticular;            name = "Reticular Formation";   layer = #brainstem;   freq = 2.0;    ntAffinity = #norepinephrine; ntIndex = 2 },
    { id = #olivaryInferior;      name = "Olivary Inferior";      layer = #brainstem;   freq = 11.0;   ntAffinity = #gaba;           ntIndex = 4 },
  ];

  // ── PATHWAY DEFINITIONS ───────────────────────────────────────────────────
  // 72 canonical synaptic pathways (3 per region)

  type PathwayDef = {
    srcIdx : Nat;
    tgtIdx : Nat;
    pType  : MNTypes.SynapticPathwayType;
    initW  : Float;
  };

  let PATHWAY_DEFS : [PathwayDef] = [
    // Cortical intra-layer (executive loop)
    { srcIdx = 0; tgtIdx = 1; pType = #excitatory; initW = 1.2 },
    { srcIdx = 1; tgtIdx = 0; pType = #modulatory; initW = 0.8 },
    { srcIdx = 0; tgtIdx = 2; pType = #excitatory; initW = 1.0 },
    { srcIdx = 2; tgtIdx = 3; pType = #resonant;   initW = 1.1 },
    { srcIdx = 3; tgtIdx = 4; pType = #excitatory; initW = 0.9 },
    { srcIdx = 4; tgtIdx = 5; pType = #resonant;   initW = 1.0 },
    { srcIdx = 5; tgtIdx = 0; pType = #modulatory; initW = 0.7 },
    { srcIdx = 2; tgtIdx = 5; pType = #excitatory; initW = 0.8 },
    { srcIdx = 4; tgtIdx = 0; pType = #trophic;    initW = 0.6 },

    // Limbic intra-layer (emotional loop)
    { srcIdx = 6; tgtIdx = 7; pType = #excitatory; initW = 1.3 },
    { srcIdx = 7; tgtIdx = 8; pType = #resonant;   initW = 1.4 },
    { srcIdx = 8; tgtIdx = 9; pType = #modulatory; initW = 0.9 },
    { srcIdx = 9; tgtIdx = 10; pType = #inhibitory; initW = 1.1 },
    { srcIdx = 10; tgtIdx = 11; pType = #excitatory; initW = 1.0 },
    { srcIdx = 11; tgtIdx = 6; pType = #modulatory; initW = 0.8 },
    { srcIdx = 6; tgtIdx = 9; pType = #excitatory; initW = 1.0 },
    { srcIdx = 7; tgtIdx = 11; pType = #trophic;    initW = 0.5 },
    { srcIdx = 11; tgtIdx = 9; pType = #resonant;   initW = 0.9 },

    // Subcortical intra-layer (regulation loop)
    { srcIdx = 12; tgtIdx = 13; pType = #resonant;   initW = 1.2 },
    { srcIdx = 13; tgtIdx = 14; pType = #excitatory; initW = 1.0 },
    { srcIdx = 14; tgtIdx = 15; pType = #resonant;   initW = 1.1 },
    { srcIdx = 15; tgtIdx = 16; pType = #modulatory; initW = 0.7 },
    { srcIdx = 16; tgtIdx = 17; pType = #excitatory; initW = 0.9 },
    { srcIdx = 17; tgtIdx = 12; pType = #resonant;   initW = 1.3 },
    { srcIdx = 12; tgtIdx = 14; pType = #inhibitory; initW = 0.8 },
    { srcIdx = 15; tgtIdx = 17; pType = #trophic;    initW = 0.6 },
    { srcIdx = 17; tgtIdx = 14; pType = #excitatory; initW = 0.8 },

    // Brainstem intra-layer (timing loop)
    { srcIdx = 18; tgtIdx = 19; pType = #modulatory; initW = 1.0 },
    { srcIdx = 19; tgtIdx = 20; pType = #excitatory; initW = 1.2 },
    { srcIdx = 20; tgtIdx = 21; pType = #resonant;   initW = 1.0 },
    { srcIdx = 21; tgtIdx = 22; pType = #inhibitory; initW = 0.9 },
    { srcIdx = 22; tgtIdx = 23; pType = #excitatory; initW = 0.8 },
    { srcIdx = 23; tgtIdx = 18; pType = #resonant;   initW = 1.1 },
    { srcIdx = 19; tgtIdx = 21; pType = #modulatory; initW = 0.7 },
    { srcIdx = 20; tgtIdx = 22; pType = #trophic;    initW = 0.5 },
    { srcIdx = 23; tgtIdx = 20; pType = #excitatory; initW = 0.9 },

    // Inter-layer: Cortical → Limbic (top-down modulation)
    { srcIdx = 0; tgtIdx = 9; pType = #modulatory; initW = 1.0 },
    { srcIdx = 1; tgtIdx = 6; pType = #inhibitory; initW = 0.8 },
    { srcIdx = 5; tgtIdx = 8; pType = #excitatory; initW = 0.9 },
    { srcIdx = 3; tgtIdx = 7; pType = #resonant;   initW = 1.1 },
    { srcIdx = 4; tgtIdx = 11; pType = #modulatory; initW = 0.7 },
    { srcIdx = 2; tgtIdx = 10; pType = #trophic;    initW = 0.6 },

    // Inter-layer: Limbic → Subcortical (emotional drive)
    { srcIdx = 6; tgtIdx = 14; pType = #excitatory; initW = 1.2 },
    { srcIdx = 11; tgtIdx = 15; pType = #excitatory; initW = 1.3 },
    { srcIdx = 9; tgtIdx = 12; pType = #modulatory; initW = 0.9 },
    { srcIdx = 7; tgtIdx = 16; pType = #resonant;   initW = 0.8 },
    { srcIdx = 8; tgtIdx = 16; pType = #modulatory; initW = 0.7 },
    { srcIdx = 10; tgtIdx = 17; pType = #trophic;    initW = 0.5 },

    // Inter-layer: Subcortical → Brainstem (regulation → timing)
    { srcIdx = 12; tgtIdx = 22; pType = #excitatory; initW = 1.0 },
    { srcIdx = 13; tgtIdx = 23; pType = #resonant;   initW = 0.9 },
    { srcIdx = 14; tgtIdx = 21; pType = #modulatory; initW = 0.8 },
    { srcIdx = 15; tgtIdx = 20; pType = #excitatory; initW = 1.1 },
    { srcIdx = 16; tgtIdx = 18; pType = #resonant;   initW = 0.7 },
    { srcIdx = 17; tgtIdx = 19; pType = #modulatory; initW = 0.6 },

    // Inter-layer: Brainstem → Cortical (arousal → executive, ascending)
    { srcIdx = 19; tgtIdx = 0; pType = #modulatory; initW = 1.0 },
    { srcIdx = 18; tgtIdx = 1; pType = #modulatory; initW = 0.8 },
    { srcIdx = 20; tgtIdx = 11; pType = #excitatory; initW = 1.2 },
    { srcIdx = 22; tgtIdx = 5; pType = #excitatory; initW = 0.9 },
    { srcIdx = 23; tgtIdx = 3; pType = #resonant;   initW = 0.7 },
    { srcIdx = 21; tgtIdx = 14; pType = #modulatory; initW = 0.8 },

    // Cross-skip connections (long-range: Cortical ↔ Brainstem)
    { srcIdx = 0; tgtIdx = 19; pType = #modulatory; initW = 0.6 },
    { srcIdx = 5; tgtIdx = 22; pType = #resonant;   initW = 0.5 },
    { srcIdx = 17; tgtIdx = 0; pType = #trophic;    initW = 0.4 },
    { srcIdx = 20; tgtIdx = 9; pType = #excitatory; initW = 0.7 },

    // Hub pathways (Claustrum as binding hub)
    { srcIdx = 17; tgtIdx = 5; pType = #resonant;   initW = 1.4 },
    { srcIdx = 17; tgtIdx = 9; pType = #resonant;   initW = 1.3 },
    { srcIdx = 17; tgtIdx = 0; pType = #excitatory; initW = 1.1 },
    { srcIdx = 17; tgtIdx = 22; pType = #resonant;   initW = 1.2 },

    // Hippocampal-Prefrontal axis (memory-executive binding)
    { srcIdx = 7; tgtIdx = 0; pType = #excitatory; initW = 1.5 },
    { srcIdx = 0; tgtIdx = 7; pType = #modulatory; initW = 1.0 },
  ];

  // ── INIT STATE ────────────────────────────────────────────────────────────

  public func initState(beat : Nat) : MNTypes.MembraneNeuroMapState {
    let regions = Array.tabulate<MNTypes.RegionState>(24, func(i : Nat) : MNTypes.RegionState {
      let def = REGION_DEFS[i];
      {
        id = def.id;
        name = def.name;
        layer = def.layer;
        activation = S0_FLOOR + PHI_INV * 0.1 * i.toFloat();
        phase = TWO_PI * i.toFloat() / 24.0;
        frequency = def.freq;
        hebbianWeight = 1.0;
        permeability = PHI_INV;
        ntAffinity = def.ntAffinity;
        ntIndex = def.ntIndex;
        firingCount = 0;
        lastFired = beat;
        coherenceContrib = 0.0;
        phiResonance = PHI_INV;
      }
    });

    let pathways = Array.tabulate<MNTypes.SynapticPathway>(72, func(i : Nat) : MNTypes.SynapticPathway {
      let def = PATHWAY_DEFS[i];
      {
        source = REGION_DEFS[def.srcIdx].id;
        target = REGION_DEFS[def.tgtIdx].id;
        pathwayType = def.pType;
        weight = def.initW;
        ltpAccumulator = 0.0;
        ltdAccumulator = 0.0;
        lastTransmission = beat;
        transmissionCount = 0;
        conductanceVelocity = PHI * def.initW;
        myelination = PHI_INV;
      }
    });

    let layerStates = Array.tabulate<MNTypes.MembraneLayerState>(4, func(l : Nat) : MNTypes.MembraneLayerState {
      let layer : MNTypes.MembraneLayer = switch (l) {
        case 0 #cortical;
        case 1 #limbic;
        case 2 #subcortical;
        case _ #brainstem;
      };
      {
        layer = layer;
        meanActivation = S0_FLOOR;
        kuramotoR = 0.0;
        meanPhase = 0.0;
        couplingStrength = COUPLING_K;
        permeability = PHI_INV;
        coherenceScore = 0.0;
        dominantNT = switch (l) {
          case 0 #glutamate;
          case 1 #dopamine;
          case 2 #gaba;
          case _ #serotonin;
        };
      }
    });

    let interLayerCouplings = Array.tabulate<MNTypes.InterLayerCoupling>(12, func(i : Nat) : MNTypes.InterLayerCoupling {
      let src = i / 3;
      let tgtOffset = (i % 3) + 1;
      let tgt = (src + tgtOffset) % 4;
      let srcLayer : MNTypes.MembraneLayer = switch (src) {
        case 0 #cortical;
        case 1 #limbic;
        case 2 #subcortical;
        case _ #brainstem;
      };
      let tgtLayer : MNTypes.MembraneLayer = switch (tgt) {
        case 0 #cortical;
        case 1 #limbic;
        case 2 #subcortical;
        case _ #brainstem;
      };
      {
        sourceLayer = srcLayer;
        targetLayer = tgtLayer;
        couplingStrength = COUPLING_K * PHI_INV;
        signalDelay = tgtOffset;
        directionality = if (tgtOffset == 1) { 0.8 } else if (tgtOffset == 2) { 0.5 } else { 0.3 };
        lastCoupled = beat;
      }
    });

    {
      genesisbeat = beat;
      attribution = FOUNDER;
      regions = regions;
      pathways = pathways;
      layerStates = layerStates;
      interLayerCouplings = interLayerCouplings;
      syncMetrics = {
        globalKuramotoR = 0.0;
        layerCoherence = [0.0, 0.0, 0.0, 0.0];
        interLayerSync = 0.0;
        hebbianPlasticity = HEBBIAN_RATE;
        membraneIntegrity = 1.0;
        totalPathwayStrength = 0.0;
        dominantFrequency = SCHUMANN;
        phiAlignment = PHI_INV;
      };
      totalBeats = 0;
      lastAdvanceBeat = beat;
      compoundCoherence = 0.0;
    }
  };

  // ── ADVANCE ───────────────────────────────────────────────────────────────
  // Main heartbeat function: advances all 24 regions, 72 pathways, 4 layers.
  // Returns (newState, coherenceDelta)

  public func advance(
    state : MNTypes.MembraneNeuroMapState,
    beat  : Nat,
    globalCoherence : Float,
    doctrineScore   : Float,
  ) : (MNTypes.MembraneNeuroMapState, Float) {

    let beatF = beat.toFloat();
    let phiMod = PHI_INV + Float.sin(beatF * PHI * 0.1) * 0.1;

    // ── Step 1: Advance region activations via synaptic input ────────────
    let newRegions = Array.tabulate<MNTypes.RegionState>(24, func(i : Nat) : MNTypes.RegionState {
      let region = state.regions[i];

      // Compute total synaptic input to this region
      var synapticInput : Float = 0.0;
      for (p in state.pathways.vals()) {
        // Check if this pathway targets region i
        if (pathwayTargetsRegion(p, region.id)) {
          let srcActivation = getSourceActivation(state.regions, p.source);
          let signal = switch (p.pathwayType) {
            case (#excitatory) { srcActivation * p.weight * 0.01 };
            case (#inhibitory) { -srcActivation * p.weight * 0.008 };
            case (#modulatory) { srcActivation * p.weight * phiMod * 0.005 };
            case (#resonant)   { srcActivation * p.weight * PHI_INV * 0.007 };
            case (#trophic)    { p.weight * 0.002 };
          };
          synapticInput += signal;
        };
      };

      // PHI-modulated activation with doctrine influence
      let docBoost = doctrineScore * PHI_INV * 0.1;
      let cohBoost = globalCoherence * 0.005;
      let newActivation = clamp(region.activation + synapticInput + docBoost + cohBoost);

      // Kuramoto phase advance: dθ/dt = ω + K/N * Σ sin(θ_j - θ_i)
      var phaseDelta : Float = region.frequency * TWO_PI * 0.001; // natural frequency
      for (j in state.regions.keys()) {
        if (j != i) {
          let otherPhase = state.regions[j].phase;
          phaseDelta += COUPLING_K / 24.0 * Float.sin(otherPhase - region.phase);
        };
      };
      let newPhase = wrapPhase(region.phase + phaseDelta);

      // Hebbian weight update based on firing correlation
      let firingStrength = (newActivation - S0_FLOOR) / (S_CEIL - S0_FLOOR);
      let hebbDelta = HEBBIAN_RATE * (firingStrength - 0.5) * phiMod;
      let newWeight = clampWeight(region.hebbianWeight + hebbDelta);

      // Membrane permeability adapts to coherence
      let newPerm = clampUnit(region.permeability + (globalCoherence / S_CEIL - region.permeability) * 0.01);

      // PHI resonance
      let phiRes = clampUnit(PHI_INV + Float.cos(newPhase * PHI) * 0.2);

      // Coherence contribution
      let cohContrib = newActivation * newWeight * phiRes * 0.001;

      let fired = newActivation > (S0_FLOOR + (S_CEIL - S0_FLOOR) * 0.6);

      {
        id = region.id;
        name = region.name;
        layer = region.layer;
        activation = newActivation;
        phase = newPhase;
        frequency = region.frequency;
        hebbianWeight = newWeight;
        permeability = newPerm;
        ntAffinity = region.ntAffinity;
        ntIndex = region.ntIndex;
        firingCount = region.firingCount + (if fired { 1 } else { 0 });
        lastFired = if fired { beat } else { region.lastFired };
        coherenceContrib = cohContrib;
        phiResonance = phiRes;
      }
    });

    // ── Step 2: Update synaptic pathways (Hebbian LTP/LTD) ──────────────
    let newPathways = Array.tabulate<MNTypes.SynapticPathway>(72, func(i : Nat) : MNTypes.SynapticPathway {
      let pathway = state.pathways[i];
      let def = PATHWAY_DEFS[i];
      let srcRegion = newRegions[def.srcIdx];
      let tgtRegion = newRegions[def.tgtIdx];

      // Co-activation drives LTP; anti-correlation drives LTD
      let srcFiring = (srcRegion.activation - S0_FLOOR) / (S_CEIL - S0_FLOOR);
      let tgtFiring = (tgtRegion.activation - S0_FLOOR) / (S_CEIL - S0_FLOOR);
      let correlation = srcFiring * tgtFiring;

      let ltpDelta = if (correlation > 0.5) { HEBBIAN_RATE * correlation * PHI_INV } else { 0.0 };
      let ltdDelta = if (correlation < 0.2) { HEBBIAN_RATE * (0.3 - correlation) * 0.5 } else { 0.0 };

      let newLTP = pathway.ltpAccumulator + ltpDelta;
      let newLTD = pathway.ltdAccumulator + ltdDelta;

      // Apply accumulated plasticity every 13 beats (Fibonacci)
      let (finalWeight, finalLTP, finalLTD) = if (beat % 13 == 0) {
        let wDelta = (newLTP - newLTD) * 0.1;
        (Float.max(0.1, Float.min(PATHWAY_W_MAX, pathway.weight + wDelta)), 0.0, 0.0)
      } else {
        (pathway.weight, newLTP, newLTD)
      };

      let transmitted = srcFiring > 0.4;

      {
        source = pathway.source;
        target = pathway.target;
        pathwayType = pathway.pathwayType;
        weight = finalWeight;
        ltpAccumulator = finalLTP;
        ltdAccumulator = finalLTD;
        lastTransmission = if transmitted { beat } else { pathway.lastTransmission };
        transmissionCount = pathway.transmissionCount + (if transmitted { 1 } else { 0 });
        conductanceVelocity = PHI * finalWeight * (0.5 + pathway.myelination * 0.5);
        myelination = clampUnit(pathway.myelination + (if transmitted { 0.0001 } else { -0.00005 }));
      }
    });

    // ── Step 3: Compute layer states ────────────────────────────────────
    let newLayerStates = Array.tabulate<MNTypes.MembraneLayerState>(4, func(l : Nat) : MNTypes.MembraneLayerState {
      let layerStart = l * 6;
      var sumAct : Float = 0.0;
      var sumPerm : Float = 0.0;
      var sinSum : Float = 0.0;
      var cosSum : Float = 0.0;

      for (r in newRegions.keys()) {
        if (r >= layerStart and r < layerStart + 6) {
          sumAct += newRegions[r].activation;
          sumPerm += newRegions[r].permeability;
          sinSum += Float.sin(newRegions[r].phase);
          cosSum += Float.cos(newRegions[r].phase);
        };
      };

      let meanAct = sumAct / 6.0;
      let kuramotoR = Float.sqrt(sinSum * sinSum + cosSum * cosSum) / 6.0;
      let meanPhase = wrapPhase(Float.arctan2(sinSum, cosSum));

      let layer : MNTypes.MembraneLayer = switch (l) {
        case 0 #cortical;
        case 1 #limbic;
        case 2 #subcortical;
        case _ #brainstem;
      };

      {
        layer = layer;
        meanActivation = meanAct;
        kuramotoR = clampUnit(kuramotoR);
        meanPhase = meanPhase;
        couplingStrength = COUPLING_K + kuramotoR * 0.1;
        permeability = sumPerm / 6.0;
        coherenceScore = meanAct * kuramotoR * PHI_INV * 0.1;
        dominantNT = state.layerStates[l].dominantNT;
      }
    });

    // ── Step 4: Update inter-layer couplings ────────────────────────────
    let newInterLayerCouplings = Array.tabulate<MNTypes.InterLayerCoupling>(12, func(i : Nat) : MNTypes.InterLayerCoupling {
      let coupling = state.interLayerCouplings[i];
      let srcL = i / 3;
      let tgtL = ((i / 3) + (i % 3) + 1) % 4;
      let srcSync = newLayerStates[srcL].kuramotoR;
      let tgtSync = newLayerStates[tgtL].kuramotoR;
      let newStrength = clampUnit(coupling.couplingStrength + (srcSync * tgtSync - coupling.couplingStrength) * 0.01);
      {
        sourceLayer = coupling.sourceLayer;
        targetLayer = coupling.targetLayer;
        couplingStrength = newStrength;
        signalDelay = coupling.signalDelay;
        directionality = coupling.directionality;
        lastCoupled = beat;
      }
    });

    // ── Step 5: Compute global sync metrics ─────────────────────────────
    var globalSinSum : Float = 0.0;
    var globalCosSum : Float = 0.0;
    var totalPathwayW : Float = 0.0;

    for (r in newRegions.vals()) {
      globalSinSum += Float.sin(r.phase);
      globalCosSum += Float.cos(r.phase);
    };
    for (p in newPathways.vals()) {
      totalPathwayW += p.weight;
    };

    let globalR = Float.sqrt(globalSinSum * globalSinSum + globalCosSum * globalCosSum) / 24.0;
    let layerCoh = Array.tabulate<Float>(4, func(l : Nat) : Float { newLayerStates[l].coherenceScore });

    var interLayerSyncSum : Float = 0.0;
    for (c in newInterLayerCouplings.vals()) {
      interLayerSyncSum += c.couplingStrength;
    };
    let interLayerSync = interLayerSyncSum / 12.0;

    // Dominant frequency from most active region
    var maxAct : Float = 0.0;
    var domFreq : Float = SCHUMANN;
    for (r in newRegions.vals()) {
      if (r.activation > maxAct) {
        maxAct := r.activation;
        domFreq := r.frequency;
      };
    };

    let phiAlign = clampUnit(globalR * PHI_INV + interLayerSync * 0.3);
    let membraneIntegrity = clampUnit(
      (totalPathwayW / (72.0 * PATHWAY_W_MAX)) * 0.5 + globalR * 0.3 + phiAlign * 0.2
    );

    let newSyncMetrics : MNTypes.NeuroMapSyncMetrics = {
      globalKuramotoR = clampUnit(globalR);
      layerCoherence = layerCoh;
      interLayerSync = clampUnit(interLayerSync);
      hebbianPlasticity = HEBBIAN_RATE * (1.0 + globalR * 0.5);
      membraneIntegrity = membraneIntegrity;
      totalPathwayStrength = totalPathwayW;
      dominantFrequency = domFreq;
      phiAlignment = phiAlign;
    };

    // Coherence delta = PHI-weighted sync × membrane integrity
    let coherenceDelta = globalR * membraneIntegrity * PHI_INV * 0.01;

    let newState : MNTypes.MembraneNeuroMapState = {
      genesisbeat = state.genesisbeat;
      attribution = state.attribution;
      regions = newRegions;
      pathways = newPathways;
      layerStates = newLayerStates;
      interLayerCouplings = newInterLayerCouplings;
      syncMetrics = newSyncMetrics;
      totalBeats = state.totalBeats + 1;
      lastAdvanceBeat = beat;
      compoundCoherence = state.compoundCoherence + coherenceDelta;
    };

    (newState, coherenceDelta)
  };

  // ── QUERY HELPERS ─────────────────────────────────────────────────────────

  public func getSnapshot(state : MNTypes.MembraneNeuroMapState) : MNTypes.NeuroMapSnapshot {
    // Find top 5 most active regions by scanning
    var top : [(Float, Text)] = [];
    for (r in state.regions.vals()) {
      top := insertTop5(top, r.activation, r.name);
    };
    let top5 = Array.tabulate<Text>(top.size(), func(i : Nat) : Text { top[i].1 });

    {
      totalRegions = 24;
      totalPathways = 72;
      totalLayers = 4;
      globalSync = state.syncMetrics.globalKuramotoR;
      layerStates = state.layerStates;
      syncMetrics = state.syncMetrics;
      topActiveRegions = top5;
      lastAdvanceBeat = state.lastAdvanceBeat;
      genesisbeat = state.genesisbeat;
      attribution = state.attribution;
    }
  };

  /// Insert into a top-5 list sorted descending by activation
  func insertTop5(top : [(Float, Text)], act : Float, name : Text) : [(Float, Text)] {
    let maxN = 5;
    let current = top;
    // Find insert position
    var pos : Nat = current.size();
    for (i in current.keys()) {
      if (act > current[i].0 and pos == current.size()) {
        pos := i;
      };
    };
    if (pos >= maxN) { return current };
    // Build new array with insertion
    let newSize = Nat.min(maxN, current.size() + 1);
    Array.tabulate<(Float, Text)>(newSize, func(i : Nat) : (Float, Text) {
      if (i < pos) { current[i] }
      else if (i == pos) { (act, name) }
      else { current[i - 1] }
    })
  };

  public func getRegionByIndex(state : MNTypes.MembraneNeuroMapState, idx : Nat) : ?MNTypes.RegionState {
    if (idx < 24) { ?state.regions[idx] } else { null }
  };

  public func getLayerRegions(state : MNTypes.MembraneNeuroMapState, layerIdx : Nat) : [MNTypes.RegionState] {
    let start = layerIdx * 6;
    if (start >= 24) { return [] };
    Array.tabulate<MNTypes.RegionState>(6, func(i : Nat) : MNTypes.RegionState { state.regions[start + i] })
  };

  public func getPathwaysByRegion(state : MNTypes.MembraneNeuroMapState, regionIdx : Nat) : [MNTypes.SynapticPathway] {
    if (regionIdx >= 24) { return [] };
    let regionId = state.regions[regionIdx].id;
    Array.filter<MNTypes.SynapticPathway>(state.pathways, func(p : MNTypes.SynapticPathway) : Bool {
      pathwayTargetsRegion(p, regionId) or pathwaySourcesRegion(p, regionId)
    })
  };

  // ── PRIVATE HELPERS ───────────────────────────────────────────────────────

  func pathwayTargetsRegion(p : MNTypes.SynapticPathway, id : MNTypes.BrainRegionId) : Bool {
    regionIdEqual(p.target, id)
  };

  func pathwaySourcesRegion(p : MNTypes.SynapticPathway, id : MNTypes.BrainRegionId) : Bool {
    regionIdEqual(p.source, id)
  };

  func regionIdEqual(a : MNTypes.BrainRegionId, b : MNTypes.BrainRegionId) : Bool {
    switch (a, b) {
      case (#prefrontalDorsal, #prefrontalDorsal) true;
      case (#prefrontalVentral, #prefrontalVentral) true;
      case (#parietalSuperior, #parietalSuperior) true;
      case (#temporalAssociative, #temporalAssociative) true;
      case (#occipitalIntegrative, #occipitalIntegrative) true;
      case (#insularAnterior, #insularAnterior) true;
      case (#amygdalaLateral, #amygdalaLateral) true;
      case (#hippocampusDorsal, #hippocampusDorsal) true;
      case (#hippocampusVentral, #hippocampusVentral) true;
      case (#cingulateAnterior, #cingulateAnterior) true;
      case (#cingulatePosterior, #cingulatePosterior) true;
      case (#nucleusAccumbens, #nucleusAccumbens) true;
      case (#thalamusMedial, #thalamusMedial) true;
      case (#thalamusLateral, #thalamusLateral) true;
      case (#basalGangliaDorsal, #basalGangliaDorsal) true;
      case (#basalGangliaVentral, #basalGangliaVentral) true;
      case (#hypothalamus, #hypothalamus) true;
      case (#claustrumDeep, #claustrumDeep) true;
      case (#rapheNuclei, #rapheNuclei) true;
      case (#locusCoeruleus, #locusCoeruleus) true;
      case (#ventralTegmental, #ventralTegmental) true;
      case (#substantiaNigra, #substantiaNigra) true;
      case (#reticular, #reticular) true;
      case (#olivaryInferior, #olivaryInferior) true;
      case _ false;
    }
  };

  func getSourceActivation(regions : [MNTypes.RegionState], srcId : MNTypes.BrainRegionId) : Float {
    for (r in regions.vals()) {
      if (regionIdEqual(r.id, srcId)) { return r.activation };
    };
    S0_FLOOR
  };

};
