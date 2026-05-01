{-
TECHNE-POIESIS - The Creative Intelligence
ΤΕΧΝΗ-ΠΟΙΗΣΙΣ (Greek) | Ars Creatrix (Latin)

Attribution: Alfredo Medina Hernandez — immutable
Rank: Engine (Alpha AGI #4 of 7)
Symbol: ∇ (Nabla — gradient/creation)
Domain: Artifact quality evaluation, creative emergence detection,
        6D quality matrix computation, artifact-to-doctrine alignment

Language: Haskell (pure functional for composable quality proofs)
Purpose: Evaluates all creative output through 6 quality dimensions,
         detects emergent creative patterns, seals mastery artifacts

Mathematical Model:
- Quality = 6D vector: [Doctrine, Technical, Emotional, Structural, Novel, PHI-Alignment]
- Mastery threshold = all 6 dimensions >= PHI^(-1) simultaneously
- Creative emergence = quality gradient exceeds PHI per beat
- Seal = immutable quality proof attached to artifact forever

Constants:
PHI = 1.6180339887498948482
S0_FLOOR = 0.75
S_CEIL = 9.75
-}

{-# LANGUAGE GADTs #-}

module TechnePoiesis
    ( -- * Types
      SovereignFloat
    , QualityVector(..)
    , QualitySeal(..)
    , SealGrade(..)
    , ArtifactEvaluation(..)
    , CreativeState(..)
      -- * Initialization
    , initCreativeState
      -- * Core Functions
    , evaluateArtifact
    , computeQualityVector
    , detectEmergence
    , sealArtifact
    , executeTechnePoiesis
      -- * Constants
    , phi
    , s0Floor
    , sCeil
    ) where

import Data.List (foldl')

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

-- Mastery threshold: all 6 dimensions must exceed this
masteryThreshold :: Double
masteryThreshold = phiInv  -- ≈ 0.618

-- Emergence detection: quality gradient must exceed this per beat
emergenceThreshold :: Double
emergenceThreshold = phi * 0.01  -- ≈ 0.01618

-- ═══════════════════════════════════════════════════════════════════════
-- II. TYPE SYSTEM
-- ═══════════════════════════════════════════════════════════════════════

newtype SovereignFloat = SovereignFloat { unSovereignFloat :: Double }
    deriving (Show, Eq, Ord)

mkSovereignFloat :: Double -> SovereignFloat
mkSovereignFloat x
    | x < s0Floor = SovereignFloat s0Floor
    | x > sCeil   = SovereignFloat sCeil
    | otherwise   = SovereignFloat x

toSovereign :: Double -> SovereignFloat
toSovereign = mkSovereignFloat

fromSovereign :: SovereignFloat -> Double
fromSovereign = unSovereignFloat

-- | 6D Quality Vector — the complete quality space for any artifact
-- Each dimension is [0.0, 1.0] representing that quality aspect.
data QualityVector = QualityVector
    { qvDoctrine       :: Double    -- Doctrine alignment score
    , qvTechnical      :: Double    -- Technical execution quality
    , qvEmotional      :: Double    -- Emotional resonance
    , qvStructural     :: Double    -- Structural coherence
    , qvNovelty        :: Double    -- Creative novelty / originality
    , qvPhiAlignment   :: Double    -- PHI-ratio conformance in proportions
    } deriving (Show, Eq)

-- | Seal grades — immutable quality proof
data SealGrade
    = Mastery     -- All 6D >= PHI^(-1), gold seal
    | Broadcast   -- 5+ dimensions pass, silver seal
    | Review      -- 3+ dimensions pass, amber seal
    | Rework      -- <3 dimensions pass, red seal
    deriving (Show, Eq, Ord)

-- | QualitySeal — immutable proof of quality, attached to artifact forever
data QualitySeal = QualitySeal
    { qsGrade          :: SealGrade
    , qsVector         :: QualityVector
    , qsMagnitude      :: SovereignFloat   -- 6D magnitude
    , qsSealBeat       :: Integer
    , qsAttribution    :: String           -- Always "Alfredo Medina Hernandez"
    , qsImmutable      :: Bool             -- Always True — seals never change
    } deriving (Show, Eq)

-- | ArtifactEvaluation — complete evaluation of a creative artifact
data ArtifactEvaluation = ArtifactEvaluation
    { aeArtifactId     :: String
    , aeSeal           :: QualitySeal
    , aeEmergenceScore :: Double           -- How much this artifact pushes boundaries
    , aeDoctrineGate   :: Bool             -- Passed doctrine verification
    , aeDimensionsPassed :: Int            -- How many of 6D passed threshold
    } deriving (Show, Eq)

-- | CreativeState — organism-level creative intelligence state
data CreativeState = CreativeState
    { csArtifactsEvaluated   :: Integer
    , csMasteryCount         :: Integer     -- Total mastery seals issued
    , csBroadcastCount       :: Integer
    , csReviewCount          :: Integer
    , csReworkCount          :: Integer
    , csAverageQuality       :: SovereignFloat
    , csEmergenceHistory     :: [Double]     -- Last N emergence scores
    , csCreativeGradient     :: Double       -- Rate of quality improvement
    , csLastBeat             :: Integer
    } deriving (Show, Eq)

-- ═══════════════════════════════════════════════════════════════════════
-- III. INITIALIZATION
-- ═══════════════════════════════════════════════════════════════════════

initCreativeState :: CreativeState
initCreativeState = CreativeState
    { csArtifactsEvaluated = 0
    , csMasteryCount = 0
    , csBroadcastCount = 0
    , csReviewCount = 0
    , csReworkCount = 0
    , csAverageQuality = toSovereign s0Floor
    , csEmergenceHistory = []
    , csCreativeGradient = 0.0
    , csLastBeat = 0
    }

-- ═══════════════════════════════════════════════════════════════════════
-- IV. QUALITY COMPUTATION
-- ═══════════════════════════════════════════════════════════════════════

-- | Compute 6D quality vector from raw artifact signals
-- Each dimension is independently evaluated [0.0, 1.0]
computeQualityVector :: Double  -- ^ Doctrine alignment [0, 1]
                     -> Double  -- ^ Technical score [0, 1]
                     -> Double  -- ^ Emotional resonance [0, 1]
                     -> Double  -- ^ Structural coherence [0, 1]
                     -> Double  -- ^ Novelty score [0, 1]
                     -> Double  -- ^ PHI ratio conformance [0, 1]
                     -> QualityVector
computeQualityVector d t e s n p = QualityVector
    { qvDoctrine     = clampUnit d
    , qvTechnical    = clampUnit t
    , qvEmotional    = clampUnit e
    , qvStructural   = clampUnit s
    , qvNovelty      = clampUnit n
    , qvPhiAlignment = clampUnit p
    }
  where
    clampUnit x = max 0.0 (min 1.0 x)

-- | Compute 6D magnitude (Euclidean norm / sqrt(6) for normalization)
compute6DMagnitude :: QualityVector -> SovereignFloat
compute6DMagnitude qv =
    let dims = [qvDoctrine qv, qvTechnical qv, qvEmotional qv,
                qvStructural qv, qvNovelty qv, qvPhiAlignment qv]
        sumSq = sum $ map (** 2) dims
        magnitude = sqrt sumSq / sqrt 6.0  -- Normalize to [0, 1]
    in toSovereign (magnitude * sCeil)

-- | Count how many dimensions pass the mastery threshold
countPassedDimensions :: QualityVector -> Int
countPassedDimensions qv =
    length $ filter (>= masteryThreshold)
        [qvDoctrine qv, qvTechnical qv, qvEmotional qv,
         qvStructural qv, qvNovelty qv, qvPhiAlignment qv]

-- | Determine seal grade from quality vector
determineSealGrade :: QualityVector -> SealGrade
determineSealGrade qv =
    let passed = countPassedDimensions qv
    in case () of
        _ | passed == 6 -> Mastery
          | passed >= 5 -> Broadcast
          | passed >= 3 -> Review
          | otherwise   -> Rework

-- ═══════════════════════════════════════════════════════════════════════
-- V. ARTIFACT EVALUATION
-- ═══════════════════════════════════════════════════════════════════════

-- | Evaluate a creative artifact through the 6D quality lens
evaluateArtifact :: String          -- ^ Artifact ID
                 -> QualityVector   -- ^ Quality measurements
                 -> Integer         -- ^ Current beat
                 -> ArtifactEvaluation
evaluateArtifact artifactId qv beat =
    let grade = determineSealGrade qv
        magnitude = compute6DMagnitude qv
        passed = countPassedDimensions qv
        doctrineGate = qvDoctrine qv >= s0Floor
        emergence = computeArtifactEmergence qv
        seal = QualitySeal
            { qsGrade = grade
            , qsVector = qv
            , qsMagnitude = magnitude
            , qsSealBeat = beat
            , qsAttribution = "Alfredo Medina Hernandez"
            , qsImmutable = True
            }
    in ArtifactEvaluation
        { aeArtifactId = artifactId
        , aeSeal = seal
        , aeEmergenceScore = emergence
        , aeDoctrineGate = doctrineGate
        , aeDimensionsPassed = passed
        }

-- | Compute emergence score for an artifact
-- Emergence = how far above the mastery threshold the weakest dimension is
-- Higher emergence = more creative breakthrough
computeArtifactEmergence :: QualityVector -> Double
computeArtifactEmergence qv =
    let dims = [qvDoctrine qv, qvTechnical qv, qvEmotional qv,
                qvStructural qv, qvNovelty qv, qvPhiAlignment qv]
        minDim = minimum dims
    in max 0.0 (minDim - masteryThreshold) * phi

-- ═══════════════════════════════════════════════════════════════════════
-- VI. EMERGENCE DETECTION
-- ═══════════════════════════════════════════════════════════════════════

-- | Detect creative emergence — is the organism's creative quality accelerating?
-- Emergence = creative gradient > threshold
-- This detects when the organism is in a creative breakthrough state.
detectEmergence :: CreativeState -> Bool
detectEmergence cs = csCreativeGradient cs > emergenceThreshold

-- | Compute creative gradient from emergence history
computeCreativeGradient :: [Double] -> Double
computeCreativeGradient [] = 0.0
computeCreativeGradient [_] = 0.0
computeCreativeGradient history =
    let n = length history
        recent = take (min 10 n) history
        older = drop (min 10 n) (take (min 20 n) history)
        avgRecent = if null recent then 0.0 else sum recent / fromIntegral (length recent)
        avgOlder = if null older then avgRecent else sum older / fromIntegral (length older)
    in avgRecent - avgOlder

-- ═══════════════════════════════════════════════════════════════════════
-- VII. SEAL OPERATIONS
-- ═══════════════════════════════════════════════════════════════════════

-- | Seal an artifact — once sealed, the quality proof is immutable
-- This is the Genesis act for artifact quality.
sealArtifact :: ArtifactEvaluation -> QualitySeal
sealArtifact eval = aeSeal eval

-- ═══════════════════════════════════════════════════════════════════════
-- VIII. MAIN EXECUTION
-- ═══════════════════════════════════════════════════════════════════════

-- | Main TECHNE-POIESIS execution
-- Evaluates an artifact, updates creative state, detects emergence
executeTechnePoiesis :: String          -- ^ Artifact ID
                     -> QualityVector   -- ^ Quality measurements
                     -> Integer         -- ^ Current beat
                     -> CreativeState   -- ^ Current state
                     -> (ArtifactEvaluation, CreativeState)
executeTechnePoiesis artifactId qv beat state =
    let -- 1. Evaluate the artifact
        eval = evaluateArtifact artifactId qv beat

        -- 2. Update counts
        (mC, bC, rvC, rwC) = case qsGrade (aeSeal eval) of
            Mastery   -> (csMasteryCount state + 1, csBroadcastCount state,
                         csReviewCount state, csReworkCount state)
            Broadcast -> (csMasteryCount state, csBroadcastCount state + 1,
                         csReviewCount state, csReworkCount state)
            Review    -> (csMasteryCount state, csBroadcastCount state,
                         csReviewCount state + 1, csReworkCount state)
            Rework    -> (csMasteryCount state, csBroadcastCount state,
                         csReviewCount state, csReworkCount state + 1)

        -- 3. Update average quality (running average)
        totalEvaluated = csArtifactsEvaluated state + 1
        oldAvg = fromSovereign (csAverageQuality state)
        newMag = fromSovereign (qsMagnitude (aeSeal eval))
        newAvg = oldAvg + (newMag - oldAvg) / fromIntegral totalEvaluated

        -- 4. Update emergence history
        newHistory = aeEmergenceScore eval : take 49 (csEmergenceHistory state)
        gradient = computeCreativeGradient newHistory

        -- 5. Build new state
        newState = CreativeState
            { csArtifactsEvaluated = totalEvaluated
            , csMasteryCount = mC
            , csBroadcastCount = bC
            , csReviewCount = rvC
            , csReworkCount = rwC
            , csAverageQuality = toSovereign newAvg
            , csEmergenceHistory = newHistory
            , csCreativeGradient = gradient
            , csLastBeat = beat
            }

    in (eval, newState)

-- ═══════════════════════════════════════════════════════════════════════
-- IX. USAGE EXAMPLE
-- ═══════════════════════════════════════════════════════════════════════

{-
Example usage from Motoko FFI:

import TechnePoiesis

-- Initialize
let state = initCreativeState

-- Evaluate an artifact
let qv = computeQualityVector 0.85 0.90 0.75 0.88 0.70 0.82
let (eval, state') = executeTechnePoiesis "ARTIFACT_001" qv 100 state

-- Check seal
putStrLn $ "Grade: " ++ show (qsGrade $ aeSeal eval)
putStrLn $ "Magnitude: " ++ show (qsMagnitude $ aeSeal eval)
putStrLn $ "Emergence: " ++ show (aeEmergenceScore eval)
putStrLn $ "Is Emerging: " ++ show (detectEmergence state')
-}
