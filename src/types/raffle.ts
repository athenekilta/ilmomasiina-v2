export interface PhysicsState {
  positions: Array<{
    id: string;
    x: number;
    y: number;
    angle: number;
  }>;
  time: number;
}

export type { RaffleStatus } from "@/generated/prisma/client";

export interface RaffleResult {
  id: string;
  name: string;
  status: "CONFIRMED" | "REJECTED";
}

export interface RaffleParticipant {
  id: string;
  name: string;
  color?: string;
}

export interface Position {
  x: number;
  y: number;
  angle: number;
}

export interface SimulationFrame {
  time: number;
  positions: Position[];
}

export interface SimulationResult {
  frames: SimulationFrame[];
  finalPositions: Array<{
    id: string;
    position: number;
  }>;
}
