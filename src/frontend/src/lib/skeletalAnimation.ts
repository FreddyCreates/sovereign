/**
 * skeletalAnimation.ts — Rigged 2D skeletal system for SOVEREIGN AI actors
 *
 * 15-bone standard skeleton. Cubic Bezier pose interpolation at 30fps.
 * PHI = 1.6180339887 drives all joint proportions and pose selection.
 * Attributed to Alfredo Medina Hernandez · Sealed on-chain
 */

import type { SovereignActor } from "../hooks/useActors";

export const PHI = 1.6180339887;

// ─── Core Interfaces ─────────────────────────────────────────────────────────

export interface Bone {
  id: string;
  name: string;
  parentId: string | null;
  x: number; // canvas-space x
  y: number; // canvas-space y
  rotation: number; // radians
  length: number; // pixels
}

export interface Skeleton {
  bones: Map<string, Bone>;
  rootBoneId: string;
  actorId: number;
  width: number;
  height: number;
}

export interface BoneTransform {
  rotation: number;
  x: number;
  y: number;
}

export interface Keyframe {
  time: number; // 0–1 normalized
  boneTransforms: Map<string, BoneTransform>;
  emotionTag: string;
}

// ─── Bone ID constants ────────────────────────────────────────────────────────

export const BONE_IDS = {
  ROOT: "root",
  SPINE_LOWER: "spine_lower",
  SPINE_MID: "spine_mid",
  SPINE_UPPER: "spine_upper",
  NECK: "neck",
  HEAD: "head",
  JAW: "jaw",
  SHOULDER_L: "shoulder_l",
  ARM_L: "arm_l",
  HAND_L: "hand_l",
  SHOULDER_R: "shoulder_r",
  ARM_R: "arm_r",
  HAND_R: "hand_r",
  HIP_L: "hip_l",
  HIP_R: "hip_r",
} as const;

// ─── createActorSkeleton ─────────────────────────────────────────────────────

/**
 * Build a skeleton with PHI-ratio proportions.
 * Head at 0.15*h, shoulders at 0.25*h, spine_mid at 0.38*h,
 * spine_lower at 0.48*h, hips at 0.55*h.
 */
export function createActorSkeleton(
  actor: SovereignActor,
  width: number,
  height: number,
): Skeleton {
  const cx = width / 2;
  const unit = height / PHI; // PHI-scaled body unit

  const boneData: Omit<Bone, "rotation">[] = [
    {
      id: BONE_IDS.ROOT,
      name: "Root",
      parentId: null,
      x: cx,
      y: height * 0.95,
      length: 0,
    },
    {
      id: BONE_IDS.HIP_L,
      name: "Hip Left",
      parentId: BONE_IDS.ROOT,
      x: cx - unit * 0.1,
      y: height * 0.55,
      length: unit * 0.18,
    },
    {
      id: BONE_IDS.HIP_R,
      name: "Hip Right",
      parentId: BONE_IDS.ROOT,
      x: cx + unit * 0.1,
      y: height * 0.55,
      length: unit * 0.18,
    },
    {
      id: BONE_IDS.SPINE_LOWER,
      name: "Spine Lower",
      parentId: BONE_IDS.ROOT,
      x: cx,
      y: height * 0.48,
      length: unit * 0.12,
    },
    {
      id: BONE_IDS.SPINE_MID,
      name: "Spine Mid",
      parentId: BONE_IDS.SPINE_LOWER,
      x: cx,
      y: height * 0.38,
      length: unit * 0.1,
    },
    {
      id: BONE_IDS.SPINE_UPPER,
      name: "Spine Upper",
      parentId: BONE_IDS.SPINE_MID,
      x: cx,
      y: height * 0.28,
      length: unit * 0.08,
    },
    {
      id: BONE_IDS.SHOULDER_L,
      name: "Shoulder Left",
      parentId: BONE_IDS.SPINE_UPPER,
      x: cx - unit * 0.14,
      y: height * 0.25,
      length: unit * 0.14,
    },
    {
      id: BONE_IDS.SHOULDER_R,
      name: "Shoulder Right",
      parentId: BONE_IDS.SPINE_UPPER,
      x: cx + unit * 0.14,
      y: height * 0.25,
      length: unit * 0.14,
    },
    {
      id: BONE_IDS.ARM_L,
      name: "Arm Left",
      parentId: BONE_IDS.SHOULDER_L,
      x: cx - unit * 0.22,
      y: height * 0.38,
      length: unit * 0.15,
    },
    {
      id: BONE_IDS.ARM_R,
      name: "Arm Right",
      parentId: BONE_IDS.SHOULDER_R,
      x: cx + unit * 0.22,
      y: height * 0.38,
      length: unit * 0.15,
    },
    {
      id: BONE_IDS.HAND_L,
      name: "Hand Left",
      parentId: BONE_IDS.ARM_L,
      x: cx - unit * 0.24,
      y: height * 0.52,
      length: unit * 0.07,
    },
    {
      id: BONE_IDS.HAND_R,
      name: "Hand Right",
      parentId: BONE_IDS.ARM_R,
      x: cx + unit * 0.24,
      y: height * 0.52,
      length: unit * 0.07,
    },
    {
      id: BONE_IDS.NECK,
      name: "Neck",
      parentId: BONE_IDS.SPINE_UPPER,
      x: cx,
      y: height * 0.2,
      length: unit * 0.06,
    },
    {
      id: BONE_IDS.HEAD,
      name: "Head",
      parentId: BONE_IDS.NECK,
      x: cx,
      y: height * 0.12,
      length: unit * 0.08,
    },
    {
      id: BONE_IDS.JAW,
      name: "Jaw",
      parentId: BONE_IDS.HEAD,
      x: cx,
      y: height * 0.17,
      length: unit * 0.04,
    },
  ];

  const bones = new Map<string, Bone>();
  for (const bd of boneData) {
    bones.set(bd.id, { ...bd, rotation: 0 });
  }

  return {
    bones,
    rootBoneId: BONE_IDS.ROOT,
    actorId: actor.id,
    width,
    height,
  };
}

