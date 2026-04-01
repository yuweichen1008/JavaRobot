import { create } from 'zustand'

export interface RobotPosition {
  x: number; y: number; z: number;
  rx: number; ry: number; rz: number;
  toolNumber: number; formNumber: number;
}

export interface RobotStatus {
  servoOn: boolean;
  moving: boolean;
  mode: 'SIMULATION' | 'HARDWARE';
  alert: string | null;
}

export interface CommandEntry {
  id: string;
  timestamp: number;
  type: string;
  payload: unknown;
  result: 'ok' | 'error';
  message?: string;
}

interface RobotStore {
  position: RobotPosition;
  status: RobotStatus;
  jointAngles: [number, number, number, number, number, number];
  history: CommandEntry[];
  setPosition: (p: RobotPosition) => void;
  setStatus: (s: RobotStatus) => void;
  setJointAngles: (a: [number, number, number, number, number, number]) => void;
  addHistory: (e: CommandEntry) => void;
}

const HOME_POS: RobotPosition = {
  x: 0, y: 650, z: 1200,
  rx: 0, ry: -900000, rz: 0,
  toolNumber: 0, formNumber: 7,
}

export const useRobotStore = create<RobotStore>((set) => ({
  position: HOME_POS,
  status: { servoOn: false, moving: false, mode: 'SIMULATION', alert: null },
  jointAngles: [0, 0, 0, 0, 0, 0],
  history: [],
  setPosition: (p) => set({ position: p }),
  setStatus: (s) => set({ status: s }),
  setJointAngles: (a) => set({ jointAngles: a }),
  addHistory: (e) => set((state) => ({ history: [e, ...state.history].slice(0, 200) })),
}))
