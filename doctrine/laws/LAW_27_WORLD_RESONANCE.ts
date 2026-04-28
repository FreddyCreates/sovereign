/**
 * LAW_27_WORLD_RESONANCE
 * Law of World Resonance — world response modulates organism's heart rate
 * Layer: Distribution / B1 (Heartbeat)
 *
 * Equation: BPM_modulation = f(social_signal_amplitude)
 *   social_BPM_delta = k_social × log(1 + engagement_amplitude)
 *   k_social = 5.0 (BPM change per log unit of engagement)
 *   new_BPM = clamp(baseline_BPM + social_BPM_delta, BPM_min=40, BPM_max=180)
 *
 *   engagement_amplitude = sqrt(Σ(channel_engagement_i²)) / channel_count
 *   This closes the outer loop: world → signal → organism heartbeat → production rhythm
 */

export const PHI: number = parseFloat('1.6180339887498948482');
export const BASELINE_BPM = 73;        // resting heart rate
export const BPM_MIN = 40;             // physiological floor
export const BPM_MAX = 180;            // physiological ceiling
export const K_SOCIAL = 5.0;           // BPM sensitivity to engagement

export interface ChannelEngagement {
  channel: string; // 'TIKTOK' | 'FILM' | 'COMMERCIAL' etc.
  views: number;
  likes: number;
  shares: number;
}

export interface SovereignState {
  channelEngagements?: ChannelEngagement[];
  baselineBPM?: number;
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  modulatedBPM?: number;
  engagementAmplitude?: number;
  bpmDelta?: number;
}

export function computeEngagementAmplitude(channels: ChannelEngagement[]): number {
  if (channels.length === 0) return 0;
  const sumSq = channels.reduce((s, c) => {
    const score = c.views + c.likes * 2 + c.shares * 5; // weighted engagement
    return s + score * score;
  }, 0);
  return Math.sqrt(sumSq) / channels.length;
}

export function computeBPMModulation(amplitude: number, baseline: number): number {
  const delta = K_SOCIAL * Math.log(1 + amplitude);
  const raw = baseline + delta;
  return Math.min(BPM_MAX, Math.max(BPM_MIN, raw));
}

export const LAW_27_WORLD_RESONANCE = {
  id: 27,
  name: 'Law of World Resonance',
  layer: 'DISTRIBUTION',
  doctrineStrength: 0.9,
  ancientSymbol: '〜', // World wave
  equation: 'BPM = clamp(baseline + k × log(1 + engagement_amplitude), 40, 180)',
  parameters: {
    BASELINE_BPM,
    K_SOCIAL,
    BPM_MIN,
    BPM_MAX,
    loopClosure: 'world → engagement → BPM → production rhythm → world',
  },
  alwaysOn: true as const,

  execute(state: SovereignState): StateChange {
    const channels = Array.isArray(state.channelEngagements) ? state.channelEngagements : [];
    const baseline = typeof state.baselineBPM === 'number' ? state.baselineBPM : BASELINE_BPM;
    const amplitude = computeEngagementAmplitude(channels);
    const modulatedBPM = computeBPMModulation(amplitude, baseline);
    const bpmDelta = modulatedBPM - baseline;

    return {
      gapId: 0,
      field: 'worldModulatedBPM',
      delta: modulatedBPM,
      valid: true,
      rejectionReason: null,
      modulatedBPM,
      engagementAmplitude: amplitude,
      bpmDelta,
    };
  },

  verify(output: StateChange): boolean {
    return typeof output.modulatedBPM === 'number' &&
           output.modulatedBPM >= BPM_MIN &&
           output.modulatedBPM <= BPM_MAX;
  },
};

export default LAW_27_WORLD_RESONANCE;
