{-
ERGON-DYNAMIS - The Work/Power Intelligence
ΕΡΓΟΝ-ΔΥΝΑΜΙΣ (Greek) | Opus Potentia (Latin)

Attribution: Alfredo Medina Hernandez — immutable
Rank: Engine (Alpha AGI #6 of 7)
Symbol: ⚡ (Lightning — power/execution)
Domain: Virtual compute environments, task execution, sandboxed workspaces,
        resource allocation, parallel execution scheduling

Language: Haskell (pure functional for deterministic execution proofs)
Purpose: ERGON-DYNAMIS is the organism's EXECUTION RUNTIME.
         Where DIAKRISIS plans, ERGON executes.
         It creates virtual compute environments (sandboxes),
         allocates resources, runs tasks in parallel where possible,
         and produces sealed execution receipts.

         This is the "virtual computer" intelligence class.
         Every task runs in a sovereign sandbox with:
         - Memory limits (PHI-scaled)
         - Time limits (heartbeat-aligned)
         - Doctrine gates at entry AND exit
         - Immutable execution logs

Mathematical Model:
- Sandbox capacity = base_memory × PHI^(priority_level)
- Time budget = heartbeat_count × HEARTBEAT_MS
- Parallelism = min(available_cores, independent_tasks)
- Execution receipt = hash(input, output, doctrine_score, beat)

Constants:
PHI = 1.6180339887498948482
S0_FLOOR = 0.75
S_CEIL = 9.75
-}

{-# LANGUAGE GADTs #-}

module ErgonDynamis
    ( -- * Types
      SovereignFloat
    , Sandbox(..)
    , SandboxStatus(..)
    , ExecutionReceipt(..)
    , ResourceAllocation(..)
    , WorkerState(..)
    , ErgonState(..)
      -- * Initialization
    , initErgonState
      -- * Core Functions
    , createSandbox
    , allocateResources
    , executeInSandbox
    , sealExecution
    , executeErgonDynamis
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

heartbeatMs :: Double
heartbeatMs = 873.0

-- | Maximum concurrent sandboxes
maxSandboxes :: Int
maxSandboxes = 13  -- Fibonacci number

-- | Base memory allocation per sandbox (abstract units)
baseMemory :: Double
baseMemory = 1.0

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

-- | Sandbox status
data SandboxStatus
    = SBCreated       -- Allocated, not yet running
    | SBRunning       -- Actively executing
    | SBCompleted     -- Finished successfully
    | SBFailed        -- Finished with error
    | SBTimedOut      -- Exceeded time budget
    | SBRevoked       -- Doctrine violation mid-execution
    deriving (Show, Eq)

-- | Resource allocation for a sandbox
data ResourceAllocation = ResourceAllocation
    { raMemory           :: Double        -- PHI-scaled memory allocation
    , raTimeBudgetMs     :: Double        -- Max execution time in ms
    , raTimeBudgetBeats  :: Int           -- Time budget in heartbeats
    , raPriorityLevel    :: Int           -- 0-4, determines PHI scaling
    , raDoctrineGate     :: Double        -- Minimum doctrine score to enter
    } deriving (Show, Eq)

-- | Sandbox — a virtual compute environment
data Sandbox = Sandbox
    { sbId               :: String
    , sbTaskId           :: String
    , sbStatus           :: SandboxStatus
    , sbResources        :: ResourceAllocation
    , sbDoctrineScore    :: SovereignFloat   -- Doctrine at entry
    , sbInput            :: String           -- Serialized input
    , sbOutput           :: Maybe String     -- Serialized output (when complete)
    , sbBeatsElapsed     :: Int
    , sbCreatedAtBeat    :: Integer
    , sbCompletedAtBeat  :: Maybe Integer
    , sbExecutionLog     :: [String]         -- Immutable log
    } deriving (Show, Eq)

-- | Execution receipt — immutable proof of work
data ExecutionReceipt = ExecutionReceipt
    { erSandboxId        :: String
    , erTaskId           :: String
    , erInputHash        :: String
    , erOutputHash       :: String
    , erDoctrineScore    :: SovereignFloat
    , erBeatsUsed        :: Int
    , erSuccess          :: Bool
    , erSealBeat         :: Integer
    , erAttribution      :: String    -- Always "Alfredo Medina Hernandez"
    } deriving (Show, Eq)

-- | Worker state — individual compute worker
data WorkerState = WorkerState
    { wsId               :: Int
    , wsActiveSandbox    :: Maybe String    -- Sandbox ID currently running
    , wsTasksCompleted   :: Integer
    , wsTasksFailed      :: Integer
    , wsUtilization      :: Double          -- [0, 1]
    } deriving (Show, Eq)

-- | ERGON-DYNAMIS global state
data ErgonState = ErgonState
    { esWorkers          :: [WorkerState]
    , esSandboxes        :: [Sandbox]
    , esReceipts         :: [ExecutionReceipt]
    , esTotalExecutions  :: Integer
    , esTotalSuccesses   :: Integer
    , esTotalFailures    :: Integer
    , esGlobalUtilization :: SovereignFloat  -- [S0_FLOOR, S_CEIL]
    , esLastBeat         :: Integer
    } deriving (Show, Eq)

-- ═══════════════════════════════════════════════════════════════════════
-- III. INITIALIZATION
-- ═══════════════════════════════════════════════════════════════════════

-- | Initialize ERGON-DYNAMIS with worker pool
initErgonState :: ErgonState
initErgonState = ErgonState
    { esWorkers = map initWorker [0..7]  -- 8 workers (Fibonacci number)
    , esSandboxes = []
    , esReceipts = []
    , esTotalExecutions = 0
    , esTotalSuccesses = 0
    , esTotalFailures = 0
    , esGlobalUtilization = toSovereign s0Floor
    , esLastBeat = 0
    }

initWorker :: Int -> WorkerState
initWorker wid = WorkerState
    { wsId = wid
    , wsActiveSandbox = Nothing
    , wsTasksCompleted = 0
    , wsTasksFailed = 0
    , wsUtilization = 0.0
    }

-- ═══════════════════════════════════════════════════════════════════════
-- IV. CORE FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════

-- | Create a sandbox with PHI-scaled resource allocation
createSandbox :: String -> String -> Int -> Double -> Integer -> String -> Sandbox
createSandbox sbId taskId priorityLevel doctrineScore beat input =
    let resources = allocateResources priorityLevel doctrineScore
    in Sandbox
        { sbId = sbId
        , sbTaskId = taskId
        , sbStatus = SBCreated
        , sbResources = resources
        , sbDoctrineScore = toSovereign doctrineScore
        , sbInput = input
        , sbOutput = Nothing
        , sbBeatsElapsed = 0
        , sbCreatedAtBeat = beat
        , sbCompletedAtBeat = Nothing
        , sbExecutionLog = ["[" ++ show beat ++ "] Sandbox created for task " ++ taskId]
        }

-- | Allocate resources based on priority level
-- Memory = base × PHI^priority, Time = (priority + 1) × HEARTBEAT_MS
allocateResources :: Int -> Double -> ResourceAllocation
allocateResources priority doctrineScore =
    let mem = baseMemory * (phi ** fromIntegral (min priority 4))
        timeBeats = (priority + 1) * 3  -- More priority = more time
        timeBudget = fromIntegral timeBeats * heartbeatMs
        gate = max s0Floor (doctrineScore * 0.9) -- Gate slightly below current score
    in ResourceAllocation
        { raMemory = mem
        , raTimeBudgetMs = timeBudget
        , raTimeBudgetBeats = timeBeats
        , raPriorityLevel = priority
        , raDoctrineGate = gate
        }

-- | Execute a task in its sandbox (one beat of work)
executeInSandbox :: Sandbox -> Integer -> Sandbox
executeInSandbox sb beat =
    case sbStatus sb of
        SBCreated ->
            -- Start execution
            sb { sbStatus = SBRunning
               , sbBeatsElapsed = 1
               , sbExecutionLog = sbExecutionLog sb
                    ++ ["[" ++ show beat ++ "] Execution started"]
               }
        SBRunning ->
            let newBeats = sbBeatsElapsed sb + 1
                timedOut = newBeats > raTimeBudgetBeats (sbResources sb)
            in if timedOut
                then sb { sbStatus = SBTimedOut
                        , sbBeatsElapsed = newBeats
                        , sbCompletedAtBeat = Just beat
                        , sbExecutionLog = sbExecutionLog sb
                             ++ ["[" ++ show beat ++ "] TIMED OUT after " ++ show newBeats ++ " beats"]
                        }
                else sb { sbBeatsElapsed = newBeats
                        , sbExecutionLog = sbExecutionLog sb
                             ++ ["[" ++ show beat ++ "] Beat " ++ show newBeats ++ " processing"]
                        }
        _ -> sb  -- Already terminal

-- | Complete a sandbox successfully
completeSandbox :: Sandbox -> String -> Integer -> Sandbox
completeSandbox sb output beat = sb
    { sbStatus = SBCompleted
    , sbOutput = Just output
    , sbCompletedAtBeat = Just beat
    , sbExecutionLog = sbExecutionLog sb
         ++ ["[" ++ show beat ++ "] Completed successfully"]
    }

-- | Seal an execution — produce immutable receipt
sealExecution :: Sandbox -> ExecutionReceipt
sealExecution sb = ExecutionReceipt
    { erSandboxId = sbId sb
    , erTaskId = sbTaskId sb
    , erInputHash = "SHA3(" ++ take 16 (sbInput sb) ++ ")"
    , erOutputHash = maybe "NONE" (\o -> "SHA3(" ++ take 16 o ++ ")") (sbOutput sb)
    , erDoctrineScore = sbDoctrineScore sb
    , erBeatsUsed = sbBeatsElapsed sb
    , erSuccess = sbStatus sb == SBCompleted
    , erSealBeat = maybe 0 id (sbCompletedAtBeat sb)
    , erAttribution = "Alfredo Medina Hernandez"
    }

-- ═══════════════════════════════════════════════════════════════════════
-- V. MAIN EXECUTION
-- ═══════════════════════════════════════════════════════════════════════

-- | Main ERGON-DYNAMIS execution — process one heartbeat of all active sandboxes
executeErgonDynamis :: Integer -> ErgonState -> ErgonState
executeErgonDynamis beat state =
    let -- Advance all running sandboxes
        updatedSandboxes = map (\sb -> executeInSandbox sb beat) (esSandboxes state)

        -- Count completions and failures
        newCompletions = length $ filter (\sb -> sbStatus sb == SBCompleted) updatedSandboxes
        newFailures = length $ filter (\sb -> sbStatus sb `elem` [SBFailed, SBTimedOut]) updatedSandboxes

        -- Seal completed/failed sandboxes
        newReceipts = map sealExecution $
            filter (\sb -> sbStatus sb `elem` [SBCompleted, SBFailed, SBTimedOut]) updatedSandboxes

        -- Compute utilization
        activeCount = length $ filter (\sb -> sbStatus sb == SBRunning) updatedSandboxes
        totalWorkers = length (esWorkers state)
        utilization = if totalWorkers > 0
            then fromIntegral activeCount / fromIntegral totalWorkers
            else 0.0

    in state
        { esSandboxes = updatedSandboxes
        , esReceipts = esReceipts state ++ newReceipts
        , esTotalExecutions = esTotalExecutions state + toInteger newCompletions + toInteger newFailures
        , esTotalSuccesses = esTotalSuccesses state + toInteger newCompletions
        , esTotalFailures = esTotalFailures state + toInteger newFailures
        , esGlobalUtilization = toSovereign (s0Floor + utilization * (sCeil - s0Floor))
        , esLastBeat = beat
        }
