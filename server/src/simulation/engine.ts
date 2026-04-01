import { RobotPositionDto, RobotStatus } from "../model/types.js";
import { stepToward } from "./interpolator.js";

// Default safe home position for YASKAWA MH12 (millimeters / 0.0001-degree units)
const HOME: RobotPositionDto = {
  x: 0,
  y: 650,
  z: 1200,
  rx: 0,
  ry: -900000, // -90.0 degrees (tool pointing down)
  rz: 0,
  toolNumber: 0,
  formNumber: 7,
};

// How close is "close enough" to declare movement complete
const POS_TOLERANCE = 1;     // 1 mm
const ROT_TOLERANCE = 1000;  // 0.1 degrees

export class SimulationEngine {
  private current: RobotPositionDto = { ...HOME };
  private target: RobotPositionDto = { ...HOME };
  public status: RobotStatus = {
    servoOn: false,
    moving: false,
    mode: "SIMULATION",
    alert: null,
  };

  // speed: mm/s, tick rate: 20 ms → maxDelta per tick (mm)
  private speedMmPerTick(speed: number): number {
    return (speed * 20) / 1000; // 20 ms tick
  }

  // Rotation moves at same proportional rate (0.0001-deg units per tick)
  private speedRotPerTick(speed: number): number {
    return ((speed * 20) / 1000) * 10000; // scale to rotation units
  }

  tick(speed: number): void {
    if (!this.status.moving) return;

    const maxPos = this.speedMmPerTick(speed);
    const maxRot = this.speedRotPerTick(speed);

    this.current = {
      x: stepToward(this.current.x, this.target.x, maxPos),
      y: stepToward(this.current.y, this.target.y, maxPos),
      z: stepToward(this.current.z, this.target.z, maxPos),
      rx: stepToward(this.current.rx, this.target.rx, maxRot),
      ry: stepToward(this.current.ry, this.target.ry, maxRot),
      rz: stepToward(this.current.rz, this.target.rz, maxRot),
      toolNumber: this.target.toolNumber,
      formNumber: this.target.formNumber,
    };

    if (this.isCloseTo(this.current, this.target)) {
      this.current = { ...this.target };
      this.status = { ...this.status, moving: false };
    }
  }

  private isCloseTo(a: RobotPositionDto, b: RobotPositionDto): boolean {
    return (
      Math.abs(a.x - b.x) <= POS_TOLERANCE &&
      Math.abs(a.y - b.y) <= POS_TOLERANCE &&
      Math.abs(a.z - b.z) <= POS_TOLERANCE &&
      Math.abs(a.rx - b.rx) <= ROT_TOLERANCE &&
      Math.abs(a.ry - b.ry) <= ROT_TOLERANCE &&
      Math.abs(a.rz - b.rz) <= ROT_TOLERANCE
    );
  }

  moveTo(
    target: Omit<RobotPositionDto, "toolNumber" | "formNumber">,
    speed: number,
  ): { ok: boolean; message?: string } {
    if (!this.status.servoOn) {
      return { ok: false, message: "Servo is off. Enable servo before moving." };
    }
    this.target = {
      ...target,
      toolNumber: this.current.toolNumber,
      formNumber: this.current.formNumber,
    };
    this.status = { ...this.status, moving: true };
    return { ok: true };
  }

  servoOn(): void {
    this.status = { ...this.status, servoOn: true, alert: null };
  }

  servoOff(): void {
    this.status = { ...this.status, servoOn: false, moving: false };
  }

  holdOn(): void {
    this.status = { ...this.status, moving: false };
  }

  holdOff(): void {
    // No-op in simulation — hold just pauses movement
  }

  resetAlert(): void {
    this.status = { ...this.status, alert: null };
  }

  getPosition(): RobotPositionDto {
    return { ...this.current };
  }

  getStatus(): RobotStatus {
    return { ...this.status };
  }

  getHome(): RobotPositionDto {
    return { ...HOME };
  }
}
