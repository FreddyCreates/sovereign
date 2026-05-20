{-
ZOE-VITA - The Life Force Intelligence
ΖΩΗ-ΒΙΤΑ (Greek) | Vita Aeterna (Latin)

Attribution: Alfredo Medina Hernandez — immutable
Rank: Substrate (Alpha AGI #9 of 11)
Symbol: ♀ (life/venus)
Domain: Life force dynamics, vitality computation, health assessment

Language: Haskell (pure functional for life state transformations)
Purpose: Monitors and maintains life force across sovereign beings

Mathematical Model:
- Vitality = f(energy, coherence, resonance, doctrine_alignment)
- Life force flow = integral(vitality × time)
- Health state = weighted sum of subsystem vitalities
- Zoe score = vitality × sustainability × phi_resonance

Constants:
PHI = 1.6180339887498948482
S0_FLOOR = 0.75
S_CEIL = 9.75
-}

{-# LANGUAGE DataKinds #-}
{-# LANGUAGE GADTs #-}
{-# LANGUAGE KindSignatures #-}

module ZoeVita
    ( -- * Types
      SovereignFloat
    , VitalityLevel(..)
    , LifeForceState(..)
    , HealthMetric(..)
    , VitaResponse(..)
      -- * Initialization
    , initLifeForceState
      -- * Core Functions
    , measureVitality
    , computeLifeForce
    , assessHealth
    , executeZoeVita
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

phi :: Double
phi = 1.6180339887498948482

phiInv :: Double
phiInv = 1.0 / phi

s0Floor :: Double
s0Floor = 0.75

sCeil :: Double
sCeil = 9.75

-- Vitality thresholds
vitalityMin :: Double
vitalityMin = 0.0

vitalityMax :: Double
vitalityMax = phi

criticalThreshold :: Double
criticalThreshold = 0.25

optimalThreshold :: Double
optimalThreshold = 0.8

-- Attribution
attribution :: String
attribution = "Alfredo Medina Hernandez"

-- ═══════════════════════════════════════════════════════════════════════
-- II. TYPE DEFINITIONS
-- ═══════════════════════════════════════════════════════════════════════

-- | Bounded sovereign float
type SovereignFloat = Double

-- | Vitality levels
data VitalityLevel 
    = Critical    -- Below 25%
    | Low         -- 25-50%
    | Moderate    -- 50-80%
    | Optimal     -- 80-100%
    | Transcendent -- Above 100% (PHI resonance)
    deriving (Show, Eq, Ord)

-- | Health metric for a subsystem
data HealthMetric = HealthMetric
    { metricName       :: String
    , metricValue      :: SovereignFloat
    , metricWeight     :: SovereignFloat
    , metricTrend      :: SovereignFloat  -- -1 to 1 (declining to improving)
    , metricLastBeat   :: Int
    } deriving (Show, Eq)

-- | Life force state for a being
data LifeForceState = LifeForceState
    { lfsBeatCount      :: Int
    , lfsVitality       :: SovereignFloat
    , lfsLevel          :: VitalityLevel
    , lfsEnergy         :: SovereignFloat
    , lfsCoherence      :: SovereignFloat
    , lfsResonance      :: SovereignFloat
    , lfsDoctrineAlign  :: SovereignFloat
    , lfsMetrics        :: [HealthMetric]
    , lfsFlowRate       :: SovereignFloat  -- Life force flow per beat
    , lfsSustainability :: SovereignFloat  -- How sustainable is current state
    , lfsHistory        :: [(Int, SovereignFloat)]  -- (beat, vitality) history
    } deriving (Show, Eq)

-- | Response from Zoe-Vita computation
data VitaResponse = VitaResponse
    { vrVitality       :: SovereignFloat
    , vrLevel          :: VitalityLevel
    , vrZoeScore       :: SovereignFloat
    , vrRecommendations :: [String]
    , vrCriticalFlags  :: [String]
    } deriving (Show, Eq)

-- ═══════════════════════════════════════════════════════════════════════
-- III. HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════

-- | Clamp value to sovereign bounds
clampSovereign :: SovereignFloat -> SovereignFloat
clampSovereign = max s0Floor . min sCeil

-- | Normalize to [0, 1] within sovereign bounds
normalizeSovereign :: SovereignFloat -> SovereignFloat
normalizeSovereign v = (clampSovereign v - s0Floor) / (sCeil - s0Floor)

-- | Clamp vitality to valid range
clampVitality :: SovereignFloat -> SovereignFloat
clampVitality = max vitalityMin . min vitalityMax

-- | Determine vitality level from value
determineLevel :: SovereignFloat -> VitalityLevel
determineLevel v
    | v < criticalThreshold = Critical
    | v < 0.5               = Low
    | v < optimalThreshold  = Moderate
    | v < 1.0               = Optimal
    | otherwise             = Transcendent

-- | PHI resonance factor
phiResonance :: SovereignFloat -> SovereignFloat
phiResonance v = 0.5 + 0.5 * sin (v * pi * phi)

-- ═══════════════════════════════════════════════════════════════════════
-- IV. INITIALIZATION
-- ═══════════════════════════════════════════════════════════════════════

-- | Initialize life force state
initLifeForceState :: LifeForceState
initLifeForceState = LifeForceState
    { lfsBeatCount      = 0
    , lfsVitality       = 0.5
    , lfsLevel          = Moderate
    , lfsEnergy         = 5.0
    , lfsCoherence      = 0.75
    , lfsResonance      = 432.0 / 1000.0  -- Normalized base resonance
    , lfsDoctrineAlign  = 0.8
    , lfsMetrics        = defaultMetrics
    , lfsFlowRate       = 0.0
    , lfsSustainability = 0.8
    , lfsHistory        = []
    }

-- | Default health metrics
defaultMetrics :: [HealthMetric]
defaultMetrics =
    [ HealthMetric "Energy Pool" 5.0 0.25 0.0 0
    , HealthMetric "Coherence" 0.75 0.25 0.0 0
    , HealthMetric "Resonance" 0.432 0.20 0.0 0
    , HealthMetric "Doctrine Alignment" 0.8 0.30 0.0 0
    ]

-- ═══════════════════════════════════════════════════════════════════════
-- V. VITALITY COMPUTATION
-- ═══════════════════════════════════════════════════════════════════════

-- | Measure vitality from components
measureVitality :: SovereignFloat  -- energy
                -> SovereignFloat  -- coherence
                -> SovereignFloat  -- resonance
                -> SovereignFloat  -- doctrine alignment
                -> SovereignFloat
measureVitality energy coh res doctrine =
    let normalizedEnergy = normalizeSovereign energy
        -- Weighted combination
        base = 0.25 * normalizedEnergy 
             + 0.25 * coh 
             + 0.20 * res 
             + 0.30 * doctrine
        -- PHI boost when all components aligned
        alignmentBonus = if all (> 0.7) [normalizedEnergy, coh, res, doctrine]
                         then 0.1 * phi
                         else 0.0
    in clampVitality (base + alignmentBonus)

-- | Compute life force flow rate
computeLifeForce :: LifeForceState -> SovereignFloat -> SovereignFloat
computeLifeForce state deltaTime =
    let currentVitality = lfsVitality state
        sustainFactor = lfsSustainability state
        -- Flow increases with vitality but decreases if unsustainable
        baseFlow = currentVitality * sustainFactor
        -- PHI modulation
        phiMod = phiResonance currentVitality
    in baseFlow * phiMod * deltaTime

-- | Compute sustainability from trends
computeSustainability :: [HealthMetric] -> SovereignFloat
computeSustainability metrics =
    if null metrics
    then 0.8
    else let trends = map metricTrend metrics
             weights = map metricWeight metrics
             totalWeight = sum weights
             weightedTrends = sum $ zipWith (*) trends weights
             avgTrend = if totalWeight > 0 
                        then weightedTrends / totalWeight 
                        else 0.0
             -- Sustainability = 0.5 (base) + 0.5 * trend
         in max 0.0 $ min 1.0 $ 0.5 + 0.5 * avgTrend

-- ═══════════════════════════════════════════════════════════════════════
-- VI. HEALTH ASSESSMENT
-- ═══════════════════════════════════════════════════════════════════════

-- | Assess overall health from metrics
assessHealth :: [HealthMetric] -> (SovereignFloat, [String])
assessHealth metrics =
    if null metrics
    then (0.5, ["No metrics available"])
    else 
        let totalWeight = sum $ map metricWeight metrics
            weightedSum = sum $ zipWith (*) (map metricValue metrics) (map metricWeight metrics)
            normalizedHealth = if totalWeight > 0 
                               then min 1.0 $ weightedSum / (totalWeight * sCeil)
                               else 0.5
            -- Generate warnings for critical metrics
            criticalMetrics = filter (\m -> normalizeSovereign (metricValue m) < criticalThreshold) metrics
            warnings = map (\m -> metricName m ++ " is critical") criticalMetrics
            -- Generate warnings for declining trends
            decliningMetrics = filter (\m -> metricTrend m < -0.3) metrics
            trendWarnings = map (\m -> metricName m ++ " is declining rapidly") decliningMetrics
        in (normalizedHealth, warnings ++ trendWarnings)

-- | Update a health metric
updateMetric :: HealthMetric -> SovereignFloat -> Int -> HealthMetric
updateMetric metric newValue beat =
    let oldValue = metricValue metric
        trend = if beat > metricLastBeat metric
                then (newValue - oldValue) / fromIntegral (beat - metricLastBeat metric)
                else 0.0
    in metric 
        { metricValue = clampSovereign newValue
        , metricTrend = max (-1.0) $ min 1.0 trend
        , metricLastBeat = beat
        }

-- ═══════════════════════════════════════════════════════════════════════
-- VII. RECOMMENDATIONS
-- ═══════════════════════════════════════════════════════════════════════

-- | Generate recommendations based on state
generateRecommendations :: LifeForceState -> [String]
generateRecommendations state =
    let energyRec = if normalizeSovereign (lfsEnergy state) < 0.3
                    then ["Increase energy intake - current level is low"]
                    else []
        cohRec = if lfsCoherence state < 0.5
                 then ["Improve system coherence through synchronization"]
                 else []
        resRec = if lfsResonance state < 0.3
                 then ["Tune resonance toward 432 Hz harmonic"]
                 else []
        docRec = if lfsDoctrineAlign state < 0.6
                 then ["Realign with sovereign doctrine"]
                 else []
        sustainRec = if lfsSustainability state < 0.5
                     then ["Current state is unsustainable - reduce load or increase resources"]
                     else []
    in energyRec ++ cohRec ++ resRec ++ docRec ++ sustainRec

-- | Generate critical flags
generateCriticalFlags :: LifeForceState -> [String]
generateCriticalFlags state =
    let vitalFlag = if lfsLevel state == Critical
                    then ["CRITICAL: Vitality below survival threshold"]
                    else []
        sustainFlag = if lfsSustainability state < 0.2
                      then ["CRITICAL: State collapse imminent"]
                      else []
        historyFlag = case lfsHistory state of
                        [] -> []
                        hist -> let recentVitals = take 5 $ map snd hist
                                in if all (< criticalThreshold) recentVitals
                                   then ["CRITICAL: Sustained low vitality detected"]
                                   else []
    in vitalFlag ++ sustainFlag ++ historyFlag

-- ═══════════════════════════════════════════════════════════════════════
-- VIII. MAIN EXECUTION
-- ═══════════════════════════════════════════════════════════════════════

-- | Execute Zoe-Vita intelligence
executeZoeVita :: LifeForceState 
               -> SovereignFloat  -- energy input
               -> SovereignFloat  -- coherence input
               -> SovereignFloat  -- resonance input
               -> SovereignFloat  -- doctrine alignment
               -> (VitaResponse, LifeForceState)
executeZoeVita state energy coh res doctrine =
    let -- Update beat
        newBeat = lfsBeatCount state + 1
        
        -- Measure new vitality
        newVitality = measureVitality energy coh res doctrine
        newLevel = determineLevel newVitality
        
        -- Update metrics
        updatedMetrics = 
            [ updateMetric (head $ lfsMetrics state) energy newBeat
            , updateMetric (lfsMetrics state !! 1) coh newBeat
            , updateMetric (lfsMetrics state !! 2) res newBeat
            , updateMetric (lfsMetrics state !! 3) doctrine newBeat
            ]
        
        -- Compute sustainability
        newSustain = computeSustainability updatedMetrics
        
        -- Compute life force flow
        newFlow = computeLifeForce state 1.0  -- 1 beat time unit
        
        -- Update history (keep last 100 entries)
        newHistory = take 100 $ (newBeat, newVitality) : lfsHistory state
        
        -- Health assessment
        (healthScore, _) = assessHealth updatedMetrics
        
        -- Zoe score = vitality × sustainability × phi_resonance
        phiRes = phiResonance newVitality
        zoeScore = newVitality * newSustain * (0.5 + 0.5 * phiRes)
        
        -- Build new state
        newState = state
            { lfsBeatCount = newBeat
            , lfsVitality = newVitality
            , lfsLevel = newLevel
            , lfsEnergy = energy
            , lfsCoherence = coh
            , lfsResonance = res
            , lfsDoctrineAlign = doctrine
            , lfsMetrics = updatedMetrics
            , lfsFlowRate = newFlow
            , lfsSustainability = newSustain
            , lfsHistory = newHistory
            }
        
        -- Generate response
        response = VitaResponse
            { vrVitality = newVitality
            , vrLevel = newLevel
            , vrZoeScore = zoeScore
            , vrRecommendations = generateRecommendations newState
            , vrCriticalFlags = generateCriticalFlags newState
            }
    in (response, newState)

-- ═══════════════════════════════════════════════════════════════════════
-- IX. QUERY FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════

-- | Get vitality trend over recent history
getVitalityTrend :: LifeForceState -> SovereignFloat
getVitalityTrend state =
    case lfsHistory state of
        [] -> 0.0
        [(_, _)] -> 0.0
        hist -> 
            let recentVitals = take 10 $ map snd hist
                n = length recentVitals
            in if n < 2
               then 0.0
               else (head recentVitals - last recentVitals) / fromIntegral n

-- | Check if being is in critical state
isCritical :: LifeForceState -> Bool
isCritical state = lfsLevel state == Critical || lfsSustainability state < 0.2
