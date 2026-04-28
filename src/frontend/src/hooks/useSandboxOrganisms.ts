/**
 * useSandboxOrganisms — React Query hooks for Sandbox Intelligence Organisms
 * PHI = 1.6180339887 · S0_FLOOR = 0.75 · © Alfredo Medina Hernandez
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  SandboxOrganismId,
  SandboxOrganismState,
  SandboxResearchDocument,
  SandboxSignal,
  SurgeAheadMode,
  TrendingWorldSignal,
} from "../backend";
import { useActor } from "./useActor";

export type {
  SandboxOrganismId,
  SandboxOrganismState,
  SandboxResearchDocument,
  SandboxSignal,
  SurgeAheadMode,
  TrendingWorldSignal,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useBackend() {
  const { actor, isFetching } = useActor();
  return { actor: actor as any, isFetching };
}

/** All 8 sandbox organism states. Polls every 30s. */
export function useSandboxOrganisms() {
  const { actor, isFetching } = useBackend();
  return useQuery<SandboxOrganismState[]>({
    queryKey: ["sandboxOrganisms"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSandboxOrganisms();
    },
    enabled: !isFetching,
    refetchInterval: 30000,
    placeholderData: (prev: SandboxOrganismState[] | undefined) => prev,
  });
}

/** Single organism, polling every 10s. */
export function useSandboxOrganism(id: SandboxOrganismId) {
  const { actor, isFetching } = useBackend();
  return useQuery<SandboxOrganismState | null>({
    queryKey: ["sandboxOrganism", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSandboxOrganism(id);
    },
    enabled: !isFetching,
    refetchInterval: 10000,
    placeholderData: (prev: SandboxOrganismState | null | undefined) =>
      prev ?? null,
  });
}

/** Research documents, optional organism filter. */
export function useResearchDocuments(orgId?: SandboxOrganismId) {
  const { actor, isFetching } = useBackend();
  return useQuery<SandboxResearchDocument[]>({
    queryKey: ["researchDocuments", orgId ?? "all"],
    queryFn: async () => {
      if (!actor) return [];
      if (orgId) return actor.getResearchDocuments(orgId);
      return actor.getAllResearchDocuments();
    },
    enabled: !isFetching,
    refetchInterval: 30000,
    placeholderData: (prev: SandboxResearchDocument[] | undefined) => prev,
  });
}

/** Trending world signals. Polls every 15s. */
export function useTrendingWorldSignals() {
  const { actor, isFetching } = useBackend();
  return useQuery<TrendingWorldSignal[]>({
    queryKey: ["trendingWorldSignals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrendingWorldSignals();
    },
    enabled: !isFetching,
    refetchInterval: 15000,
    placeholderData: (prev: TrendingWorldSignal[] | undefined) => prev,
  });
}

/** Current signals for one organism. */
export function useSandboxSignals(orgId: SandboxOrganismId) {
  const { actor, isFetching } = useBackend();
  return useQuery<SandboxSignal[]>({
    queryKey: ["sandboxSignals", orgId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSandboxSignals(orgId);
    },
    enabled: !isFetching,
    refetchInterval: 10000,
    placeholderData: (prev: SandboxSignal[] | undefined) => prev,
  });
}

/** Mutation to manually trigger a single organism cycle. */
export function useTriggerSandboxCycle() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<SandboxOrganismState, Error, SandboxOrganismId>({
    mutationFn: async (orgId: SandboxOrganismId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.triggerSandboxCycle(orgId);
    },
    onSuccess: (_data, orgId) => {
      qc.invalidateQueries({ queryKey: ["sandboxOrganisms"] });
      qc.invalidateQueries({ queryKey: ["sandboxOrganism", orgId] });
      qc.invalidateQueries({ queryKey: ["sandboxSignals", orgId] });
      qc.invalidateQueries({ queryKey: ["researchDocuments", orgId] });
    },
  });
}

/** Mutation to trigger all organisms. */
export function useTriggerAllCycles() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<SandboxOrganismState[]>({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.triggerAllSandboxCycles();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sandboxOrganisms"] });
      qc.invalidateQueries({ queryKey: ["trendingWorldSignals"] });
      qc.invalidateQueries({ queryKey: ["researchDocuments"] });
    },
  });
}

/** Mutation to generate a research document for a specific organism. */
export function useGenerateResearchDoc() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<SandboxResearchDocument, Error, SandboxOrganismId>({
    mutationFn: async (orgId: SandboxOrganismId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.generateResearchDocumentForOrg(orgId);
    },
    onSuccess: (_data, orgId) => {
      qc.invalidateQueries({ queryKey: ["researchDocuments", orgId] });
      qc.invalidateQueries({ queryKey: ["researchDocuments", "all"] });
      qc.invalidateQueries({ queryKey: ["sandboxOrganism", orgId] });
    },
  });
}

/** Mutation to activate Surge Ahead mode. */
export function useActivateSurgeAhead() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<boolean>({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.activateSurgeAhead();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["surgeAheadMode"] });
    },
  });
}

/** Current Surge Ahead mode state. Polls every 30s. */
export function useSurgeAheadMode() {
  const { actor, isFetching } = useBackend();
  return useQuery<SurgeAheadMode>({
    queryKey: ["surgeAheadMode"],
    queryFn: async () => {
      if (!actor) return { enabled: false, activatedAt: 0n, releaseCount: 0n };
      return actor.getSurgeAheadMode();
    },
    enabled: !isFetching,
    refetchInterval: 30000,
    placeholderData: (prev: SurgeAheadMode | undefined) => prev,
  });
}
