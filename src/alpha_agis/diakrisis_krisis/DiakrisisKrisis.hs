{-
DIAKRISIS-KRISIS - The Discernment Intelligence
ΔΙΑΚΡΙΣΙΣ-ΚΡΙΣΙΣ (Greek) | Discretio Iudicium (Latin)

Attribution: Alfredo Medina Hernandez — immutable
Rank: Engine (Alpha AGI #5 of 7)
Symbol: ⚖ (Scales — judgment/discernment)
Domain: Task decomposition, planning, priority routing, decision trees
        Real decision theory — not heuristics, actual expected utility

Language: Haskell (pure functional for provable decision trees)
Purpose: Takes any goal and decomposes it into doctrine-aligned task DAGs.
         Routes each task to the correct intelligence substrate.
         Computes expected utility of each path. Prunes infeasible branches.
         This is the organism's PLANNER — it decides WHAT to do, not HOW.

Mathematical Model:
- Task DAG = Directed Acyclic Graph of subtasks with dependencies
- Expected utility EU(task) = P(success) × doctrine_alignment × PHI-weight
- Priority = EU / estimated_cost
- Routing table maps task types to intelligence substrates
- Feasibility gate: EU >= S0_FLOOR required for task approval

Constants:
PHI = 1.6180339887498948482
S0_FLOOR = 0.75
S_CEIL = 9.75
-}

{-# LANGUAGE GADTs #-}

module DiakrisisKrisis
    ( -- * Types
      SovereignFloat
    , Task(..)
    , TaskStatus(..)
    , TaskPriority(..)
    , TaskDAG(..)
    , DecisionResult(..)
    , IntelligenceSubstrate(..)
    , PlannerState(..)
      -- * Initialization
    , initPlannerState
      -- * Core Functions
    , decomposeGoal
    , computeExpectedUtility
    , routeTask
    , prioritizeTasks
    , executeDiakrisis
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

phi :: Double
phi = 1.6180339887498948482

phiInv :: Double
phiInv = 1.0 / phi

s0Floor :: Double
s0Floor = 0.75

sCeil :: Double
sCeil = 9.75

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

-- | Intelligence substrate routing targets
data IntelligenceSubstrate
    = RustEngine          -- Hot-path math (NOVA, BRAIN, MNEME, RESONEX, ENTANGLA, QMEM)
    | JuliaCore           -- Scientific computing (KARDIA, PSYCHE, CHRONOS, AISTHESIS)
    | HaskellAGI          -- Pure transformations (NOUS-SOPHIA, LOGOS-RHEMA, TECHNE-POIESIS, ERGON, PRONOIA)
    | MotokoCharter       -- ICP runtime (CCLE-OMEGA, CCSV-PRIME, CDGX-INFINITE, CADC-ETERNAL)
    | CPLLaw              -- Doctrine execution (LAW_04, LAW_09, LAW_11, etc.)
    | VirtualCompute      -- Task execution environment (ERGON-DYNAMIS)
    deriving (Show, Eq, Ord)

-- | Task status
data TaskStatus
    = Pending
    | InProgress
    | Completed
    | Failed
    | Blocked     -- Waiting for dependency
    | Rejected    -- Below doctrine gate
    deriving (Show, Eq)

-- | Task priority classification
data TaskPriority
    = Critical    -- EU >= PHI × S_CEIL / 2
    | High        -- EU >= PHI
    | Normal      -- EU >= S0_FLOOR
    | Low         -- EU >= 0 but < S0_FLOOR (will be rejected at gate)
    deriving (Show, Eq, Ord)

-- | A single task in the DAG
data Task = Task
    { taskId              :: String
    , taskName            :: String
    , taskDescription     :: String
    , taskSubstrate       :: IntelligenceSubstrate
    , taskDependencies    :: [String]        -- IDs of tasks that must complete first
    , taskExpectedUtility :: SovereignFloat  -- EU(task)
    , taskDoctrineScore   :: SovereignFloat
    , taskEstimatedCost   :: Double          -- Computational cost estimate
    , taskPriority        :: TaskPriority
    , taskStatus          :: TaskStatus
    , taskBeatCreated     :: Integer
    , taskBeatCompleted   :: Maybe Integer
    } deriving (Show, Eq)

-- | Task DAG — the complete plan
data TaskDAG = TaskDAG
    { dagTasks     :: [Task]
    , dagRootIds   :: [String]      -- Tasks with no dependencies
    , dagLeafIds   :: [String]      -- Tasks with no dependents
    , dagTotalEU   :: SovereignFloat
    , dagFeasible  :: Bool          -- All tasks pass doctrine gate
    } deriving (Show, Eq)

-- | Decision result from the planner
data DecisionResult = DecisionResult
    { drApproved         :: Bool
    , drDAG              :: TaskDAG
    , drNextActions      :: [Task]          -- Ready-to-execute tasks
    , drRejections       :: [Task]          -- Tasks that failed doctrine gate
    , drTotalPriority    :: SovereignFloat
    , drAttribution      :: String
    } deriving (Show, Eq)

-- | Planner state
data PlannerState = PlannerState
    { psActiveDAGs       :: [TaskDAG]
    , psCompletedTasks   :: Integer
    , psRejectedTasks    :: Integer
    , psTotalDecisions   :: Integer
    , psAverageEU        :: SovereignFloat
    , psLastBeat         :: Integer
    } deriving (Show, Eq)

-- ═══════════════════════════════════════════════════════════════════════
-- III. INITIALIZATION
-- ═══════════════════════════════════════════════════════════════════════

initPlannerState :: PlannerState
initPlannerState = PlannerState
    { psActiveDAGs     = []
    , psCompletedTasks = 0
    , psRejectedTasks  = 0
    , psTotalDecisions = 0
    , psAverageEU      = toSovereign s0Floor
    , psLastBeat       = 0
    }

-- ═══════════════════════════════════════════════════════════════════════
-- IV. CORE FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════

-- | Compute expected utility of a task
-- EU(task) = P(success) × doctrine_alignment × PHI-weight / cost
computeExpectedUtility :: Double -> Double -> Double -> Double -> SovereignFloat
computeExpectedUtility successProb doctrineAlign phiWeight cost =
    let rawEU = successProb * doctrineAlign * phiWeight * phi
        scaledEU = if cost > 0 then rawEU / cost else rawEU
    in toSovereign scaledEU

-- | Classify priority from EU
classifyPriority :: SovereignFloat -> TaskPriority
classifyPriority eu
    | fromSovereign eu >= phi * sCeil / 2.0 = Critical
    | fromSovereign eu >= phi               = High
    | fromSovereign eu >= s0Floor           = Normal
    | otherwise                             = Low

-- | Route a task to its correct intelligence substrate
-- Based on task characteristics, doctrine requirements, and compute needs
routeTask :: String -> String -> Double -> IntelligenceSubstrate
routeTask taskType domain doctrineReq
    | taskType == "math_hotpath"    = RustEngine
    | taskType == "scientific_ode"  = JuliaCore
    | taskType == "law_verify"      = CPLLaw
    | taskType == "charter_evolve"  = MotokoCharter
    | taskType == "task_execute"    = VirtualCompute
    | domain   == "perception"      = JuliaCore
    | domain   == "memory"          = RustEngine
    | domain   == "creativity"      = HaskellAGI
    | domain   == "planning"        = HaskellAGI
    | domain   == "drift_detect"    = RustEngine
    | doctrineReq > 0.9             = CPLLaw
    | otherwise                     = HaskellAGI

-- | Decompose a goal into a task DAG
decomposeGoal :: String -> String -> Double -> Integer -> TaskDAG
decomposeGoal goalId goalDesc doctrineScore beat =
    let -- Create root task
        rootTask = Task
            { taskId = goalId ++ "_root"
            , taskName = "Plan: " ++ goalDesc
            , taskDescription = goalDesc
            , taskSubstrate = HaskellAGI
            , taskDependencies = []
            , taskExpectedUtility = computeExpectedUtility 0.8 doctrineScore phi 1.0
            , taskDoctrineScore = toSovereign doctrineScore
            , taskEstimatedCost = 1.0
            , taskPriority = classifyPriority (computeExpectedUtility 0.8 doctrineScore phi 1.0)
            , taskStatus = Pending
            , taskBeatCreated = beat
            , taskBeatCompleted = Nothing
            }

        -- Create analysis subtask
        analyzeTask = Task
            { taskId = goalId ++ "_analyze"
            , taskName = "Analyze: " ++ goalDesc
            , taskDescription = "Analyze requirements and constraints"
            , taskSubstrate = HaskellAGI
            , taskDependencies = [goalId ++ "_root"]
            , taskExpectedUtility = computeExpectedUtility 0.9 doctrineScore phiInv 0.5
            , taskDoctrineScore = toSovereign doctrineScore
            , taskEstimatedCost = 0.5
            , taskPriority = Normal
            , taskStatus = Blocked
            , taskBeatCreated = beat
            , taskBeatCompleted = Nothing
            }

        -- Create execution subtask
        executeTask = Task
            { taskId = goalId ++ "_execute"
            , taskName = "Execute: " ++ goalDesc
            , taskDescription = "Execute the analyzed plan"
            , taskSubstrate = VirtualCompute
            , taskDependencies = [goalId ++ "_analyze"]
            , taskExpectedUtility = computeExpectedUtility 0.7 doctrineScore phi 2.0
            , taskDoctrineScore = toSovereign doctrineScore
            , taskEstimatedCost = 2.0
            , taskPriority = Normal
            , taskStatus = Blocked
            , taskBeatCreated = beat
            , taskBeatCompleted = Nothing
            }

        -- Create verification subtask
        verifyTask = Task
            { taskId = goalId ++ "_verify"
            , taskName = "Verify: " ++ goalDesc
            , taskDescription = "Verify doctrine compliance of output"
            , taskSubstrate = CPLLaw
            , taskDependencies = [goalId ++ "_execute"]
            , taskExpectedUtility = computeExpectedUtility 0.95 doctrineScore phi 0.3
            , taskDoctrineScore = toSovereign doctrineScore
            , taskEstimatedCost = 0.3
            , taskPriority = High
            , taskStatus = Blocked
            , taskBeatCreated = beat
            , taskBeatCompleted = Nothing
            }

        tasks = [rootTask, analyzeTask, executeTask, verifyTask]
        totalEU = toSovereign $ sum $ map (fromSovereign . taskExpectedUtility) tasks
        allFeasible = all (\t -> fromSovereign (taskExpectedUtility t) >= s0Floor) tasks

    in TaskDAG
        { dagTasks = tasks
        , dagRootIds = [goalId ++ "_root"]
        , dagLeafIds = [goalId ++ "_verify"]
        , dagTotalEU = totalEU
        , dagFeasible = allFeasible
        }

-- | Prioritize tasks — sort by EU / cost (highest first)
prioritizeTasks :: [Task] -> [Task]
prioritizeTasks = sortBy (\a b ->
    compare
        (Down $ fromSovereign (taskExpectedUtility a) / max 0.01 (taskEstimatedCost a))
        (Down $ fromSovereign (taskExpectedUtility b) / max 0.01 (taskEstimatedCost b)))

-- | Get tasks ready to execute (all dependencies met)
getReadyTasks :: TaskDAG -> [Task]
getReadyTasks dag =
    let completedIds = map taskId $ filter (\t -> taskStatus t == Completed) (dagTasks dag)
        isReady t = taskStatus t == Pending
                 && all (`elem` completedIds) (taskDependencies t)
    in filter isReady (dagTasks dag)

-- ═══════════════════════════════════════════════════════════════════════
-- V. MAIN EXECUTION
-- ═══════════════════════════════════════════════════════════════════════

-- | Main DIAKRISIS execution entry point
executeDiakrisis :: String          -- ^ Goal ID
                 -> String          -- ^ Goal description
                 -> Double          -- ^ Doctrine score
                 -> Integer         -- ^ Current beat
                 -> PlannerState    -- ^ Current state
                 -> (DecisionResult, PlannerState)
executeDiakrisis goalId goalDesc doctrineScore beat state =
    let -- 1. Decompose the goal
        dag = decomposeGoal goalId goalDesc doctrineScore beat

        -- 2. Prioritize tasks
        prioritized = prioritizeTasks (dagTasks dag)

        -- 3. Get ready-to-execute tasks
        ready = getReadyTasks dag

        -- 4. Find rejections (below doctrine gate)
        rejections = filter (\t -> fromSovereign (taskExpectedUtility t) < s0Floor) prioritized

        -- 5. Compute total priority
        totalPriority = toSovereign $ sum $ map (fromSovereign . taskExpectedUtility) ready

        -- 6. Build result
        result = DecisionResult
            { drApproved = dagFeasible dag && null rejections
            , drDAG = dag
            , drNextActions = ready
            , drRejections = rejections
            , drTotalPriority = totalPriority
            , drAttribution = "Alfredo Medina Hernandez"
            }

        -- 7. Update state
        newState = state
            { psActiveDAGs = dag : psActiveDAGs state
            , psTotalDecisions = psTotalDecisions state + 1
            , psRejectedTasks = psRejectedTasks state + toInteger (length rejections)
            , psLastBeat = beat
            }

    in (result, newState)