// ─── Pose Definitions ─────────────────────────────────────────────────────────

type PoseSet =
  | "NEUTRAL"
  | "OPEN_EXPANSIVE"
  | "CLOSED_RECEPTIVE"
  | "FORWARD_DIRECT"
  | "RELAXED_DEEP"
  | "GESTURE_EMPHATIC"
  | "GESTURE_CONTEMPLATIVE"
  | "GESTURE_RESOLVE";

const POSE_TRANSFORMS: Record<
  PoseSet,
  Record<string, Partial<BoneTransform>>
> = {
  NEUTRAL: {
    spine_mid: { rotation: 0 },
    shoulder_l: { rotation: -0.15 },
    shoulder_r: { rotation: 0.15 },
    arm_l: { rotation: 0.3 },
    arm_r: { rotation: -0.3 },
    head: { rotation: 0 },
  },
  OPEN_EXPANSIVE: {
    spine_mid: { rotation: 0.05 },
    shoulder_l: { rotation: -0.5 },
    shoulder_r: { rotation: 0.5 },
    arm_l: { rotation: 0.6 },
    arm_r: { rotation: -0.6 },
    head: { rotation: -0.05 },
  },
  CLOSED_RECEPTIVE: {
    spine_mid: { rotation: 0.1 },
    shoulder_l: { rotation: -0.05 },
    shoulder_r: { rotation: 0.05 },
    arm_l: { rotation: 0.1 },
    arm_r: { rotation: -0.1 },
    head: { rotation: 0.08 },
  },
  FORWARD_DIRECT: {
    spine_mid: { rotation: -0.08 },
    shoulder_l: { rotation: -0.2 },
    shoulder_r: { rotation: 0.2 },
    arm_l: { rotation: 0.2 },
    arm_r: { rotation: -0.2 },
    head: { rotation: -0.1 },
  },
  RELAXED_DEEP: {
    spine_mid: { rotation: 0.15 },
    shoulder_l: { rotation: -0.1 },
    shoulder_r: { rotation: 0.1 },
    arm_l: { rotation: 0.5 },
    arm_r: { rotation: -0.5 },
    head: { rotation: 0.12 },
  },
  GESTURE_EMPHATIC: {
    spine_mid: { rotation: -0.05 },
    shoulder_l: { rotation: -0.45 },
    shoulder_r: { rotation: 0.6 },
    arm_l: { rotation: 0.7 },
    arm_r: { rotation: -0.9 },
    hand_r: { rotation: -0.4 },
    head: { rotation: -0.06 },
  },
  GESTURE_CONTEMPLATIVE: {
    spine_mid: { rotation: 0.08 },
    shoulder_l: { rotation: -0.2 },
    shoulder_r: { rotation: 0.3 },
    arm_l: { rotation: 0.15 },
    arm_r: { rotation: -0.6 },
    hand_r: { rotation: 0.2 },
    head: { rotation: 0.15 },
  },
  GESTURE_RESOLVE: {
    spine_mid: { rotation: -0.03 },
    shoulder_l: { rotation: -0.3 },
    shoulder_r: { rotation: 0.25 },
    arm_l: { rotation: 0.4 },
    arm_r: { rotation: -0.35 },
    head: { rotation: -0.04 },
  },
};

