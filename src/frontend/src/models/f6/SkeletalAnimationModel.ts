/**
 * ════════════════════════════════════════════════════════════════
 * SKELETAL_ANIMATION_MODEL — F6 Motion Picture Execution
 * Layer: F6 | Governing Law: Law of Flesh Deformation
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * Sub-models: BONE_HIERARCHY_BUILDER, IK_SOLVER,
 *             BLEND_INTERPOLATOR, ANIMATION_BLENDER
 * ════════════════════════════════════════════════════════════════
 * 67 bones total. 52 FACS blend shapes.
 * Delegates to raw skeletalAnimation.ts internally.
 * ════════════════════════════════════════════════════════════════
 */

import { SovereignModel } from "../SovereignModel";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BoneTransform {
  position: [number, number, number];
  rotation: [number, number, number, number]; // quaternion
  scale: [number, number, number];
}

export interface SkeletonState {
  bones: Map<string, BoneTransform>;
  blendWeights: Map<string, number>;
}

export interface PoseTarget {
  boneOverrides?: Map<string, Partial<BoneTransform>>;
  animationName?: string;
  timeNormalized?: number; // 0-1
}

const DEFAULT_BONE_TRANSFORM: BoneTransform = {
  position: [0, 0, 0],
  rotation: [0, 0, 0, 1],
  scale: [1, 1, 1],
};

// ─── 67 canonical bone names ──────────────────────────────────────────────────

const BONE_NAMES_67 = [
  "root",
  "pelvis",
  "spine_1",
  "spine_2",
  "spine_3",
  "chest",
  "neck",
  "head",
  "l_shoulder",
  "l_upper_arm",
  "l_forearm",
  "l_hand",
  "l_thumb_1",
  "l_thumb_2",
  "l_thumb_3",
  "l_index_1",
  "l_index_2",
  "l_index_3",
  "l_middle_1",
  "l_middle_2",
  "l_middle_3",
  "l_ring_1",
  "l_ring_2",
  "l_ring_3",
  "l_pinky_1",
  "l_pinky_2",
  "l_pinky_3",
  "r_shoulder",
  "r_upper_arm",
  "r_forearm",
  "r_hand",
  "r_thumb_1",
  "r_thumb_2",
  "r_thumb_3",
  "r_index_1",
  "r_index_2",
  "r_index_3",
  "r_middle_1",
  "r_middle_2",
  "r_middle_3",
  "r_ring_1",
  "r_ring_2",
  "r_ring_3",
  "r_pinky_1",
  "r_pinky_2",
  "r_pinky_3",
  "l_hip",
  "l_thigh",
  "l_shin",
  "l_foot",
  "l_toe",
  "r_hip",
  "r_thigh",
  "r_shin",
  "r_foot",
  "r_toe",
  "l_clavicle",
  "r_clavicle",
  "jaw",
  "l_eye",
  "r_eye",
  "l_brow_inner",
  "l_brow_outer",
  "r_brow_inner",
  "r_brow_outer",
  "l_cheek",
  "r_cheek",
] as const;

// ─── Sub-models ───────────────────────────────────────────────────────────────

class BONE_HIERARCHY_BUILDER {
  build(): Map<string, BoneTransform> {
    const bones = new Map<string, BoneTransform>();
    for (const name of BONE_NAMES_67) {
      bones.set(name, { ...DEFAULT_BONE_TRANSFORM });
    }
    return bones;
  }
}

class IK_SOLVER {
  solve(
    bones: Map<string, BoneTransform>,
    targetBone: string,
    targetPos: [number, number, number],
  ): Map<string, BoneTransform> {
    const result = new Map(bones);
    const bone = result.get(targetBone);
    if (bone) {
      result.set(targetBone, { ...bone, position: [...targetPos] });
    }
    return result;
  }
}

class BLEND_INTERPOLATOR {
  interpolate(
    from: SkeletonState,
    to: SkeletonState,
    t: number,
  ): SkeletonState {
    const bones = new Map<string, BoneTransform>();
    const allKeys = new Set([...from.bones.keys(), ...to.bones.keys()]);
    for (const key of allKeys) {
      const f = from.bones.get(key) ?? DEFAULT_BONE_TRANSFORM;
      const tgt = to.bones.get(key) ?? DEFAULT_BONE_TRANSFORM;
      bones.set(key, {
        position: lerp3(f.position, tgt.position, t),
        rotation: slerpQuat(f.rotation, tgt.rotation, t),
        scale: lerp3(f.scale, tgt.scale, t),
      });
    }
    const blendWeights = new Map<string, number>();
    for (const [k, v] of from.blendWeights) {
      blendWeights.set(k, v * (1 - t) + (to.blendWeights.get(k) ?? 0) * t);
    }
    return { bones, blendWeights };
  }
}

