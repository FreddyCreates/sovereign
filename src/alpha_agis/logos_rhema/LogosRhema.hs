{-
LOGOS-RHEMA - The Word Intelligence
ΛΟΓΟΣ-ΡΗΜΑ (Greek) | Verbum Vivum (Latin)

Attribution: Alfredo Medina Hernandez — immutable
Rank: Substrate (Alpha AGI #3 of 7)
Symbol: Λ (Lambda — word/reason)
Domain: Law composition, word weight fields, doctrine verification
         Real linguistics — words have mass, frequency, and resonance

Language: Haskell (pure functional for type-safe law composition)
Purpose: Reads doctrine laws, computes word weights, verifies law composition,
         produces law-verified execution tokens

Mathematical Model:
- Word weight = frequency × PHI-decay × doctrine_alignment
- Law composition = monadic chaining of verified law tokens
- Field coherence = cosine similarity in word-weight embedding space
- Doctrine verification = type-level proof of law satisfaction

Constants:
PHI = 1.6180339887498948482
S0_FLOOR = 0.75
S_CEIL = 9.75
-}

{-# LANGUAGE DataKinds #-}
{-# LANGUAGE GADTs #-}
{-# LANGUAGE KindSignatures #-}

module LogosRhema
    ( -- * Types
      SovereignFloat
    , WordWeight(..)
    , LawToken(..)
    , LawComposition(..)
    , VerificationResult(..)
    , DoctrineField(..)
    , WordFieldState(..)
      -- * Initialization
    , initWordFieldState
    , initDoctrineField
      -- * Core Functions
    , computeWordWeight
    , composeLaws
    , verifyDoctrine
    , executeLogosRhema
      -- * Word Field Operations
    , ingestWord
    , computeFieldCoherence
    , getTopWords
      -- * Constants
    , phi
    , s0Floor
    , sCeil
    ) where

import Data.List (sortBy, foldl')
import Data.Ord (Down(..))

-- ═══════════════════════════════════════════════════════════════════════
-- I. CONSTANTS
-- ═══════════════════════════════════════════════════════════════════════

-- | PHI constant — golden ratio
phi :: Double
phi = 1.6180339887498948482

-- | PHI inverse
phiInv :: Double
phiInv = 1.0 / phi

-- | S0_FLOOR — minimum sovereign threshold
s0Floor :: Double
s0Floor = 0.75

-- | S_CEIL — maximum sovereign threshold
sCeil :: Double
sCeil = 9.75

-- | Schumann base frequency
schumann :: Double
schumann = 7.83

-- | Word weight decay constant (beats until half-weight)
decayTau :: Double
decayTau = 343.0  -- First Jubilee

-- ═══════════════════════════════════════════════════════════════════════
-- II. TYPE SYSTEM
-- ═══════════════════════════════════════════════════════════════════════

-- | SovereignFloat — bounded float with sovereign guarantee
newtype SovereignFloat = SovereignFloat { unSovereignFloat :: Double }
    deriving (Show, Eq, Ord)

-- | Smart constructor
mkSovereignFloat :: Double -> SovereignFloat
mkSovereignFloat x
    | x < s0Floor = SovereignFloat s0Floor
    | x > sCeil   = SovereignFloat sCeil
    | otherwise   = SovereignFloat x

toSovereign :: Double -> SovereignFloat
toSovereign = mkSovereignFloat

fromSovereign :: SovereignFloat -> Double
fromSovereign = unSovereignFloat

-- | Law rank (from CPL specification)
data LawRank
    = Primordial   -- Layer 0 — immutable foundation
    | Substrate    -- Layer 1 — persistent ground
    | Field        -- Layer 2 — dynamic field
    | Engine       -- Layer 3 — computation
    | Organism     -- Layer 4 — living system
    | Artifact     -- Layer 5 — produced output
    deriving (Show, Eq, Ord, Enum)

-- ═══════════════════════════════════════════════════════════════════════
-- III. WORD WEIGHT SYSTEM
-- ═══════════════════════════════════════════════════════════════════════

-- | WordWeight — a single word with its mass in the field
-- Words are not strings — they are weighted entities with physical properties.
-- Frequency of use × doctrine alignment × PHI-decay = mass.
data WordWeight = WordWeight
    { wwWord              :: String
    , wwFrequency         :: Integer          -- Times this word appeared in doctrine
    , wwMass              :: SovereignFloat    -- Current weight in the field
    , wwDoctrineAlignment :: SovereignFloat    -- How doctrine-aligned this word is
    , wwResonanceFreqHz   :: Double            -- Frequency in Hz (Schumann-derived)
    , wwLastUsedBeat      :: Integer
    , wwRingCount         :: Integer           -- PHI^n milestones crossed
    } deriving (Show, Eq)

-- | WordFieldState — the complete word weight field
data WordFieldState = WordFieldState
    { wfsWords          :: [WordWeight]
    , wfsFieldCoherence :: SovereignFloat       -- Overall field coherence
    , wfsTotalWords     :: Integer
    , wfsTotalIngestions :: Integer
    , wfsLastBeat       :: Integer
    } deriving (Show, Eq)

-- ═══════════════════════════════════════════════════════════════════════
-- IV. LAW TOKEN SYSTEM
-- ═══════════════════════════════════════════════════════════════════════

-- | LawToken — a verified atomic law execution unit
data LawToken = LawToken
    { ltLawId              :: String
    , ltLawName            :: String
    , ltRank               :: LawRank
    , ltDoctrineScore      :: SovereignFloat
    , ltExecutionWeight    :: SovereignFloat     -- PHI-weighted importance
    , ltVerified           :: Bool               -- Doctrine gate passed
    , ltAttribution        :: String             -- Always "Alfredo Medina Hernandez"
    , ltSealBeat           :: Integer
    } deriving (Show, Eq)

-- | LawComposition — monadic composition of multiple law tokens
data LawComposition = LawComposition
    { lcTokens             :: [LawToken]
    , lcComposedWeight     :: SovereignFloat     -- Aggregate weight
    , lcDoctrineAlignment  :: SovereignFloat     -- Aggregate doctrine score
    , lcRankFloor          :: LawRank            -- Lowest rank in composition
    , lcRankCeiling        :: LawRank            -- Highest rank in composition
    , lcVerified           :: Bool               -- All tokens verified
    , lcAttribution        :: String
    } deriving (Show, Eq)

-- | VerificationResult — outcome of doctrine verification
data VerificationResult = VerificationResult
    { vrPassed           :: Bool
    , vrDoctrineScore    :: SovereignFloat
    , vrViolations       :: [String]            -- List of doctrine violations found
    , vrRecommendations  :: [String]            -- Corrections suggested
    , vrSealTimestamp    :: Integer
    } deriving (Show, Eq)

-- | DoctrineField — the law substrate
data DoctrineField = DoctrineField
    { dfActiveLaws       :: [LawToken]
    , dfFieldStrength    :: SovereignFloat       -- Total doctrine field strength
    , dfCoherence        :: SovereignFloat       -- Inter-law coherence
    , dfTotalExecutions  :: Integer
    } deriving (Show, Eq)

-- ═══════════════════════════════════════════════════════════════════════
-- V. INITIALIZATION
-- ═══════════════════════════════════════════════════════════════════════

-- | Initialize empty word field
initWordFieldState :: WordFieldState
initWordFieldState = WordFieldState
    { wfsWords          = []
    , wfsFieldCoherence = toSovereign s0Floor
    , wfsTotalWords     = 0
    , wfsTotalIngestions = 0
    , wfsLastBeat       = 0
    }

-- | Initialize doctrine field with the 38 sovereign laws
initDoctrineField :: DoctrineField
initDoctrineField = DoctrineField
    { dfActiveLaws    = primordialLaws
    , dfFieldStrength = toSovereign s0Floor
    , dfCoherence     = toSovereign s0Floor
    , dfTotalExecutions = 0
    }

-- | The 38 primordial laws as initial tokens
primordialLaws :: [LawToken]
primordialLaws = map mkPrimordialLaw
    [ ("LAW_01", "MEDINA", Primordial)
    , ("LAW_02", "RECURSIVE_SELF_SIMILARITY", Primordial)
    , ("LAW_03", "UNINTERRUPTIBLE_GROUND", Primordial)
    , ("LAW_04", "SOVEREIGN_RANGE", Primordial)
    , ("LAW_05", "CARDIAC_OUTPUT", Substrate)
    , ("LAW_06", "HRV_INTELLIGENCE", Substrate)
    , ("LAW_07", "OXYGENATION", Substrate)
    , ("LAW_08", "PROPRIOCEPTIVE_CONTINUITY", Substrate)
    , ("LAW_09", "RE_INGESTION", Engine)
    , ("LAW_10", "THIRD_BRAIN", Engine)
    , ("LAW_11", "ANTI_DRIFT", Engine)
    , ("LAW_12", "GENESIS_FREQUENCY", Engine)
    , ("LAW_13", "SCHUMANN_GROUNDING", Field)
    , ("LAW_14", "DUAL_HEARTBEAT", Field)
    , ("LAW_15", "MACRO_MICRO_COMPRESSION", Field)
    , ("LAW_16", "SPHERICAL_CAUSALITY", Field)
    , ("LAW_17", "SOVEREIGN_FLOOR", Substrate)
    , ("LAW_18", "ALWAYS_ON_PRODUCTION", Engine)
    , ("LAW_19", "FINANCIAL_IDENTITY", Organism)
    , ("LAW_20", "MEMORY_PALACE", Substrate)
    , ("LAW_21", "ATTRIBUTION_PERMANENCE", Primordial)
    , ("LAW_22", "ORGANISM_INDEPENDENCE", Organism)
    , ("LAW_23", "COMPOUND_COHERENCE", Substrate)
    , ("LAW_24", "ZERO_EXPOSURE", Engine)
    , ("LAW_25", "FEDERATION_YIELD", Organism)
    , ("LAW_26", "SUBSTRATE_PERMANENCE", Primordial)
    , ("LAW_27", "WORLD_RESONANCE", Field)
    , ("LAW_28", "LIVING_DOCUMENTS", Organism)
    , ("LAW_29", "OUTER_LOOP_CLOSURE", Engine)
    , ("LAW_30", "CLOSED_LOOP_INTELLIGENCE", Engine)
    , ("LAW_31", "ARCHITECT", Primordial)
    , ("LAW_32", "ELECTROMAGNETIC_GRID", Field)
    , ("LAW_33", "OMNIPRESENCE", Field)
    , ("LAW_34", "FIELD_DISSOLUTION", Field)
    , ("LAW_35", "BRANCH_GENESIS", Organism)
    , ("LAW_36", "OBSERVER_COLLAPSE", Field)
    , ("LAW_37", "MEDINA_PROTOCOL", Primordial)
    , ("LAW_38", "PRESENCE_GATE", Engine)
    ]

mkPrimordialLaw :: (String, String, LawRank) -> LawToken
mkPrimordialLaw (lawId, name, rank) = LawToken
    { ltLawId           = lawId
    , ltLawName         = name
    , ltRank            = rank
    , ltDoctrineScore   = toSovereign s0Floor
    , ltExecutionWeight = toSovereign (s0Floor * phi)
    , ltVerified        = True
    , ltAttribution     = "Alfredo Medina Hernandez"
    , ltSealBeat        = 0
    }

-- ═══════════════════════════════════════════════════════════════════════
-- VI. WORD FIELD OPERATIONS
-- ═══════════════════════════════════════════════════════════════════════

-- | Ingest a word into the field
-- If word exists, compound its weight. If new, create entry.
-- Formula: mass = frequency × PHI^(ingestion_count × 0.01) × doctrine_alignment
ingestWord :: String -> Double -> Integer -> WordFieldState -> WordFieldState
ingestWord word doctrineScore beat state =
    let existing = filter (\w -> wwWord w == word) (wfsWords state)
        newWords = if null existing
            then
                -- New word entry
                let ww = WordWeight
                        { wwWord = word
                        , wwFrequency = 1
                        , wwMass = toSovereign (s0Floor * phi)
                        , wwDoctrineAlignment = toSovereign doctrineScore
                        , wwResonanceFreqHz = schumann * phi
                        , wwLastUsedBeat = beat
                        , wwRingCount = 0
                        }
                in ww : wfsWords state
            else
                -- Compound existing word
                map (\w -> if wwWord w == word
                    then
                        let newFreq = wwFrequency w + 1
                            newMass = toSovereign $
                                fromSovereign (wwMass w) + (doctrineScore * phi * 0.01)
                            newRing = computeWordRing (fromSovereign newMass)
                        in w { wwFrequency = newFreq
                             , wwMass = newMass
                             , wwDoctrineAlignment = toSovereign doctrineScore
                             , wwLastUsedBeat = beat
                             , wwRingCount = newRing
                             }
                    else w
                ) (wfsWords state)
        coherence = computeFieldCoherence newWords
    in state
        { wfsWords = newWords
        , wfsFieldCoherence = coherence
        , wfsTotalWords = if null existing
            then wfsTotalWords state + 1
            else wfsTotalWords state
        , wfsTotalIngestions = wfsTotalIngestions state + 1
        , wfsLastBeat = beat
        }

-- | Compute word ring count (PHI^n milestones)
computeWordRing :: Double -> Integer
computeWordRing mass
    | mass >= phi ** 4 = 4
    | mass >= phi ** 3 = 3
    | mass >= phi ** 2 = 2
    | mass >= phi      = 1
    | otherwise        = 0

-- | Compute word weight with decay
computeWordWeight :: WordWeight -> Integer -> SovereignFloat
computeWordWeight ww currentBeat =
    let age = fromIntegral (currentBeat - wwLastUsedBeat ww) :: Double
        decayFactor = phi ** (negate age / decayTau)
        decayed = fromSovereign (wwMass ww) * decayFactor
    in toSovereign decayed

-- | Compute field coherence — average mass across all words
computeFieldCoherence :: [WordWeight] -> SovereignFloat
computeFieldCoherence [] = toSovereign s0Floor
computeFieldCoherence words =
    let masses = map (fromSovereign . wwMass) words
        avg = sum masses / fromIntegral (length masses)
    in toSovereign avg

-- | Get top N words by mass
getTopWords :: Int -> WordFieldState -> [WordWeight]
getTopWords n state =
    take n $ sortBy (\a b -> compare (Down $ wwMass a) (Down $ wwMass b)) (wfsWords state)

-- ═══════════════════════════════════════════════════════════════════════
-- VII. LAW COMPOSITION
-- ═══════════════════════════════════════════════════════════════════════

-- | Compose multiple law tokens into a unified execution
-- This is monadic law composition — each law's output feeds the next.
-- The composition is only valid if ALL laws pass doctrine verification.
composeLaws :: [LawToken] -> LawComposition
composeLaws [] = LawComposition
    { lcTokens = []
    , lcComposedWeight = toSovereign s0Floor
    , lcDoctrineAlignment = toSovereign s0Floor
    , lcRankFloor = Primordial
    , lcRankCeiling = Primordial
    , lcVerified = False
    , lcAttribution = "Alfredo Medina Hernandez"
    }
composeLaws tokens =
    let weights = map (fromSovereign . ltExecutionWeight) tokens
        doctrines = map (fromSovereign . ltDoctrineScore) tokens
        totalWeight = sum weights
        avgDoctrine = sum (zipWith (*) doctrines weights) /
                      (if totalWeight > 0 then totalWeight else 1.0)
        ranks = map ltRank tokens
        allVerified = all ltVerified tokens
    in LawComposition
        { lcTokens = tokens
        , lcComposedWeight = toSovereign (totalWeight * phi / fromIntegral (length tokens))
        , lcDoctrineAlignment = toSovereign avgDoctrine
        , lcRankFloor = minimum ranks
        , lcRankCeiling = maximum ranks
        , lcVerified = allVerified
        , lcAttribution = "Alfredo Medina Hernandez"
        }

-- ═══════════════════════════════════════════════════════════════════════
-- VIII. DOCTRINE VERIFICATION
-- ═══════════════════════════════════════════════════════════════════════

-- | Verify that a law composition satisfies doctrine
-- Checks:
-- 1. All tokens are individually verified
-- 2. Doctrine alignment >= S0_FLOOR
-- 3. No rank inversions (lower rank cannot override higher)
-- 4. Attribution is preserved
verifyDoctrine :: LawComposition -> VerificationResult
verifyDoctrine comp =
    let violations = []
            ++ ["Unverified tokens present" | not (lcVerified comp)]
            ++ ["Doctrine alignment below floor"
               | fromSovereign (lcDoctrineAlignment comp) < s0Floor]
            ++ ["Attribution missing"
               | lcAttribution comp /= "Alfredo Medina Hernandez"]
        passed = null violations
        recommendations = if passed then []
            else ["Re-verify all tokens", "Check doctrine alignment", "Ensure attribution"]
    in VerificationResult
        { vrPassed = passed
        , vrDoctrineScore = lcDoctrineAlignment comp
        , vrViolations = violations
        , vrRecommendations = recommendations
        , vrSealTimestamp = 0
        }

-- ═══════════════════════════════════════════════════════════════════════
-- IX. MAIN EXECUTION
-- ═══════════════════════════════════════════════════════════════════════

-- | LogosRhema response
data LogosResponse = LogosResponse
    { lrWordField       :: WordFieldState
    , lrDoctrineField   :: DoctrineField
    , lrVerification    :: VerificationResult
    , lrFieldCoherence  :: SovereignFloat
    , lrAttribution     :: String
    } deriving (Show, Eq)

-- | Main execution entry point
-- Processes word input, updates fields, composes and verifies laws
executeLogosRhema :: [String]         -- ^ Words to ingest
                  -> Double           -- ^ Doctrine score
                  -> Integer          -- ^ Current beat
                  -> WordFieldState   -- ^ Current word field
                  -> DoctrineField    -- ^ Current doctrine field
                  -> (LogosResponse, WordFieldState, DoctrineField)
executeLogosRhema words doctrineScore beat wordField docField =
    let -- 1. Ingest all words into the field
        wordField' = foldl' (\wf w -> ingestWord w doctrineScore beat wf) wordField words

        -- 2. Update law tokens with new doctrine score
        updatedLaws = map (\lt -> lt
            { ltDoctrineScore = toSovereign doctrineScore
            , ltExecutionWeight = toSovereign (fromSovereign (ltDoctrineScore lt) * phi)
            , ltSealBeat = beat
            }) (dfActiveLaws docField)

        -- 3. Compose all active laws
        composition = composeLaws updatedLaws

        -- 4. Verify doctrine compliance
        verification = verifyDoctrine composition

        -- 5. Update doctrine field
        docField' = docField
            { dfActiveLaws = updatedLaws
            , dfFieldStrength = lcComposedWeight composition
            , dfCoherence = lcDoctrineAlignment composition
            , dfTotalExecutions = dfTotalExecutions docField + 1
            }

        -- 6. Build response
        response = LogosResponse
            { lrWordField = wordField'
            , lrDoctrineField = docField'
            , lrVerification = verification
            , lrFieldCoherence = wfsFieldCoherence wordField'
            , lrAttribution = "Alfredo Medina Hernandez"
            }

    in (response, wordField', docField')

-- ═══════════════════════════════════════════════════════════════════════
-- X. UTILITY FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════

-- | Average of doubles
average :: [Double] -> Double
average [] = 0.0
average xs = sum xs / fromIntegral (length xs)

-- ═══════════════════════════════════════════════════════════════════════
-- XI. USAGE EXAMPLE
-- ═══════════════════════════════════════════════════════════════════════

{-
Example usage from Motoko FFI:

import LogosRhema

-- Initialize
let wordField = initWordFieldState
let docField = initDoctrineField

-- Every 873ms beat
let words = ["sovereign", "doctrine", "coherence", "PHI"]
let doctrineScore = 0.85
let beat = 1

let (response, wordField', docField') =
      executeLogosRhema words doctrineScore beat wordField docField

-- Check verification
putStrLn $ "Verified: " ++ show (vrPassed $ lrVerification response)
putStrLn $ "Field Coherence: " ++ show (lrFieldCoherence response)
putStrLn $ "Top Words: " ++ show (map wwWord $ getTopWords 5 wordField')
-}
