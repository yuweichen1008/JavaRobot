// Integer units matching original RobotPosition.java conventions:
//   position: mm (whole millimeters, e.g. 1234 = 1234 mm)
//   rotation: 0.0001 degrees (e.g. 900000 = 90.0 degrees)
export interface RobotPositionDto {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  toolNumber: number;
  formNumber: number;
}

export interface RobotStatus {
  servoOn: boolean;
  moving: boolean;
  mode: "SIMULATION" | "HARDWARE";
  alert: string | null;
}

export interface RobotStateMessage {
  type: "POSITION_UPDATE";
  timestamp: number;
  robotId: string;
  position: RobotPositionDto;
  status: RobotStatus;
}

export interface MoveRequest {
  target: Omit<RobotPositionDto, "toolNumber" | "formNumber">;
  speed: number; // 1-200 mm/s equivalent
}

export interface CommandEntry {
  id: string;
  timestamp: number;
  type: string;
  payload: unknown;
  result: "ok" | "error";
  message?: string;
}