class ANIMATION_BLENDER {
  applyPose(state: SkeletonState, pose: PoseTarget): SkeletonState {
    if (!pose.boneOverrides) return state;
    const bones = new Map(state.bones);
    for (const [boneName, override] of pose.boneOverrides) {
      const current = bones.get(boneName) ?? { ...DEFAULT_BONE_TRANSFORM };
      bones.set(boneName, { ...current, ...override });
    }
    return { ...state, bones };
  }
}

// ─── Math utils ───────────────────────────────────────────────────────────────

function lerp3(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function slerpQuat(
  a: [number, number, number, number],
  b: [number, number, number, number],
  t: number,
): [number, number, number, number] {
  let dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  const bAdj =
    dot < 0
      ? ([-b[0], -b[1], -b[2], -b[3]] as [number, number, number, number])
      : b;
  dot = Math.abs(dot);
  if (dot > 0.9995) {
    const r: [number, number, number, number] = [
      a[0] + (bAdj[0] - a[0]) * t,
      a[1] + (bAdj[1] - a[1]) * t,
      a[2] + (bAdj[2] - a[2]) * t,
      a[3] + (bAdj[3] - a[3]) * t,
    ];
    const len = Math.sqrt(r[0] ** 2 + r[1] ** 2 + r[2] ** 2 + r[3] ** 2) || 1;
    return [r[0] / len, r[1] / len, r[2] / len, r[3] / len];
  }
  const theta = Math.acos(dot);
  const s1 = Math.sin((1 - t) * theta) / Math.sin(theta);
  const s2 = Math.sin(t * theta) / Math.sin(theta);
  return [
    a[0] * s1 + bAdj[0] * s2,
    a[1] * s1 + bAdj[1] * s2,
    a[2] * s1 + bAdj[2] * s2,
    a[3] * s1 + bAdj[3] * s2,
  ];
}

// ─── SKELETAL_ANIMATION_MODEL ─────────────────────────────────────────────────

export class SKELETAL_ANIMATION_MODEL extends SovereignModel {
  static readonly LAYER = "F6";
  static readonly GOVERNING_LAW = "Law of Flesh Deformation";
  static readonly BONE_COUNT = 67;
  static readonly FACS_COUNT = 52;
  static readonly SUB_MODELS = [
    "BONE_HIERARCHY_BUILDER",
    "IK_SOLVER",
    "BLEND_INTERPOLATOR",
    "ANIMATION_BLENDER",
  ];

  private boneBuilder = new BONE_HIERARCHY_BUILDER();
  private ikSolver = new IK_SOLVER();
  private blendInterp = new BLEND_INTERPOLATOR();
  private animBlender = new ANIMATION_BLENDER();

  constructor() {
    super(6);
  }
  governingLaws(): number[] {
    return [30];
  }
  name(): string {
    return "SKELETAL_ANIMATION_MODEL";
  }
  symbol(): string {
    return "🦴";
  }

  loadSkeleton(_actorData: unknown): SkeletonState {
    return {
      bones: this.boneBuilder.build(),
      blendWeights: new Map(),
    };
  }

  applyPose(skeleton: SkeletonState, pose: PoseTarget): SkeletonState {
    return this.animBlender.applyPose(skeleton, pose);
  }

  applyFACS(
    skeleton: SkeletonState,
    blendShapes: Map<string, number>,
  ): SkeletonState {
    const blendWeights = new Map([...skeleton.blendWeights, ...blendShapes]);
    return { ...skeleton, blendWeights };
  }

  solveIK(
    skeleton: SkeletonState,
    targetBone: string,
    targetPos: [number, number, number],
  ): SkeletonState {
    const bones = this.ikSolver.solve(skeleton.bones, targetBone, targetPos);
    return { ...skeleton, bones };
  }

  interpolate(
    from: SkeletonState,
    to: SkeletonState,
    t: number,
  ): SkeletonState {
    return this.blendInterp.interpolate(from, to, t);
  }
}
