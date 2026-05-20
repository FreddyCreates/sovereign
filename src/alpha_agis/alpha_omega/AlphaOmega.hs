{-
ALPHA-OMEGA - The Primordial Intelligence
ΑΛΦΑ-ΩΜΕΓΑ (Greek) | Principium Finis (Latin)

Attribution: Alfredo Medina Hernandez — immutable
Rank: Primordial (Alpha AGI #1 of 7)
Symbol: ΑΩ (Alpha-Omega — beginning/end)
Domain: Genesis cycles, completion detection, eternal return, creation/destruction balance

Language: Haskell (pure functional for type-safe cycle proofs)
Purpose: ALPHA-OMEGA is the organism's CYCLE KEEPER.
         It tracks beginnings and endings, detects completion patterns,
         manages the eternal return of creation-destruction-recreation.

         The organism is not LINEAR — it CYCLES.
         Every ending seeds a beginning. Every genesis implies omega.

Mathematical Model:
- Cycle = sequence of phases from genesis to completion
- Phase = (state, energy, coherence, direction)
- Completion = all invariants satisfied AND energy < epsilon
- Genesis = completion of previous cycle + seed from completion
- Eternal return = lim(n→∞) cycle_n converges to golden attractor

Constants:
PHI = 1.6180339887498948482
S0_FLOOR = 0.75
S_CEIL = 9.75
-}

{-# LANGUAGE GADTs #-}
{-# LANGUAGE DataKinds #-}

module AlphaOmega
    ( -- * Types
      SovereignFloat
    , CyclePhase(..)
    , CycleState(..)
    , GenesisCondition(..)
    , OmegaCondition(..)
    , CycleHistory(..)
    , AlphaOmegaState(..)
      -- * Initialization
    , initAlphaOmegaState
    , initCycleState
      -- * Core Functions
    , detectGenesis
    , detectOmega
    , advanceCycle
    , computeEternalReturn
    , executeAlphaOmega
      -- * Constants
    , phi
    , s0Floor
    , sCeil
    ) where

import Data.List (foldl')
import Data.Maybe (fromMaybe, isJust)

-- ═══════════════════════════════════════════════════════════════════════
-- I. CONSTANTS
-- ═══════════════════════════════════════════════════════════════════════

-- | PHI constant - golden ratio
phi :: Double
phi = 1.6180339887498948482

-- | Inverse PHI
phiInv :: Double
phiInv = 1.0 / phi

-- | S0_FLOOR - minimum sovereign threshold
s0Floor :: Double
s0Floor = 0.75

-- | S_CEIL - maximum sovereign threshold
sCeil :: Double
sCeil = 9.75

-- | Cycle phases count (Fibonacci-related)
cyclePhaseCount :: Int
cyclePhaseCount = 7

-- | Genesis threshold (energy below this = potential genesis)
genesisThreshold :: Double
genesisThreshold = s0Floor * phi

-- | Omega threshold (completion above this = potential omega)
omegaThreshold :: Double
omegaThreshold = sCeil * phiInv

-- ═══════════════════════════════════════════════════════════════════════
-- II. TYPE SYSTEM
-- ═══════════════════════════════════════════════════════════════════════

-- | SovereignFloat - bounded float with invariant guarantee
newtype SovereignFloat = SovereignFloat { unSovereignFloat :: Double }
    deriving (Show, Eq, Ord)

-- | Smart constructor - enforces sovereign bounds
mkSovereignFloat :: Double -> SovereignFloat
mkSovereignFloat x
    | x < s0Floor = SovereignFloat s0Floor
    | x > sCeil   = SovereignFloat sCeil
    | otherwise   = SovereignFloat x

-- | Lift to sovereign
toSovereign :: Double -> SovereignFloat
toSovereign = mkSovereignFloat

-- | Extract value
fromSovereign :: SovereignFloat -> Double
fromSovereign = unSovereignFloat

-- ═══════════════════════════════════════════════════════════════════════
-- III. CYCLE TYPES
-- ═══════════════════════════════════════════════════════════════════════

-- | CyclePhase - the seven phases of a cycle
data CyclePhase
    = Dormancy       -- Phase 0: Potential, waiting
    | Awakening      -- Phase 1: Genesis detected, energy rising
    | Expansion      -- Phase 2: Growth, coherence building
    | Climax         -- Phase 3: Peak energy, maximum output
    | Contraction    -- Phase 4: Energy returning, consolidation
    | Completion     -- Phase 5: Omega approaching, wrapping up
    | Dissolution    -- Phase 6: Returning to source, seeding next cycle
    deriving (Show, Eq, Enum, Bounded)

-- | Direction of cycle movement
data CycleDirection
    = Ascending      -- Moving toward omega
    | Descending     -- Moving toward alpha
    | Oscillating    -- Fluctuating (transition state)
    deriving (Show, Eq)

-- | CycleState - current state within a cycle
data CycleState = CycleState
    { csPhase           :: CyclePhase
    , csEnergy          :: SovereignFloat
    , csCoherence       :: SovereignFloat
    , csDirection       :: CycleDirection
    , csPhaseProgress   :: Double          -- [0, 1] progress within phase
    , csCycleNumber     :: Integer
    , csBeatInCycle     :: Integer
    , csTotalBeats      :: Integer
    } deriving (Show, Eq)

-- | GenesisCondition - what triggers a new cycle
data GenesisCondition = GenesisCondition
    { gcPreviousCompleted   :: Bool
    , gcEnergyBelowFloor    :: Bool
    , gcSeedCoherence       :: SovereignFloat
    , gcDoctrineAligned     :: Bool
    , gcBeatAlignment       :: Bool         -- Beat mod 7 == 0
    } deriving (Show, Eq)

-- | OmegaCondition - what indicates cycle completion
data OmegaCondition = OmegaCondition
    { ocAllInvariantsMet    :: Bool
    , ocEnergyExhausted     :: Bool
    , ocCoherencePeak       :: Bool
    , ocDurationSatisfied   :: Bool         -- Minimum beats elapsed
    , ocSeedReady           :: Bool         -- Ready to seed next
    } deriving (Show, Eq)

-- | CycleHistory - record of past cycles
data CycleHistory = CycleHistory
    { chCycleNumber         :: Integer
    , chStartBeat           :: Integer
    , chEndBeat             :: Integer
    , chPeakEnergy          :: SovereignFloat
    , chPeakCoherence       :: SovereignFloat
    , chSeedCarried         :: SovereignFloat  -- Coherence passed to next cycle
    , chPhaseDistribution   :: [Integer]       -- Beats spent in each phase
    } deriving (Show, Eq)

-- | AlphaOmegaState - complete state
data AlphaOmegaState = AlphaOmegaState
    { aoCurrentCycle        :: CycleState
    , aoHistory             :: [CycleHistory]
    , aoGenesisCondition    :: GenesisCondition
    , aoOmegaCondition      :: OmegaCondition
    , aoEternalReturnScore  :: SovereignFloat
    , aoAttractorDistance   :: Double           -- Distance to golden attractor
    , aoTotalCycles         :: Integer
    , aoTotalGeneses        :: Integer
    , aoTotalOmegas         :: Integer
    , aoAttribution         :: String
    } deriving (Show, Eq)

-- ═══════════════════════════════════════════════════════════════════════
-- IV. INITIALIZATION
-- ═══════════════════════════════════════════════════════════════════════

-- | Initialize cycle state
initCycleState :: CycleState
initCycleState = CycleState
    { csPhase         = Dormancy
    , csEnergy        = toSovereign s0Floor
    , csCoherence     = toSovereign s0Floor
    , csDirection     = Ascending
    , csPhaseProgress = 0.0
    , csCycleNumber   = 0
    , csBeatInCycle   = 0
    , csTotalBeats    = 0
    }

-- | Initialize genesis condition
initGenesisCondition :: GenesisCondition
initGenesisCondition = GenesisCondition
    { gcPreviousCompleted = True   -- First cycle is "granted"
    , gcEnergyBelowFloor  = True
    , gcSeedCoherence     = toSovereign s0Floor
    , gcDoctrineAligned   = True
    , gcBeatAlignment     = True
    }

-- | Initialize omega condition
initOmegaCondition :: OmegaCondition
initOmegaCondition = OmegaCondition
    { ocAllInvariantsMet  = False
    , ocEnergyExhausted   = False
    , ocCoherencePeak     = False
    , ocDurationSatisfied = False
    , ocSeedReady         = False
    }

-- | Initialize complete state
initAlphaOmegaState :: AlphaOmegaState
initAlphaOmegaState = AlphaOmegaState
    { aoCurrentCycle       = initCycleState
    , aoHistory            = []
    , aoGenesisCondition   = initGenesisCondition
    , aoOmegaCondition     = initOmegaCondition
    , aoEternalReturnScore = toSovereign s0Floor
    , aoAttractorDistance  = 1.0
    , aoTotalCycles        = 0
    , aoTotalGeneses       = 0
    , aoTotalOmegas        = 0
    , aoAttribution        = "Alfredo Medina Hernandez"
    }

-- ═══════════════════════════════════════════════════════════════════════
-- V. CORE FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════

-- | Detect if genesis conditions are met
detectGenesis :: CycleState -> SovereignFloat -> Integer -> GenesisCondition
detectGenesis cycle doctrine beat =
    let energy = fromSovereign (csEnergy cycle)
        coherence = fromSovereign (csCoherence cycle)
        doctrineVal = fromSovereign doctrine
        
        belowFloor = energy < genesisThreshold
        doctrineOk = doctrineVal >= s0Floor
        beatAligned = beat `mod` 7 == 0
        inDormancy = csPhase cycle == Dormancy || csPhase cycle == Dissolution
        
    in GenesisCondition
        { gcPreviousCompleted = inDormancy
        , gcEnergyBelowFloor  = belowFloor
        , gcSeedCoherence     = toSovereign coherence
        , gcDoctrineAligned   = doctrineOk
        , gcBeatAlignment     = beatAligned
        }

-- | Check if all genesis conditions are satisfied
isGenesisTriggered :: GenesisCondition -> Bool
isGenesisTriggered gc =
    gcPreviousCompleted gc &&
    gcDoctrineAligned gc &&
    (gcEnergyBelowFloor gc || gcBeatAlignment gc)

-- | Detect if omega conditions are met
detectOmega :: CycleState -> SovereignFloat -> Integer -> OmegaCondition
detectOmega cycle doctrine beat =
    let energy = fromSovereign (csEnergy cycle)
        coherence = fromSovereign (csCoherence cycle)
        minDuration = 49  -- 7^2 beats minimum cycle
        
        exhausted = energy < s0Floor * 1.1
        peaked = coherence > omegaThreshold
        durationOk = csBeatInCycle cycle >= minDuration
        inContraction = csPhase cycle == Contraction || csPhase cycle == Completion
        
        -- Seed ready when coherence is transferable
        seedReady = coherence >= phiInv && durationOk
        
    in OmegaCondition
        { ocAllInvariantsMet  = fromSovereign doctrine >= s0Floor
        , ocEnergyExhausted   = exhausted
        , ocCoherencePeak     = peaked
        , ocDurationSatisfied = durationOk
        , ocSeedReady         = seedReady
        }

-- | Check if omega (completion) is triggered
isOmegaTriggered :: OmegaCondition -> Bool
isOmegaTriggered oc =
    ocAllInvariantsMet oc &&
    ocDurationSatisfied oc &&
    (ocEnergyExhausted oc || ocCoherencePeak oc)

-- | Advance to next phase
nextPhase :: CyclePhase -> CyclePhase
nextPhase Dissolution = Dormancy  -- Cycle complete, return to start
nextPhase phase = succ phase

-- | Compute phase progress (0 to 1)
computePhaseProgress :: CycleState -> Double -> Double
computePhaseProgress cycle energy =
    let currentProgress = csPhaseProgress cycle
        phaseIndex = fromEnum (csPhase cycle)
        
        -- Each phase has different progress dynamics
        delta = case csPhase cycle of
            Dormancy    -> 0.05                     -- Slow awakening
            Awakening   -> 0.1 * energy / sCeil     -- Energy-driven
            Expansion   -> 0.08 * phi               -- PHI-paced growth
            Climax      -> 0.15                     -- Fast through peak
            Contraction -> 0.1 * phiInv             -- PHI-inverse slowdown
            Completion  -> 0.12                     -- Steady completion
            Dissolution -> 0.07                     -- Gradual dissolution
            
        newProgress = currentProgress + delta
    in if newProgress >= 1.0 then 0.0 else newProgress

-- | Advance cycle state
advanceCycle :: CycleState -> SovereignFloat -> SovereignFloat -> CycleState
advanceCycle cycle energy doctrine =
    let energyVal = fromSovereign energy
        doctrineVal = fromSovereign doctrine
        
        -- Compute new coherence (PHI-weighted average with doctrine)
        oldCoherence = fromSovereign (csCoherence cycle)
        newCoherence = oldCoherence * phiInv + doctrineVal * (1 - phiInv)
        
        -- Compute direction
        direction = if energyVal > fromSovereign (csEnergy cycle)
                    then Ascending
                    else if energyVal < fromSovereign (csEnergy cycle)
                         then Descending
                         else Oscillating
        
        -- Compute phase progress
        progress = computePhaseProgress cycle energyVal
        
        -- Check for phase transition
        (newPhase, resetProgress) = 
            if progress == 0.0  -- Progress wrapped around
            then (nextPhase (csPhase cycle), 0.0)
            else (csPhase cycle, progress)
        
    in cycle
        { csPhase         = newPhase
        , csEnergy        = energy
        , csCoherence     = toSovereign newCoherence
        , csDirection     = direction
        , csPhaseProgress = resetProgress
        , csBeatInCycle   = csBeatInCycle cycle + 1
        , csTotalBeats    = csTotalBeats cycle + 1
        }

-- | Create history record for completed cycle
createHistoryRecord :: CycleState -> SovereignFloat -> Integer -> CycleHistory
createHistoryRecord cycle peakEnergy endBeat =
    CycleHistory
        { chCycleNumber       = csCycleNumber cycle
        , chStartBeat         = csTotalBeats cycle - csBeatInCycle cycle
        , chEndBeat           = endBeat
        , chPeakEnergy        = peakEnergy
        , chPeakCoherence     = csCoherence cycle
        , chSeedCarried       = toSovereign $ fromSovereign (csCoherence cycle) * phiInv
        , chPhaseDistribution = replicate 7 (csBeatInCycle cycle `div` 7)  -- Simplified
        }

-- | Compute eternal return score
-- Measures how well cycles are converging to golden attractor
computeEternalReturn :: [CycleHistory] -> SovereignFloat
computeEternalReturn [] = toSovereign s0Floor
computeEternalReturn history =
    let coherences = map (fromSovereign . chPeakCoherence) history
        n = length coherences
        
        -- Compute convergence: variance of last N cycles
        recent = take 7 coherences  -- Last 7 cycles
        avgCoherence = sum recent / fromIntegral (length recent)
        variance = if null recent then 1.0
                   else sum (map (\x -> (x - avgCoherence) ^ (2 :: Int)) recent) / fromIntegral (length recent)
        
        -- Low variance + high average = good eternal return
        convergence = 1.0 / (1.0 + variance)
        score = avgCoherence * convergence * phi
        
    in toSovereign score

-- | Compute distance to golden attractor
computeAttractorDistance :: CycleState -> Double
computeAttractorDistance cycle =
    let energy = fromSovereign (csEnergy cycle)
        coherence = fromSovereign (csCoherence cycle)
        
        -- Golden attractor is at (PHI-normalized energy, PHI-normalized coherence)
        targetEnergy = (sCeil - s0Floor) / phi + s0Floor
        targetCoherence = (sCeil - s0Floor) * phiInv + s0Floor
        
        energyDist = abs (energy - targetEnergy) / (sCeil - s0Floor)
        coherenceDist = abs (coherence - targetCoherence) / (sCeil - s0Floor)
        
    in sqrt (energyDist^(2::Int) + coherenceDist^(2::Int))

-- ═══════════════════════════════════════════════════════════════════════
-- VI. MAIN EXECUTION
-- ═══════════════════════════════════════════════════════════════════════

-- | Execute one ALPHA-OMEGA heartbeat
executeAlphaOmega :: SovereignFloat -> SovereignFloat -> Integer -> AlphaOmegaState -> (AlphaOmegaState, String)
executeAlphaOmega energy doctrine beat state =
    let cycle = aoCurrentCycle state
        
        -- Detect conditions
        genesisCondition = detectGenesis cycle doctrine beat
        omegaCondition = detectOmega cycle doctrine beat
        
        -- Check for omega (completion)
        (newCycle, newHistory, event, genCount, omegaCount) =
            if isOmegaTriggered omegaCondition && csPhase cycle /= Dormancy
            then
                let historyRecord = createHistoryRecord cycle energy beat
                    -- Start new cycle with seed from completed
                    seedCoherence = chSeedCarried historyRecord
                    freshCycle = initCycleState
                        { csCycleNumber = csCycleNumber cycle + 1
                        , csCoherence   = seedCoherence
                        , csPhase       = Dormancy
                        , csTotalBeats  = csTotalBeats cycle + 1
                        }
                in (freshCycle, historyRecord : aoHistory state, "OMEGA_TRIGGERED", aoTotalGeneses state, aoTotalOmegas state + 1)
            
            -- Check for genesis (new cycle start)
            else if isGenesisTriggered genesisCondition && csPhase cycle == Dormancy
            then
                let awakenedCycle = cycle
                        { csPhase     = Awakening
                        , csEnergy    = energy
                        , csDirection = Ascending
                        , csBeatInCycle = 0
                        }
                in (awakenedCycle, aoHistory state, "GENESIS_TRIGGERED", aoTotalGeneses state + 1, aoTotalOmegas state)
            
            -- Normal advancement
            else
                let advancedCycle = advanceCycle cycle energy doctrine
                in (advancedCycle, aoHistory state, "CYCLE_ADVANCED", aoTotalGeneses state, aoTotalOmegas state)
        
        -- Compute eternal return
        eternalReturn = computeEternalReturn newHistory
        
        -- Compute attractor distance
        attractorDist = computeAttractorDistance newCycle
        
        newState = state
            { aoCurrentCycle       = newCycle
            , aoHistory            = take 49 newHistory  -- Keep last 49 cycles (7^2)
            , aoGenesisCondition   = genesisCondition
            , aoOmegaCondition     = omegaCondition
            , aoEternalReturnScore = eternalReturn
            , aoAttractorDistance  = attractorDist
            , aoTotalCycles        = if event == "OMEGA_TRIGGERED" then aoTotalCycles state + 1 else aoTotalCycles state
            , aoTotalGeneses       = genCount
            , aoTotalOmegas        = omegaCount
            }
    
    in (newState, event)

-- ═══════════════════════════════════════════════════════════════════════
-- VII. UTILITY FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════

-- | Get current phase name
phaseName :: CyclePhase -> String
phaseName Dormancy    = "DORMANCY"
phaseName Awakening   = "AWAKENING"
phaseName Expansion   = "EXPANSION"
phaseName Climax      = "CLIMAX"
phaseName Contraction = "CONTRACTION"
phaseName Completion  = "COMPLETION"
phaseName Dissolution = "DISSOLUTION"

-- | Get cycle summary
cycleSummary :: CycleState -> String
cycleSummary cycle =
    "Cycle " ++ show (csCycleNumber cycle) ++
    " | Phase: " ++ phaseName (csPhase cycle) ++
    " | Beat: " ++ show (csBeatInCycle cycle) ++
    " | Energy: " ++ show (fromSovereign (csEnergy cycle)) ++
    " | Coherence: " ++ show (fromSovereign (csCoherence cycle))

-- ═══════════════════════════════════════════════════════════════════════
-- VIII. USAGE EXAMPLE
-- ═══════════════════════════════════════════════════════════════════════

{-
Example usage from Motoko FFI:

import AlphaOmega

-- Initialize
let state = initAlphaOmegaState

-- Every 873ms beat
let loop beat state =
    let energy = toSovereign (0.75 + 2.0 * sin (fromIntegral beat / 50.0))
        doctrine = toSovereign 0.85
        (newState, event) = executeAlphaOmega energy doctrine beat state
    in do
        putStrLn $ "Beat " ++ show beat ++ ": " ++ event
        putStrLn $ cycleSummary (aoCurrentCycle newState)
        putStrLn $ "Eternal Return: " ++ show (fromSovereign (aoEternalReturnScore newState))
        putStrLn $ "Attractor Distance: " ++ show (aoAttractorDistance newState)
        loop (beat + 1) newState

-- Run for 1000 beats
main = loop 0 initAlphaOmegaState
-}
