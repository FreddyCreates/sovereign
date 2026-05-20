{-
MNEME-ANAMNESIS - The Memory Intelligence
ΜΝΗΜΗ-ΑΝΑΜΝΗΣΙΣ (Greek) | Memoria Recordatio (Latin)

Attribution: Alfredo Medina Hernandez — immutable
Rank: Substrate (Alpha AGI #6 of 7)
Symbol: 📖 (Book — memory/knowledge)
Domain: Memory recall, pattern recognition, knowledge crystallization,
        experiential learning, engram association

Language: Haskell (pure functional for immutable memory proofs)
Purpose: MNEME-ANAMNESIS is the organism's MEMORY INTELLIGENCE.
         Not just storage — INTELLIGENT recall.
         It recognizes patterns across memories, forms associations,
         and crystallizes knowledge from experience.

         Platonic anamnesis: "Learning is remembering."
         We don't discover truth — we recall it from the eternal.

Mathematical Model:
- Engram = (content, strength, age, doctrine_weight, associations)
- Recall(query) = Σ(similarity(query, engram) × strength × recency_weight)
- Association = Hebbian link between co-activated engrams
- Crystallization = repeated recall promotes to permanent knowledge
- Pattern = recurring structure across multiple engrams

Constants:
PHI = 1.6180339887498948482
S0_FLOOR = 0.75
S_CEIL = 9.75
-}

{-# LANGUAGE GADTs #-}

module MnemeAnamnesis
    ( -- * Types
      SovereignFloat
    , MemoryEngram(..)
    , MemoryQuery(..)
    , RecallResult(..)
    , AssociationLink(..)
    , PatternMatch(..)
    , CrystallizedKnowledge(..)
    , MnemeState(..)
      -- * Initialization
    , initMnemeState
      -- * Core Functions
    , encodeMemory
    , recallMemories
    , formAssociation
    , detectPatterns
    , crystallizeKnowledge
    , executeMnemeAnamnesis
      -- * Constants
    , phi
    , s0Floor
    , sCeil
    ) where

import Data.List (sortBy, foldl', nub)
import Data.Ord (comparing, Down(..))
import Data.Maybe (fromMaybe, mapMaybe)

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

-- | Memory capacity (Fibonacci)
memoryCapacity :: Int
memoryCapacity = 343  -- 7^3

-- | Association threshold (minimum similarity for auto-association)
associationThreshold :: Double
associationThreshold = 0.618  -- PHI^(-1)

-- | Crystallization threshold (strength needed for permanent knowledge)
crystallizationThreshold :: Double
crystallizationThreshold = 0.95

-- | Recency decay constant
recencyTau :: Double
recencyTau = 49.0  -- 7^2 beats

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
-- III. MEMORY TYPES
-- ═══════════════════════════════════════════════════════════════════════

-- | Memory content type (what the engram holds)
data MemoryContent
    = Sensory [Double]           -- 13-signal snapshot
    | Semantic String            -- Conceptual/linguistic
    | Episodic Integer String    -- Beat + context
    | Procedural String [String] -- Action + parameters
    deriving (Show, Eq)

-- | MemoryEngram - a single memory trace
data MemoryEngram = MemoryEngram
    { meId             :: String
    , meContent        :: MemoryContent
    , meStrength       :: SovereignFloat
    , meEncodedAt      :: Integer
    , meLastAccessed   :: Integer
    , meAccessCount    :: Integer
    , meDoctrineWeight :: SovereignFloat
    , meAssociations   :: [String]       -- IDs of associated engrams
    , meEmbedding      :: [Double]       -- Vector representation
    } deriving (Show, Eq)

-- | Memory query for recall
data MemoryQuery = MemoryQuery
    { mqContent       :: MemoryContent
    , mqEmbedding     :: [Double]
    , mqMinStrength   :: Maybe SovereignFloat
    , mqMaxAge        :: Maybe Integer
    , mqTopK          :: Int
    } deriving (Show, Eq)

-- | Recall result with relevance scoring
data RecallResult = RecallResult
    { rrEngram        :: MemoryEngram
    , rrSimilarity    :: Double
    , rrRecencyBoost  :: Double
    , rrTotalScore    :: SovereignFloat
    } deriving (Show, Eq)

-- | Association link between engrams
data AssociationLink = AssociationLink
    { alSourceId      :: String
    , alTargetId      :: String
    , alStrength      :: Double      -- [0, 1]
    , alCoActivations :: Integer     -- Times activated together
    , alCreatedAt     :: Integer
    , alLastActivated :: Integer
    } deriving (Show, Eq)

-- | Pattern detected across memories
data PatternMatch = PatternMatch
    { pmPatternId     :: String
    , pmMatchingIds   :: [String]    -- Engram IDs that match
    , pmConfidence    :: SovereignFloat
    , pmStructure     :: String      -- Description of pattern
    , pmFrequency     :: Integer     -- How often pattern appears
    } deriving (Show, Eq)

-- | Crystallized knowledge (promoted from episodic)
data CrystallizedKnowledge = CrystallizedKnowledge
    { ckId            :: String
    , ckContent       :: String
    , ckSourceEngrams :: [String]    -- Engrams that contributed
    , ckCertainty     :: SovereignFloat
    , ckDoctrineProof :: String      -- How it aligns with doctrine
    , ckCrystallizedAt :: Integer
    , ckAttribution   :: String
    } deriving (Show, Eq)

-- | Complete MNEME-ANAMNESIS state
data MnemeState = MnemeState
    { msEngrams       :: [MemoryEngram]
    , msAssociations  :: [AssociationLink]
    , msPatterns      :: [PatternMatch]
    , msKnowledge     :: [CrystallizedKnowledge]
    , msCurrentBeat   :: Integer
    , msTotalEncodes  :: Integer
    , msTotalRecalls  :: Integer
    , msRecallAccuracy :: SovereignFloat  -- How well recalls match queries
    , msMemoryCoherence :: SovereignFloat  -- Overall memory health
    , msAttribution   :: String
    } deriving (Show, Eq)

-- ═══════════════════════════════════════════════════════════════════════
-- IV. INITIALIZATION
-- ═══════════════════════════════════════════════════════════════════════

-- | Initialize empty MNEME state
initMnemeState :: MnemeState
initMnemeState = MnemeState
    { msEngrams       = []
    , msAssociations  = []
    , msPatterns      = []
    , msKnowledge     = []
    , msCurrentBeat   = 0
    , msTotalEncodes  = 0
    , msTotalRecalls  = 0
    , msRecallAccuracy = toSovereign s0Floor
    , msMemoryCoherence = toSovereign s0Floor
    , msAttribution   = "Alfredo Medina Hernandez"
    }

-- ═══════════════════════════════════════════════════════════════════════
-- V. CORE FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════

-- | Compute embedding from content
computeEmbedding :: MemoryContent -> [Double]
computeEmbedding content = case content of
    Sensory signals -> take 13 (signals ++ repeat 0.0)  -- Pad to 13
    Semantic text   -> textToEmbedding text
    Episodic beat _ -> [fromIntegral beat / 1000.0, phi, phiInv] ++ replicate 10 0.0
    Procedural _ _  -> replicate 13 phiInv

-- | Simple text to embedding (hash-based)
textToEmbedding :: String -> [Double]
textToEmbedding text =
    let hashVal c = fromIntegral (fromEnum c) / 128.0
        chars = take 13 (text ++ repeat ' ')
    in map hashVal chars

-- | Compute cosine similarity between embeddings
cosineSimilarity :: [Double] -> [Double] -> Double
cosineSimilarity a b
    | length a /= length b = 0.0
    | otherwise =
        let dotProduct = sum (zipWith (*) a b)
            normA = sqrt (sum (map (^(2::Int)) a))
            normB = sqrt (sum (map (^(2::Int)) b))
        in if normA < 1e-10 || normB < 1e-10
           then 0.0
           else dotProduct / (normA * normB)

-- | Compute recency weight (exponential decay)
recencyWeight :: Integer -> Integer -> Double
recencyWeight currentBeat encodedAt =
    let age = currentBeat - encodedAt
        decay = exp (- fromIntegral age / recencyTau)
    in max 0.1 decay  -- Minimum weight floor

-- | Encode a new memory
encodeMemory :: MemoryContent -> SovereignFloat -> MnemeState -> (MemoryEngram, MnemeState)
encodeMemory content doctrineWeight state =
    let beat = msCurrentBeat state
        engramId = "MEM_" ++ show (msTotalEncodes state + 1)
        embedding = computeEmbedding content
        
        engram = MemoryEngram
            { meId             = engramId
            , meContent        = content
            , meStrength       = toSovereign s0Floor
            , meEncodedAt      = beat
            , meLastAccessed   = beat
            , meAccessCount    = 0
            , meDoctrineWeight = doctrineWeight
            , meAssociations   = []
            , meEmbedding      = embedding
            }
        
        -- Enforce capacity limit
        newEngrams = take memoryCapacity (engram : msEngrams state)
        
        -- Auto-associate with similar memories
        associations = findSimilarEngrams embedding (msEngrams state) associationThreshold
        engramWithAssocs = engram { meAssociations = map meId associations }
        
        newState = state
            { msEngrams      = engramWithAssocs : tail newEngrams  -- Replace with associated version
            , msTotalEncodes = msTotalEncodes state + 1
            }
    
    in (engramWithAssocs, newState)

-- | Find engrams similar to given embedding
findSimilarEngrams :: [Double] -> [MemoryEngram] -> Double -> [MemoryEngram]
findSimilarEngrams embedding engrams threshold =
    filter (\e -> cosineSimilarity embedding (meEmbedding e) >= threshold) engrams

-- | Recall memories matching a query
recallMemories :: MemoryQuery -> MnemeState -> ([RecallResult], MnemeState)
recallMemories query state =
    let beat = msCurrentBeat state
        queryEmb = mqEmbedding query
        
        -- Score all engrams
        scored = mapMaybe (scoreEngram beat queryEmb) (msEngrams state)
        
        -- Filter by minimum strength
        filtered = case mqMinStrength query of
            Nothing -> scored
            Just minStr -> filter (\r -> fromSovereign (rrTotalScore r) >= fromSovereign minStr) scored
        
        -- Sort by total score descending
        sorted = sortBy (comparing (Down . rrTotalScore)) filtered
        
        -- Take top K
        topK = take (mqTopK query) sorted
        
        -- Update access counts for recalled memories
        recalledIds = map (meId . rrEngram) topK
        updatedEngrams = map (updateIfRecalled beat recalledIds) (msEngrams state)
        
        -- Update recall accuracy
        avgScore = if null topK
                   then s0Floor
                   else sum (map (fromSovereign . rrTotalScore) topK) / fromIntegral (length topK)
        
        newState = state
            { msEngrams       = updatedEngrams
            , msTotalRecalls  = msTotalRecalls state + 1
            , msRecallAccuracy = toSovereign avgScore
            }
    
    in (topK, newState)

-- | Score an engram for recall
scoreEngram :: Integer -> [Double] -> MemoryEngram -> Maybe RecallResult
scoreEngram beat queryEmb engram =
    let similarity = cosineSimilarity queryEmb (meEmbedding engram)
        recency = recencyWeight beat (meEncodedAt engram)
        strength = fromSovereign (meStrength engram)
        doctrine = fromSovereign (meDoctrineWeight engram)
        
        -- Combined score: similarity × strength × recency × doctrine
        total = similarity * strength * recency * doctrine * phi
        
    in if similarity < 0.1  -- Below noise floor
       then Nothing
       else Just RecallResult
            { rrEngram      = engram
            , rrSimilarity  = similarity
            , rrRecencyBoost = recency
            , rrTotalScore  = toSovereign total
            }

-- | Update engram if it was recalled
updateIfRecalled :: Integer -> [String] -> MemoryEngram -> MemoryEngram
updateIfRecalled beat recalledIds engram
    | meId engram `elem` recalledIds =
        engram
            { meLastAccessed = beat
            , meAccessCount  = meAccessCount engram + 1
            , meStrength     = toSovereign $ min sCeil (fromSovereign (meStrength engram) + 0.05 * phi)
            }
    | otherwise = engram

-- | Form association between two engrams
formAssociation :: String -> String -> MnemeState -> MnemeState
formAssociation sourceId targetId state =
    let beat = msCurrentBeat state
        
        -- Check if association already exists
        existingAssoc = filter (\a -> alSourceId a == sourceId && alTargetId a == targetId) (msAssociations state)
        
        newAssociations = case existingAssoc of
            (existing:_) ->
                -- Strengthen existing association
                let strengthened = existing
                        { alStrength     = min 1.0 (alStrength existing + 0.1 * phi)
                        , alCoActivations = alCoActivations existing + 1
                        , alLastActivated = beat
                        }
                in strengthened : filter (/= existing) (msAssociations state)
            [] ->
                -- Create new association
                let newAssoc = AssociationLink
                        { alSourceId      = sourceId
                        , alTargetId      = targetId
                        , alStrength      = phiInv  -- Start at PHI^(-1)
                        , alCoActivations = 1
                        , alCreatedAt     = beat
                        , alLastActivated = beat
                        }
                in newAssoc : msAssociations state
    
    in state { msAssociations = newAssociations }

-- | Detect patterns across memories
detectPatterns :: MnemeState -> [PatternMatch]
detectPatterns state =
    let engrams = msEngrams state
        
        -- Group by content type
        sensoryEngrams = filter (isSensory . meContent) engrams
        semanticEngrams = filter (isSemantic . meContent) engrams
        
        -- Find recurring patterns
        sensoryPatterns = findSensoryPatterns sensoryEngrams
        semanticPatterns = findSemanticPatterns semanticEngrams
        
    in sensoryPatterns ++ semanticPatterns

-- | Check if content is sensory
isSensory :: MemoryContent -> Bool
isSensory (Sensory _) = True
isSensory _           = False

-- | Check if content is semantic
isSemantic :: MemoryContent -> Bool
isSemantic (Semantic _) = True
isSemantic _            = False

-- | Find patterns in sensory memories (simplified)
findSensoryPatterns :: [MemoryEngram] -> [PatternMatch]
findSensoryPatterns engrams
    | length engrams < 3 = []
    | otherwise =
        let embeddings = map meEmbedding engrams
            avgSimilarity = averagePairwiseSimilarity embeddings
        in if avgSimilarity > associationThreshold
           then [PatternMatch
                    { pmPatternId   = "SENSORY_COHERENCE"
                    , pmMatchingIds = map meId engrams
                    , pmConfidence  = toSovereign (avgSimilarity * phi + s0Floor)
                    , pmStructure   = "Coherent sensory stream detected"
                    , pmFrequency   = fromIntegral (length engrams)
                    }]
           else []

-- | Find patterns in semantic memories (simplified)
findSemanticPatterns :: [MemoryEngram] -> [PatternMatch]
findSemanticPatterns engrams
    | length engrams < 2 = []
    | otherwise =
        let texts = mapMaybe extractSemantic engrams
            -- Look for repeated words/concepts (simplified)
            wordFreqs = countWords texts
            frequentWords = filter ((> 2) . snd) wordFreqs
        in if null frequentWords
           then []
           else [PatternMatch
                    { pmPatternId   = "SEMANTIC_THEME"
                    , pmMatchingIds = map meId engrams
                    , pmConfidence  = toSovereign $ phi * fromIntegral (length frequentWords) / 10.0 + s0Floor
                    , pmStructure   = "Recurring themes: " ++ unwords (map fst $ take 5 frequentWords)
                    , pmFrequency   = fromIntegral (length frequentWords)
                    }]

-- | Extract semantic content
extractSemantic :: MemoryEngram -> Maybe String
extractSemantic engram = case meContent engram of
    Semantic text -> Just text
    _             -> Nothing

-- | Count word frequencies (simplified)
countWords :: [String] -> [(String, Int)]
countWords texts =
    let allWords = concatMap words texts
        uniqueWords = nub allWords
        counts = map (\w -> (w, length (filter (== w) allWords))) uniqueWords
    in sortBy (comparing (Down . snd)) counts

-- | Average pairwise similarity
averagePairwiseSimilarity :: [[Double]] -> Double
averagePairwiseSimilarity embeddings
    | length embeddings < 2 = 0.0
    | otherwise =
        let pairs = [(a, b) | a <- embeddings, b <- embeddings, a /= b]
            similarities = map (uncurry cosineSimilarity) pairs
        in sum similarities / fromIntegral (length similarities)

-- | Crystallize knowledge from strong memories
crystallizeKnowledge :: MnemeState -> MnemeState
crystallizeKnowledge state =
    let beat = msCurrentBeat state
        
        -- Find strong, well-accessed memories
        candidates = filter isReadyToCrystallize (msEngrams state)
        
        -- Create crystallized knowledge from candidates
        newKnowledge = mapMaybe (createKnowledge beat) candidates
        
    in state { msKnowledge = newKnowledge ++ msKnowledge state }

-- | Check if engram is ready for crystallization
isReadyToCrystallize :: MemoryEngram -> Bool
isReadyToCrystallize engram =
    fromSovereign (meStrength engram) >= crystallizationThreshold &&
    meAccessCount engram >= 7 &&
    fromSovereign (meDoctrineWeight engram) >= phiInv

-- | Create crystallized knowledge from engram
createKnowledge :: Integer -> MemoryEngram -> Maybe CrystallizedKnowledge
createKnowledge beat engram = Just CrystallizedKnowledge
    { ckId            = "KNOW_" ++ meId engram
    , ckContent       = contentToText (meContent engram)
    , ckSourceEngrams = [meId engram]
    , ckCertainty     = meStrength engram
    , ckDoctrineProof = "Doctrine weight: " ++ show (fromSovereign (meDoctrineWeight engram))
    , ckCrystallizedAt = beat
    , ckAttribution   = "Alfredo Medina Hernandez"
    }

-- | Convert content to text
contentToText :: MemoryContent -> String
contentToText (Sensory signals) = "Sensory: " ++ show (take 5 signals) ++ "..."
contentToText (Semantic text)   = text
contentToText (Episodic b ctx)  = "Episode@" ++ show b ++ ": " ++ ctx
contentToText (Procedural act _) = "Procedure: " ++ act

-- ═══════════════════════════════════════════════════════════════════════
-- VI. MAIN EXECUTION
-- ═══════════════════════════════════════════════════════════════════════

-- | Execute one MNEME-ANAMNESIS heartbeat
executeMnemeAnamnesis :: MemoryContent -> SovereignFloat -> Integer -> MnemeState -> (MnemeState, String)
executeMnemeAnamnesis content doctrine beat state =
    let -- Update beat
        state1 = state { msCurrentBeat = beat }
        
        -- Encode new memory
        (engram, state2) = encodeMemory content doctrine state1
        
        -- Detect patterns every 7 beats
        state3 = if beat `mod` 7 == 0
                 then state2 { msPatterns = detectPatterns state2 }
                 else state2
        
        -- Attempt crystallization every 49 beats
        state4 = if beat `mod` 49 == 0
                 then crystallizeKnowledge state3
                 else state3
        
        -- Compute memory coherence
        avgStrength = if null (msEngrams state4)
                      then s0Floor
                      else sum (map (fromSovereign . meStrength) (msEngrams state4)) / 
                           fromIntegral (length (msEngrams state4))
        
        state5 = state4 { msMemoryCoherence = toSovereign (avgStrength * phi) }
        
        event = "ENCODED:" ++ meId engram ++
                " | Engrams:" ++ show (length (msEngrams state5)) ++
                " | Patterns:" ++ show (length (msPatterns state5)) ++
                " | Knowledge:" ++ show (length (msKnowledge state5))
    
    in (state5, event)

-- ═══════════════════════════════════════════════════════════════════════
-- VII. USAGE EXAMPLE
-- ═══════════════════════════════════════════════════════════════════════

{-
Example usage from Motoko FFI:

import MnemeAnamnesis

-- Initialize
let state = initMnemeState

-- Every 873ms beat
let loop beat state = do
    -- Create memory content from current signals
    let signals = [0.8, 0.9, 0.75, 0.82, 0.91, 0.78, 0.85, 0.88, 0.79, 0.86, 0.81, 0.84, 0.87]
        content = Sensory signals
        doctrine = toSovereign 0.85
        
    -- Execute MNEME-ANAMNESIS
    let (newState, event) = executeMnemeAnamnesis content doctrine beat state
    
    putStrLn $ "Beat " ++ show beat ++ ": " ++ event
    putStrLn $ "Memory Coherence: " ++ show (fromSovereign (msMemoryCoherence newState))
    putStrLn $ "Recall Accuracy: " ++ show (fromSovereign (msRecallAccuracy newState))
    
    -- Query memories
    let query = MemoryQuery
            { mqContent     = Sensory signals
            , mqEmbedding   = signals
            , mqMinStrength = Just (toSovereign 0.5)
            , mqMaxAge      = Nothing
            , mqTopK        = 5
            }
    let (results, newState') = recallMemories query newState
    
    putStrLn $ "Recalled " ++ show (length results) ++ " memories"
    
    loop (beat + 1) newState'

main = loop 0 initMnemeState
-}