// ─── selectPoseForEmotion ────────────────────────────────────────────────────

const EMOTION_TO_POSE: Record<string, PoseSet> = {
  joy: "OPEN_EXPANSIVE",
  sorrow: "CLOSED_RECEPTIVE",
  anger: "FORWARD_DIRECT",
  fear: "CLOSED_RECEPTIVE",
  surprise: "OPEN_EXPANSIVE",
  determination: "GESTURE_RESOLVE",
  contempt: "FORWARD_DIRECT",
  revelation: "GESTURE_CONTEMPLATIVE",
  tension: "FORWARD_DIRECT",
  resolution: "RELAXED_DEEP",
  neutral: "NEUTRAL",
};

export function selectPoseForEmotion(
  emotion: string,
  actor: SovereignActor,
): Keyframe {
  const basePoseName = EMOTION_TO_POSE[emotion.toLowerCase()] ?? "NEUTRAL";

  // PHI-ratio personality modulation: actors with higher doctrine score gesture more
  const gestureModifier = actor.doctrineAlignmentScore * 0.3;

  const rawTransforms = POSE_TRANSFORMS[basePoseName];
  const boneTransforms = new Map<string, BoneTransform>();

  for (const [boneId, partial] of Object.entries(rawTransforms)) {
    boneTransforms.set(boneId, {
      rotation:
        ((partial.rotation ?? 0) + gestureModifier * 0.1) % (Math.PI * 2),
      x: partial.x ?? 0,
      y: partial.y ?? 0,
    });
  }

  return {
    time: 0,
    boneTransforms,
    emotionTag: emotion,
  };
}

// ─── interpolatePose — cubic Bezier smoothstep ──────────────────────────────

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

export function interpolatePose(
  fromFrame: Keyframe,
  toFrame: Keyframe,
  t: number,
): Keyframe {
  const st = smoothstep(Math.max(0, Math.min(1, t)));
  const result = new Map<string, BoneTransform>();

  // Union of all bone IDs from both frames
  const allBones = new Set([
    ...fromFrame.boneTransforms.keys(),
    ...toFrame.boneTransforms.keys(),
  ]);

  for (const boneId of allBones) {
    const from = fromFrame.boneTransforms.get(boneId) ?? {
      rotation: 0,
      x: 0,
      y: 0,
    };
    const to = toFrame.boneTransforms.get(boneId) ?? {
      rotation: 0,
      x: 0,
      y: 0,
    };

    result.set(boneId, {
      rotation: from.rotation + (to.rotation - from.rotation) * st,
      x: from.x + (to.x - from.x) * st,
      y: from.y + (to.y - from.y) * st,
    });
  }

  return {
    time: t,
    boneTransforms: result,
    emotionTag: t > 0.5 ? toFrame.emotionTag : fromFrame.emotionTag,
  };
}

// ─── drawSkeleton ─────────────────────────────────────────────────────────────

export function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  skeleton: Skeleton,
  frame: Keyframe,
  color = "rgba(100, 200, 255, 0.7)",
): void {
  const bones = skeleton.bones;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";

  // Draw bones as connected segments from child to parent
  for (const [boneId, bone] of bones) {
    const transform = frame.boneTransforms.get(boneId);
    const bx = bone.x + (transform?.x ?? 0);
    const by = bone.y + (transform?.y ?? 0);
    const rotation = bone.rotation + (transform?.rotation ?? 0);

    if (bone.parentId) {
      const parent = bones.get(bone.parentId);
      if (parent) {
        const pt = frame.boneTransforms.get(bone.parentId);
        const px = parent.x + (pt?.x ?? 0);
        const py = parent.y + (pt?.y ?? 0);

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }
    }

    // PHI-ratio joint circle (radius scaled by bone length / PHI^2)
    const jointR = Math.max(3, bone.length / (PHI * PHI));
    ctx.beginPath();
    ctx.arc(bx, by, jointR, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Direction indicator tick
    if (bone.length > 5) {
      const endX = bx + Math.cos(rotation) * bone.length * 0.3;
      const endY = by + Math.sin(rotation) * bone.length * 0.3;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(endX, endY);
      ctx.globalAlpha = 0.4;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  ctx.restore();
}
