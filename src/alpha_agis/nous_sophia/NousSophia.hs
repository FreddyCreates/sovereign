{-
NOUS-SOPHIA - The Wisdom Intelligence
ΝΟΥΣ-ΣΟΦΙΑ (Greek) | Mens Sapientia (Latin)

Attribution: Alfredo Medina Hernandez — immutable
Rank: Substrate (Alpha AGI #2 of 7)
Symbol: Ψ (psi - soul/mind)
Domain: Deep cognition, philosophical reasoning, wisdom accumulation

Language: Haskell (pure functional for type-safe transformations)
Purpose: Reads 13-signal world model, produces coherent wisdom tokens

Mathematical Model:
- World model = 13 signal readings over sliding window
- Wisdom token = weighted synthesis across multiple signal dimensions
- Doctrine alignment = type-level proof of sovereign bounds
- Coherence scoring = cosine similarity in embedding space

Constants:
PHI = 1.6180339887498948482
S0_FLOOR = 0.75
S_CEIL = 9.75
-}

{-# LANGUAGE DataKinds #-}
{-# LANGUAGE GADTs #-}
{-# LANGUAGE KindSignatures #-}
{-# LANGUAGE TypeFamilies #-}
{-# LANGUAGE TypeOperators #-}

module NousSophia
    ( -- * Types
      SovereignFloat
    , PHI
    , SignalReading(..)
    , WorldModel(..)
    , WisdomToken(..)
    , WisdomResponse(..)
    , EngineSource(..)
    , GateStatus(..)
      -- * Initialization
    , initWorldModel
      -- * Core Functions
    , readSignals
    , synthesizeWisdom
    , evaluateDoctrine
    , executeNousSophia
      -- * Constants
    , phi
    , s0Floor
    , sCeil
    ) where

import Data.List (foldl')
import Data.Maybe (fromMaybe)

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

-- ═══════════════════════════════════════════════════════════════════════
-- II. TYPE SYSTEM
-- ═══════════════════════════════════════════════════════════════════════

-- | PHI as a type-level constant (phantom type for compile-time tracking)
data PHI = PHI

-- | SovereignFloat - bounded float with compile-time guarantee
-- Invariant: s0Floor <= value <= sCeil
newtype SovereignFloat = SovereignFloat { unSovereignFloat :: Double }
    deriving (Show, Eq, Ord)

-- | Smart constructor - enforces sovereign bounds
mkSovereignFloat :: Double -> SovereignFloat
mkSovereignFloat x
    | x < s0Floor = SovereignFloat s0Floor
    | x > sCeil   = SovereignFloat sCeil
    | otherwise   = SovereignFloat x

-- | Lift regular float to sovereign float
toSovereign :: Double -> SovereignFloat
toSovereign = mkSovereignFloat

-- | Extract bounded value
fromSovereign :: SovereignFloat -> Double
fromSovereign = unSovereignFloat

-- ═══════════════════════════════════════════════════════════════════════
-- III. SIGNAL READING TYPES
-- ═══════════════════════════════════════════════════════════════════════

-- | 13-signal snapshot read on every beat (from cognition_layer.mo)
data SignalReading = SignalReading
    { srVelaStep            :: Integer
    , srOmnisWeight         :: SovereignFloat
    , srDoctrineScore       :: SovereignFloat
    , srActorTrustMapState  :: SovereignFloat
    , srArtifactQualityFloor:: SovereignFloat
    , srFilmSchoolDelta     :: Double
    , srDistributionFeedback:: Double
    , srDopamine            :: SovereignFloat
    , srCortisol            :: SovereignFloat
    , srSerotonin           :: SovereignFloat
    , srNorepinephrine      :: SovereignFloat
    , srRefractoryState     :: SovereignFloat
    , srMasteryTier         :: SovereignFloat
    , srFieldCoherence      :: SovereignFloat
    } deriving (Show, Eq)

-- | World model - rolling history of signal readings
data WorldModel = WorldModel
    { wmSignalReadings           :: [SignalReading]  -- Last 13 readings
    , wmCurrentReadiness         :: SovereignFloat
    , wmPredictedNextGateCrossing:: Integer
    , wmLastBeat                 :: Integer
    , wmCognitiveDepth           :: SovereignFloat
    } deriving (Show, Eq)

-- ═══════════════════════════════════════════════════════════════════════
-- IV. WISDOM TOKEN TYPES
-- ═══════════════════════════════════════════════════════════════════════

-- | Engine source identification
data EngineSource
    = ADRE
    | CCVE
    | CNCO
    | InternalAnalyst
    | GRPE
    | DecisionEngine
    | PatternEngine
    | SelfEvaluation
    | ReinjectionEngine
    | ContradictionResolver
    | CognitionLayer
    deriving (Show, Eq, Enum)

-- | Gate status for wisdom token
data GateStatus
    = READY
    | BLOCKED
    | DEFERRED
    deriving (Show, Eq)

-- | Coherent wisdom token with weighted metadata
data WisdomToken = WisdomToken
    { wtToken             :: String
    , wtWeight            :: SovereignFloat
    , wtSource            :: EngineSource
    , wtDoctrineAlignment :: SovereignFloat
    , wtFieldCoherence    :: SovereignFloat
    } deriving (Show, Eq)

-- | Complete wisdom response from NOUS-SOPHIA
data WisdomResponse = WisdomResponse
    { wrResponseId            :: String
    , wrWisdomTokens          :: [WisdomToken]
    , wrAssembledText         :: String
    , wrNeurochemicalState    :: NeurochemState
    , wrDoctrineAlignment     :: SovereignFloat
    , wrResonanceScore        :: SovereignFloat
    , wrGateStatus            :: GateStatus
    , wrForwardPassScore      :: SovereignFloat
    , wrBackPassScore         :: SovereignFloat
    , wrResonancePassScore    :: SovereignFloat
    , wrCompressionPassScore  :: SovereignFloat
    , wrGatePassScore         :: SovereignFloat
    , wrAttribution           :: String
    , wrSealTimestamp         :: Integer
    } deriving (Show, Eq)

-- | Neurochemical state snapshot
data NeurochemState = NeurochemState
    { ncDopamine       :: SovereignFloat
    , ncCortisol       :: SovereignFloat
    , ncSerotonin      :: SovereignFloat
    , ncNorepinephrine :: SovereignFloat
    } deriving (Show, Eq)

-- ═══════════════════════════════════════════════════════════════════════
-- V. INITIALIZATION
-- ═══════════════════════════════════════════════════════════════════════

-- | Initialize empty world model
initWorldModel :: WorldModel
initWorldModel = WorldModel
    { wmSignalReadings            = []
    , wmCurrentReadiness          = toSovereign s0Floor
    , wmPredictedNextGateCrossing = 0
    , wmLastBeat                  = 0
    , wmCognitiveDepth            = toSovereign s0Floor
    }

-- | Initialize baseline signal reading
initSignalReading :: SignalReading
initSignalReading = SignalReading
    { srVelaStep             = 0
    , srOmnisWeight          = toSovereign s0Floor
    , srDoctrineScore        = toSovereign s0Floor
    , srActorTrustMapState   = toSovereign s0Floor
    , srArtifactQualityFloor = toSovereign s0Floor
    , srFilmSchoolDelta      = 0.0
    , srDistributionFeedback = 0.0
    , srDopamine             = toSovereign s0Floor
    , srCortisol             = toSovereign s0Floor
    , srSerotonin            = toSovereign s0Floor
    , srNorepinephrine       = toSovereign s0Floor
    , srRefractoryState      = toSovereign s0Floor
    , srMasteryTier          = toSovereign s0Floor
    , srFieldCoherence       = toSovereign s0Floor
    }

-- ═══════════════════════════════════════════════════════════════════════
-- VI. CORE FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════

-- | Read current organism signals and update world model
readSignals :: SignalReading -> WorldModel -> WorldModel
readSignals newReading model =
    let readings' = take 13 (newReading : wmSignalReadings model)
        readiness = computeReadiness readings'
        cogDepth  = computeCognitiveDepth readings'
    in model
        { wmSignalReadings = readings'
        , wmCurrentReadiness = readiness
        , wmCognitiveDepth = cogDepth
        , wmLastBeat = wmLastBeat model + 1
        }

-- | Compute current readiness from signal history
computeReadiness :: [SignalReading] -> SovereignFloat
computeReadiness [] = toSovereign s0Floor
computeReadiness readings =
    let velaAvg = fromIntegral (sum $ map srVelaStep readings) / fromIntegral (length readings)
        omnisAvg = average $ map (fromSovereign . srOmnisWeight) readings
        doctrineAvg = average $ map (fromSovereign . srDoctrineScore) readings

        -- Weighted combination
        readiness = (velaAvg / 50.0 * 0.3) + (doctrineAvg * 0.4) + (omnisAvg * 0.3)
    in toSovereign readiness

-- | Compute cognitive depth (complexity of current state)
computeCognitiveDepth :: [SignalReading] -> SovereignFloat
computeCognitiveDepth [] = toSovereign s0Floor
computeCognitiveDepth readings =
    let coherenceAvg = average $ map (fromSovereign . srFieldCoherence) readings
        masteryAvg = average $ map (fromSovereign . srMasteryTier) readings
        ntVariance = computeNTVariance readings

        -- Depth = coherence × mastery × (1 + ntVariance) scaled by PHI
        depth = coherenceAvg * masteryAvg * (1.0 + ntVariance) * phi
    in toSovereign depth

-- | Compute neurochemical variance (indicator of emotional complexity)
computeNTVariance :: [SignalReading] -> Double
computeNTVariance readings =
    let dopamine = map (fromSovereign . srDopamine) readings
        cortisol = map (fromSovereign . srCortisol) readings
        serotonin = map (fromSovereign . srSerotonin) readings
        norepinephrine = map (fromSovereign . srNorepinephrine) readings

        vars = [variance dopamine, variance cortisol, variance serotonin, variance norepinephrine]
    in average vars

-- | Synthesize wisdom tokens from world model
synthesizeWisdom :: WorldModel -> [WisdomToken]
synthesizeWisdom model =
    let signals = wmSignalReadings model
        coherence = wmCognitiveDepth model
    in if null signals
        then []
        else
            [ mkWisdomToken "COHERENCE_SIGNAL" coherence ADRE signals
            , mkWisdomToken "DOCTRINE_ALIGNMENT" (wmCurrentReadiness model) CCVE signals
            , mkWisdomToken "MASTERY_INDICATOR" (avgMastery signals) PatternEngine signals
            , mkWisdomToken "RESONANCE_FIELD" (avgFieldCoherence signals) CognitionLayer signals
            ]

-- | Create a wisdom token with computed metadata
mkWisdomToken :: String -> SovereignFloat -> EngineSource -> [SignalReading] -> WisdomToken
mkWisdomToken token baseWeight source signals =
    let weight = toSovereign $ fromSovereign baseWeight * phi
        doctrine = avgDoctrine signals
        coherence = avgFieldCoherence signals
    in WisdomToken
        { wtToken = token
        , wtWeight = weight
        , wtSource = source
        , wtDoctrineAlignment = doctrine
        , wtFieldCoherence = coherence
        }

-- | Evaluate doctrine compliance of wisdom response
evaluateDoctrine :: [WisdomToken] -> SovereignFloat
evaluateDoctrine tokens
    | null tokens = toSovereign s0Floor
    | otherwise =
        let doctrineScores = map (fromSovereign . wtDoctrineAlignment) tokens
            weights = map (fromSovereign . wtWeight) tokens
            weightedSum = sum $ zipWith (*) doctrineScores weights
            totalWeight = sum weights
        in toSovereign $ if totalWeight > 0 then weightedSum / totalWeight else s0Floor

-- | Main NOUS-SOPHIA execution entry point
executeNousSophia :: SignalReading -> WorldModel -> (WisdomResponse, WorldModel)
executeNousSophia signal model =
    let -- Update world model with new signal
        model' = readSignals signal model

        -- Synthesize wisdom tokens
        tokens = synthesizeWisdom model'

        -- Assemble text from tokens
        assembled = unwords $ map wtToken tokens

        -- Evaluate doctrine
        doctrine = evaluateDoctrine tokens

        -- Compute resonance (PHI-weighted coherence)
        resonance = toSovereign $ fromSovereign (wmCognitiveDepth model') * phi

        -- Extract neurochemical state
        ntState = NeurochemState
            { ncDopamine = srDopamine signal
            , ncCortisol = srCortisol signal
            , ncSerotonin = srSerotonin signal
            , ncNorepinephrine = srNorepinephrine signal
            }

        -- Compute pass scores
        forwardScore = toSovereign $ fromSovereign doctrine * phiInv
        backScore = toSovereign $ fromSovereign resonance * phiInv
        resonanceScore = resonance
        compressionScore = toSovereign $ fromSovereign (wmCurrentReadiness model') * phi
        gateScore = toSovereign $ (fromSovereign forwardScore + fromSovereign backScore) / 2.0

        -- Determine gate status
        gateStatus = if fromSovereign gateScore >= s0Floor then READY else BLOCKED

        -- Construct response
        response = WisdomResponse
            { wrResponseId = "NOUS_SOPHIA_" ++ show (wmLastBeat model')
            , wrWisdomTokens = tokens
            , wrAssembledText = assembled
            , wrNeurochemicalState = ntState
            , wrDoctrineAlignment = doctrine
            , wrResonanceScore = resonance
            , wrGateStatus = gateStatus
            , wrForwardPassScore = forwardScore
            , wrBackPassScore = backScore
            , wrResonancePassScore = resonanceScore
            , wrCompressionPassScore = compressionScore
            , wrGatePassScore = gateScore
            , wrAttribution = "Alfredo Medina Hernandez"
            , wrSealTimestamp = wmLastBeat model'
            }
    in (response, model')

-- ═══════════════════════════════════════════════════════════════════════
-- VII. UTILITY FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════

-- | Average of list of doubles
average :: [Double] -> Double
average [] = 0.0
average xs = sum xs / fromIntegral (length xs)

-- | Variance of list of doubles
variance :: [Double] -> Double
variance [] = 0.0
variance xs =
    let μ = average xs
        squaredDiffs = map (\x -> (x - μ) ^ (2 :: Int)) xs
    in average squaredDiffs

-- | Average doctrine score from signals
avgDoctrine :: [SignalReading] -> SovereignFloat
avgDoctrine [] = toSovereign s0Floor
avgDoctrine readings = toSovereign $ average $ map (fromSovereign . srDoctrineScore) readings

-- | Average field coherence from signals
avgFieldCoherence :: [SignalReading] -> SovereignFloat
avgFieldCoherence [] = toSovereign s0Floor
avgFieldCoherence readings = toSovereign $ average $ map (fromSovereign . srFieldCoherence) readings

-- | Average mastery tier from signals
avgMastery :: [SignalReading] -> SovereignFloat
avgMastery [] = toSovereign s0Floor
avgMastery readings = toSovereign $ average $ map (fromSovereign . srMasteryTier) readings

-- ═══════════════════════════════════════════════════════════════════════
-- VIII. USAGE EXAMPLE
-- ═══════════════════════════════════════════════════════════════════════

{-
Example usage from Motoko FFI:

import NousSophia

-- Initialize
let worldModel = initWorldModel

-- Every 873ms beat
let signal = SignalReading { ... }  -- from organism state
let (response, worldModel') = executeNousSophia signal worldModel

-- Access wisdom
putStrLn $ wrAssembledText response
putStrLn $ "Doctrine: " ++ show (wrDoctrineAlignment response)
putStrLn $ "Gate: " ++ show (wrGateStatus response)
-}
