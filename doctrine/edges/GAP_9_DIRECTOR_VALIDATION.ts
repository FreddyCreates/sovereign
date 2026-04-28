/**
 * GAP_9_DIRECTOR_VALIDATION
 * Edge: Director input routed through LAW ENGINE before any organism state mutation
 * Closes: The gap where directorial commands bypass doctrine scoring
 * Enforces: LAW_07_OXYGENATION — every signal passes through doctrine gate
 *
 * Math:
 *   keyword_match_score(text, law) = count(kw ∈ law.keywords | kw ⊆ text_lower) / |law.keywords|
 *   doctrine_alignment(text) = Σ_i(law_i.strength × score_i) / Σ_i(law_i.strength)
 *   input_valid = doctrine_alignment ≥ 0.75
 *
 * Edge cases:
 *   - empty input: reject immediately with helpful feedback
 *   - law with no keywords: skip (divide-by-zero protection)
 *   - no matching keywords anywhere: alignment = 0
 *   - Σ(strength) = 0 (no active laws): alignment = 0 (no gate possible)
 */

// PHI via parseFloat avoids TS precision literal warning
export const PHI: number = parseFloat('1.6180339887498948482');
export const ALIGNMENT_THRESHOLD = 0.75;

export interface ActiveLaw {
  id: number;
  name: string;
  strength: number;    // [0, 1] doctrine weight
  keywords: string[];  // case-insensitive match terms
}

export interface LawMatchDetail {
  lawId: number;
  lawName: string;
  score: number;       // [0, 1] match ratio
  matchCount: number;
  totalKeywords: number;
}

export interface DirectorValidationResult {
  gapId: 9;
  input: string;
  alignment: number;          // [0, 1]
  valid: boolean;
  matchDetails: LawMatchDetail[];
  violatedLawIds: number[];
  feedback: string;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
}

/**
 * keywordMatchScore — fraction of law's keywords present in text
 * Case-insensitive substring matching
 * Edge case: law.keywords empty → returns 0, caller skips law
 */
export function keywordMatchScore(text: string, law: ActiveLaw): number {
  if (law.keywords.length === 0) return 0;
  const lower = text.toLowerCase();
  const matches = law.keywords.filter(kw => lower.includes(kw.toLowerCase())).length;
  return matches / law.keywords.length;
}

/**
 * computeDoctrineAlignment — weighted average of keyword scores across all laws
 * Edge cases:
 *   - empty text → 0
 *   - all laws have empty keywords → 0 (no scoring possible)
 *   - Σ(strength) = 0 → 0
 */
export function computeDoctrineAlignment(text: string, laws: ActiveLaw[]): number {
  if (!text.trim()) return 0;

  let numerator = 0;
  let denominator = 0;

  for (const law of laws) {
    if (law.keywords.length === 0) continue; // skip empty-keyword laws
    const score = keywordMatchScore(text, law);
    numerator += law.strength * score;
    denominator += law.strength;
  }

  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * getViolatedLaws — laws with zero keyword resonance
 * A law is "violated" when input has no overlap with any of its keywords
 * Edge case: empty input → all laws violated
 */
export function getViolatedLaws(text: string, laws: ActiveLaw[]): number[] {
  if (!text.trim()) return laws.map(l => l.id);
  return laws
    .filter(l => l.keywords.length > 0 && keywordMatchScore(text, l) === 0)
    .map(l => l.id);
}

/**
 * validateDirectorInput — full validation pipeline
 */
export function validateDirectorInput(
  input: string,
  activeLaws: ActiveLaw[],
): DirectorValidationResult {
  // Edge case: empty input
  if (!input.trim()) {
    return {
      gapId: 9,
      input,
      alignment: 0,
      valid: false,
      matchDetails: [],
      violatedLawIds: activeLaws.map(l => l.id),
      feedback: 'Director input is empty. Provide a doctrine-aligned instruction before proceeding.',
    };
  }

  const alignment = computeDoctrineAlignment(input, activeLaws);
  const valid = alignment >= ALIGNMENT_THRESHOLD;

  const matchDetails: LawMatchDetail[] = activeLaws
    .filter(l => l.keywords.length > 0)
    .map(l => {
      const lower = input.toLowerCase();
      const matchCount = l.keywords.filter(kw => lower.includes(kw.toLowerCase())).length;
      return {
        lawId: l.id,
        lawName: l.name,
        score: matchCount / l.keywords.length,
        matchCount,
        totalKeywords: l.keywords.length,
      };
    });

  const violatedLawIds = getViolatedLaws(input, activeLaws);

  const feedback = valid
    ? `Doctrine alignment ${(alignment * 100).toFixed(1)}% ≥ ${(ALIGNMENT_THRESHOLD * 100).toFixed(0)}% — director input cleared for mutation.`
    : `Alignment ${(alignment * 100).toFixed(1)}% < ${(ALIGNMENT_THRESHOLD * 100).toFixed(0)}% threshold. ` +
      `${violatedLawIds.length} law(s) unresolved. Strengthen intent toward: ` +
      activeLaws
        .filter(l => violatedLawIds.includes(l.id))
        .slice(0, 3)
        .map(l => l.name)
        .join(', ');

  return { gapId: 9, input, alignment, valid, matchDetails, violatedLawIds, feedback };
}

export const GAP_9_DIRECTOR_VALIDATION = {
  gapId: 9,
  name: 'Director Input Doctrine Validation',
  closesLoop: 'Director input → LAW ENGINE alignment gate → organism mutation',
  enforcesLaw: 'LAW_07_OXYGENATION',
  alwaysOn: true as const,
  alignmentThreshold: ALIGNMENT_THRESHOLD,

  execute(input: string, activeLaws: ActiveLaw[]): StateChange {
    const result = validateDirectorInput(input, activeLaws);
    return {
      gapId: 9,
      field: 'directorAlignment',
      delta: result.alignment,
      valid: result.valid,
      rejectionReason: result.valid ? null : result.feedback,
    };
  },

  verify(output: StateChange): boolean {
    return output.gapId === 9;
  },
};

export default GAP_9_DIRECTOR_VALIDATION;
