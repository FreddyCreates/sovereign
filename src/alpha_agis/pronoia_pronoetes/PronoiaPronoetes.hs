{-
PRONOIA-PRONOETES - The Providence Intelligence
ΠΡΟΝΟΙΑ-ΠΡΟΝΟΗΤΗΣ (Greek) | Providentia Praecognitor (Latin)

Attribution: Alfredo Medina Hernandez — immutable
Rank: Substrate (Alpha AGI #7 of 7)
Symbol: 🔮 (Crystal — foresight/providence)
Domain: Predictive modeling, trend forecasting, risk assessment,
        future state estimation, proactive resource positioning

Language: Haskell (pure functional for deterministic prediction proofs)
Purpose: PRONOIA is the organism's FORESIGHT engine.
         It reads historical signal trajectories and predicts future states.
         Not guessing — mathematical extrapolation with confidence bounds.

         Uses:
         1. Linear regression on signal windows → trend direction
         2. Exponential smoothing → weighted recent bias
         3. PHI-scaled confidence intervals → sovereign-bounded uncertainty
         4. Risk scoring → probability of doctrine violation in N beats

Mathematical Model:
- Trend = weighted linear regression on last W beats
- Forecast(t+k) = current + trend × k × PHI-decay
- Confidence = 1 / (1 + σ² × k²)  → decays with horizon
- Risk = P(forecast < S0_FLOOR | forecast > S_CEIL)
- Proactive alert if risk > PHI^(-1) within 7 beats

Constants:
PHI = 1.6180339887498948482
S0_FLOOR = 0.75
S_CEIL = 9.75
-}

module PronoiaPronoetes
    ( -- * Types
      SovereignFloat
    , Prediction(..)
    , RiskAssessment(..)
    , TrendAnalysis(..)
    , PronoiaState(..)
      -- * Initialization
    , initPronoiaState
      -- * Core Functions
    , predictSignal
    , assessRisk
    , analyzeTrend
    , executePronoiaPronoetes
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

-- | Default prediction horizon (beats)
defaultHorizon :: Int
defaultHorizon = 7  -- One VELA step

-- | Smoothing factor for exponential smoothing
alpha :: Double
alpha = 0.3  -- Moderate bias toward recent data

-- | Risk threshold — alert if P(violation) > this
riskThreshold :: Double
riskThreshold = phiInv  -- ≈ 0.618

-- | Window size for trend analysis
trendWindow :: Int
trendWindow = 20

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

-- | Trend analysis result
data TrendAnalysis = TrendAnalysis
    { taSlope              :: Double          -- Rate of change per beat
    , taIntercept          :: Double          -- Baseline
    , taRSquared           :: Double          -- Fit quality [0, 1]
    , taDirection          :: TrendDirection
    , taMagnitude          :: SovereignFloat  -- Absolute rate scaled to sovereign
    , taSampleSize         :: Int
    } deriving (Show, Eq)

data TrendDirection
    = Rising
    | Falling
    | Stable    -- |slope| < threshold
    deriving (Show, Eq)

-- | Prediction for a future beat
data Prediction = Prediction
    { prSignalId           :: String
    , prCurrentValue       :: SovereignFloat
    , prPredictedValue     :: SovereignFloat
    , prHorizonBeats       :: Int
    , prConfidence         :: Double          -- [0, 1]
    , prLowerBound         :: SovereignFloat
    , prUpperBound         :: SovereignFloat
    , prTrend              :: TrendAnalysis
    } deriving (Show, Eq)

-- | Risk assessment
data RiskAssessment = RiskAssessment
    { raSignalId           :: String
    , raRiskScore          :: Double          -- [0, 1] — P(violation)
    , raAlertTriggered     :: Bool
    , raViolationType      :: Maybe ViolationType
    , raBeatsUntilViolation :: Maybe Int      -- Estimated beats until breach
    , raRecommendation     :: String
    } deriving (Show, Eq)

data ViolationType
    = FloorBreach     -- Signal predicted to drop below S0_FLOOR
    | CeilBreach      -- Signal predicted to exceed S_CEIL
    | DriftViolation  -- Drift rate exceeds tolerance
    deriving (Show, Eq)

-- | Pronoia global state
data PronoiaState = PronoiaState
    { psSignalHistories   :: [(String, [Double])]  -- Signal ID → value history
    , psPredictions       :: [Prediction]
    , psRiskAlerts        :: [RiskAssessment]
    , psTotalPredictions  :: Integer
    , psAccuracyScore     :: SovereignFloat       -- Historical prediction accuracy
    , psLastBeat          :: Integer
    } deriving (Show, Eq)

-- ═══════════════════════════════════════════════════════════════════════
-- III. INITIALIZATION
-- ═══════════════════════════════════════════════════════════════════════

initPronoiaState :: PronoiaState
initPronoiaState = PronoiaState
    { psSignalHistories = []
    , psPredictions = []
    , psRiskAlerts = []
    , psTotalPredictions = 0
    , psAccuracyScore = toSovereign s0Floor
    , psLastBeat = 0
    }

-- ═══════════════════════════════════════════════════════════════════════
-- IV. CORE MATH
-- ═══════════════════════════════════════════════════════════════════════

-- | Simple linear regression: y = mx + b
-- Returns (slope, intercept, r_squared)
linearRegression :: [Double] -> (Double, Double, Double)
linearRegression [] = (0, 0, 0)
linearRegression [x] = (0, x, 1)
linearRegression ys =
    let n = fromIntegral (length ys)
        xs = [1..n]
        sumX = sum xs
        sumY = sum ys
        sumXY = sum $ zipWith (*) xs ys
        sumX2 = sum $ map (^(2::Int)) xs
        sumY2 = sum $ map (^(2::Int)) ys

        -- Slope
        slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)

        -- Intercept
        intercept = (sumY - slope * sumX) / n

        -- R-squared
        ssRes = sum $ zipWith (\x y -> (y - (slope * x + intercept))^(2::Int)) xs ys
        ssTot = sum $ map (\y -> (y - sumY / n)^(2::Int)) ys
        rSq = if ssTot > 0 then 1.0 - ssRes / ssTot else 0.0

    in (slope, intercept, max 0.0 (min 1.0 rSq))

-- | Exponential smoothing
exponentialSmooth :: [Double] -> Double -> Double
exponentialSmooth [] _ = s0Floor
exponentialSmooth [x] _ = x
exponentialSmooth xs smoothAlpha =
    foldl' (\prev x -> smoothAlpha * x + (1 - smoothAlpha) * prev) (head xs) (tail xs)

-- | Compute prediction confidence (decays with horizon)
-- confidence(k) = 1 / (1 + variance × k² × PHI^(-1))
computeConfidence :: Double -> Int -> Double
computeConfidence variance horizon =
    let k = fromIntegral horizon
    in 1.0 / (1.0 + variance * k * k * phiInv)

-- ═══════════════════════════════════════════════════════════════════════
-- V. ANALYSIS FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════

-- | Analyze trend from signal history
analyzeTrend :: [Double] -> TrendAnalysis
analyzeTrend history =
    let window = take trendWindow (reverse history) -- Most recent first
        (slope, intercept, rSq) = linearRegression (reverse window)
        direction | abs slope < 0.01 = Stable
                  | slope > 0        = Rising
                  | otherwise        = Falling
        magnitude = toSovereign (abs slope * phi)
    in TrendAnalysis
        { taSlope = slope
        , taIntercept = intercept
        , taRSquared = rSq
        , taDirection = direction
        , taMagnitude = magnitude
        , taSampleSize = length window
        }

-- | Predict a signal k beats into the future
predictSignal :: String -> [Double] -> Int -> Prediction
predictSignal signalId history horizon =
    let trend = analyzeTrend history
        current = if null history then s0Floor else last history

        -- Predicted value using trend + exponential smoothing
        smoothed = exponentialSmooth history alpha
        predicted = smoothed + taSlope trend * fromIntegral horizon

        -- Confidence interval
        variance = if length history < 2 then 1.0
                   else let vals = take trendWindow history
                            mu = sum vals / fromIntegral (length vals)
                        in sum (map (\v -> (v - mu)^(2::Int)) vals) / fromIntegral (length vals)
        conf = computeConfidence variance horizon
        halfWidth = (1.0 - conf) * (sCeil - s0Floor) * 0.5
        lower = max s0Floor (predicted - halfWidth)
        upper = min sCeil (predicted + halfWidth)

    in Prediction
        { prSignalId = signalId
        , prCurrentValue = toSovereign current
        , prPredictedValue = toSovereign (max s0Floor (min sCeil predicted))
        , prHorizonBeats = horizon
        , prConfidence = conf
        , prLowerBound = toSovereign lower
        , prUpperBound = toSovereign upper
        , prTrend = trend
        }

-- | Assess risk of doctrine violation within horizon
assessRisk :: String -> [Double] -> Int -> RiskAssessment
assessRisk signalId history horizon =
    let pred = predictSignal signalId history horizon
        predVal = fromSovereign (prPredictedValue pred)
        lowerVal = fromSovereign (prLowerBound pred)
        upperVal = fromSovereign (prUpperBound pred)

        -- Risk = probability that actual value leaves sovereign range
        floorRisk = if lowerVal <= s0Floor then 1.0 - prConfidence pred else 0.0
        ceilRisk = if upperVal >= sCeil then 1.0 - prConfidence pred else 0.0
        totalRisk = min 1.0 (floorRisk + ceilRisk)

        violation = if floorRisk > ceilRisk && floorRisk > 0.01
                    then Just FloorBreach
                    else if ceilRisk > 0.01
                    then Just CeilBreach
                    else Nothing

        -- Estimate beats until violation
        beatsUntil = case violation of
            Just FloorBreach ->
                let slope = taSlope (prTrend pred)
                    current = if null history then s0Floor else last history
                in if slope < 0 then Just (ceiling ((current - s0Floor) / abs slope))
                   else Nothing
            Just CeilBreach ->
                let slope = taSlope (prTrend pred)
                    current = if null history then s0Floor else last history
                in if slope > 0 then Just (ceiling ((sCeil - current) / slope))
                   else Nothing
            _ -> Nothing

        recommendation = case violation of
            Just FloorBreach -> "Increase " ++ signalId ++ " — approaching sovereign floor"
            Just CeilBreach -> "Moderate " ++ signalId ++ " — approaching sovereign ceiling"
            Nothing -> "Signal nominal — no intervention needed"

    in RiskAssessment
        { raSignalId = signalId
        , raRiskScore = totalRisk
        , raAlertTriggered = totalRisk > riskThreshold
        , raViolationType = violation
        , raBeatsUntilViolation = beatsUntil
        , raRecommendation = recommendation
        }

-- ═══════════════════════════════════════════════════════════════════════
-- VI. MAIN EXECUTION
-- ═══════════════════════════════════════════════════════════════════════

-- | Ingest a new signal reading
ingestSignal :: String -> Double -> PronoiaState -> PronoiaState
ingestSignal signalId value state =
    let histories = psSignalHistories state
        updated = case lookup signalId histories of
            Just existing ->
                map (\(sid, vals) ->
                    if sid == signalId
                    then (sid, take trendWindow (vals ++ [value]))
                    else (sid, vals)
                ) histories
            Nothing -> (signalId, [value]) : histories
    in state { psSignalHistories = updated }

-- | Main PRONOIA execution — predict and assess all tracked signals
executePronoiaPronoetes :: [(String, Double)]  -- ^ New signal readings
                        -> Integer              -- ^ Current beat
                        -> PronoiaState         -- ^ Current state
                        -> PronoiaState
executePronoiaPronoetes signals beat state =
    let -- 1. Ingest all new signals
        ingested = foldl' (\s (sid, val) -> ingestSignal sid val s) state signals

        -- 2. Generate predictions for all tracked signals
        predictions = map (\(sid, history) ->
            predictSignal sid history defaultHorizon
            ) (psSignalHistories ingested)

        -- 3. Assess risk for all signals
        risks = map (\(sid, history) ->
            assessRisk sid history defaultHorizon
            ) (psSignalHistories ingested)

        -- 4. Filter active alerts
        activeAlerts = filter raAlertTriggered risks

    in ingested
        { psPredictions = predictions
        , psRiskAlerts = activeAlerts
        , psTotalPredictions = psTotalPredictions state + toInteger (length predictions)
        , psLastBeat = beat
        }
