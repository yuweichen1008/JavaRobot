import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import { SimulationEngine } from "./simulation/engine.js";
import { createRobotRouter } from "./routes/robot.js";
import { CommandEntry, MoveRequest, RobotStateMessage } from "./model/types.js";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;
const TICK_MS = 20;      // simulation tick: 50 Hz
const BROADCAST_MS = 50; // broadcast to clients: 20 Hz

const app = express();
const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:4173"],
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:4173"] }));
app.use(express.json());

const engine = new SimulationEngine();
const history: CommandEntry[] = [];

// Active speed per robot move (updated when client sends move command)
let currentSpeed = 100;

// REST routes
app.use("/api/v1/robot", createRobotRouter(engine, history));

// Socket.io — real-time control via WebSocket in addition to REST
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Send current state immediately on connect
  socket.emit("robot-state", buildStateMessage());

  // Accept move commands over socket too (for low-latency control)
  socket.on("command", (msg: { type: string; payload: unknown }) => {
    if (msg.type === "MOVE") {
      const req = msg.payload as MoveRequest;
      currentSpeed = req.speed ?? 100;
      engine.moveTo(req.target, currentSpeed);
    } else if (msg.type === "SERVO_ON") {
      engine.servoOn();
    } else if (msg.type === "SERVO_OFF") {
      engine.servoOff();
    } else if (msg.type === "HOME") {
      engine.moveTo(engine.getHome(), 80);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

function buildStateMessage(): RobotStateMessage {
  return {
    type: "POSITION_UPDATE",
    timestamp: Date.now(),
    robotId: "sim-0",
    position: engine.getPosition(),
    status: engine.getStatus(),
  };
}

// Simulation tick loop
setInterval(() => {
  engine.tick(currentSpeed);
}, TICK_MS);

// Broadcast loop
setInterval(() => {
  const state = buildStateMessage();
  io.emit("robot-state", state);
}, BROADCAST_MS);

httpServer.listen(PORT, () => {
  console.log(`JavaRobot server running on http://localhost:${PORT}`);
  console.log(`  REST API:  http://localhost:${PORT}/api/v1/robot`);
  console.log(`  WebSocket: ws://localhost:${PORT} (Socket.io)`);
});
