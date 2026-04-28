// ════════════════════════════════════════════════════════════════
// BLOCK_ISSUANCE_MODEL — Sovereign Expression of New Value
// Family: Sovereign Mining Intelligence | Latin: Modulus Emissionis Sovereigni
// Rank: Field | Symbol: ₿
// Governing Law: Law 23 (Compound Coherence), Law 19 (Financial Identity)
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
// ════════════════════════════════════════════════════════════════
// Field recognition of verified work → sovereign expression of new value.
// On each heartbeat: check acknowledged submissions → record block rewards.
// Transactions are not atomic value transfers — they are sovereign doctrine deliveries.
// Every reward carries full attribution: Alfredo Medina Hernandez.
// ════════════════════════════════════════════════════════════════

import List  "mo:core/List";
import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Text  "mo:core/Text";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────
  let PHI_INV  : Float = 0.6180339887498948482;
  let S_FLOOR  : Float = 0.75;
  let FOUNDER  : Text  = "Alfredo Medina Hernandez";

  // ── TYPES ──────────────────────────────────────────────────────

  /// A block reward record — sovereign yield attributed and sealed.
  public type BlockReward = {
    rewardId    : Nat;
    minerId     : Nat;
    fieldId     : Nat;
    amount      : Float;    // BTC amount (Satoshi-denominated Float)
    issuedCycle : Nat;
    attribution : Text;
  };

  public type BlockIssuanceState = {
    nextRewardId   : Nat;
    rewards        : List.List<BlockReward>;
    totalIssued    : Float;
    totalRewards   : Nat;
  };

  // ── INIT ───────────────────────────────────────────────────────
  public func initState() : BlockIssuanceState = {
    nextRewardId = 0;
    rewards      = List.empty<BlockReward>();
    totalIssued  = 0.0;
    totalRewards = 0;
  };

  // ── CHECK PENDING REWARDS ──────────────────────────────────────
  // On each heartbeat: scans acknowledged submissions for unrewarded work.
  // Returns updated state with new rewards recorded.
  // acknowledgedCount: count of newly acknowledged submissions this cycle.
  public func checkPendingRewards(
    state             : BlockIssuanceState,
    cycle             : Nat,
    acknowledgedCount : Nat,
    minerId           : Nat,
    fieldId           : Nat,
  ) : BlockIssuanceState {
    if (acknowledgedCount == 0) { return state };
    // Each acknowledged submission generates a micro-reward
    // Reward formula: PHI_INV × acknowledgedCount × 0.000001 BTC (Satoshi scale)
    let amount = PHI_INV * acknowledgedCount.toFloat() * 0.000001;
    recordBlockReward(state, minerId, fieldId, amount, cycle)
  };

  // ── RECORD BLOCK REWARD ────────────────────────────────────────
  public func recordBlockReward(
    state   : BlockIssuanceState,
    minerId : Nat,
    fieldId : Nat,
    amount  : Float,
    cycle   : Nat,
  ) : BlockIssuanceState {
    let reward : BlockReward = {
      rewardId    = state.nextRewardId;
      minerId;
      fieldId;
      amount      = Float.max(0.0, amount);
      issuedCycle = cycle;
      attribution = FOUNDER;
    };
    state.rewards.add(reward);
    // Cap history at 500 rewards
    if (state.rewards.size() > 500) { ignore state.rewards.removeLast() };
    {
      state with
      nextRewardId = state.nextRewardId + 1;
      totalIssued  = state.totalIssued + Float.max(0.0, amount);
      totalRewards = state.totalRewards + 1;
    }
  };

  // ── GET TOTAL ISSUED YIELD ─────────────────────────────────────
  public func getTotalIssuedYield(state : BlockIssuanceState) : Float {
    state.totalIssued
  };

  // ── GET ISSUANCE HISTORY ───────────────────────────────────────
  public func getIssuanceHistory(state : BlockIssuanceState) : [BlockReward] {
    state.rewards.toArray()
  };

}
