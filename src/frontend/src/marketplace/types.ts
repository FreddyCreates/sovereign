/**
 * Shared SKAI marketplace types.
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */

export type SKAIFamily = "Platform" | "Swarm" | "Domain" | "Micro" | "Fusion";

export interface SKAIOrganism {
  id: string;
  name: string;
  latinName: string;
  family: SKAIFamily;
  colonelKernels: number;
  uses: string[];
  deployed: boolean;
  phiIndex: number;
}
