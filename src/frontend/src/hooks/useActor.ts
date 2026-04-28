// ─── useActor stub ────────────────────────────────────────────────────────────
// This stub is used until pnpm bindgen generates the real useActor hook
// from the deployed canister bindings.
import { useMemo } from "react";
import { mockBackend } from "../mocks/backend";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyActor = Record<string, (...args: any[]) => Promise<any>>;

export function useActor(): { actor: AnyActor | null; isFetching: boolean } {
  const actor = useMemo(() => mockBackend as unknown as AnyActor, []);
  return { actor, isFetching: false };
}
