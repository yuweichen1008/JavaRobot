import { Router, Request, Response } from "express";
import { SimulationEngine } from "../simulation/engine.js";
import { CommandEntry, MoveRequest } from "../model/types.js";
import { randomUUID } from "crypto";

export function createRobotRouter(engine: SimulationEngine, history: CommandEntry[]) {
  const router = Router();

  function logCommand(type: string, payload: unknown, result: "ok" | "error", message?: string) {
    history.unshift({
      id: randomUUID(),
      timestamp: Date.now(),
      type,
      payload,
      result,
      message,
    });
    if (history.length > 200) history.length = 200;
  }

  // GET /api/v1/robot/position
  router.get("/position", (_req: Request, res: Response) => {
    res.json(engine.getPosition());
  });

  // GET /api/v1/robot/status
  router.get("/status", (_req: Request, res: Response) => {
    res.json(engine.getStatus());
  });

  // POST /api/v1/robot/move
  router.post("/move", (req: Request, res: Response) => {
    const body = req.body as MoveRequest;
    if (!body?.target) {
      res.status(400).json({ error: "Missing target position" });
      return;
    }
    const result = engine.moveTo(body.target, body.speed ?? 100);
    logCommand("MOVE", body, result.ok ? "ok" : "error", result.message);
    if (!result.ok) {
      res.status(400).json({ error: result.message });
      return;
    }
    res.status(202).json({ message: "Move started" });
  });

  // POST /api/v1/robot/servo
  router.post("/servo", (req: Request, res: Response) => {
    const { on } = req.body as { on: boolean };
    if (on) engine.servoOn(); else engine.servoOff();
    logCommand("SERVO", { on }, "ok");
    res.json(engine.getStatus());
  });

  // POST /api/v1/robot/hold
  router.post("/hold", (req: Request, res: Response) => {
    const { active } = req.body as { active: boolean };
    if (active) engine.holdOn(); else engine.holdOff();
    logCommand("HOLD", { active }, "ok");
    res.json(engine.getStatus());
  });

  // POST /api/v1/robot/alert/reset
  router.post("/alert/reset", (_req: Request, res: Response) => {
    engine.resetAlert();
    logCommand("ALERT_RESET", {}, "ok");
    res.json(engine.getStatus());
  });

  // POST /api/v1/robot/home
  router.post("/home", (_req: Request, res: Response) => {
    const home = engine.getHome();
    const result = engine.moveTo(home, 80);
    logCommand("HOME", {}, result.ok ? "ok" : "error", result.message);
    if (!result.ok) {
      res.status(400).json({ error: result.message });
      return;
    }
    res.status(202).json({ message: "Homing started" });
  });

  // GET /api/v1/robot/history
  router.get("/history", (_req: Request, res: Response) => {
    res.json(history);
  });

  // GET /api/v1/system/mode
  router.get("/system/mode", (_req: Request, res: Response) => {
    res.json({ mode: "SIMULATION" });
  });

  return router;
}
