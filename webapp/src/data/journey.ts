export interface Milestone {
  id: string
  date: string
  version: string
  title: string
  description: string
  commitNote?: string
  language: 'java' | 'matlab' | 'text'
  codeSnippet?: string
  snippetLabel?: string
}

export const milestones: Milestone[] = [
  {
    id: 'v1-start',
    date: 'Nov 18, 2016',
    version: 'v1',
    title: 'Hello, robot.',
    description:
      'First commit. The README says exactly: "Hello robot from Nov.18th, 2016". ' +
      'A single Java class with inner classes for position and angle. No proper ' +
      'UDP abstraction — just raw socket calls inlined in the control logic.',
    commitNote: '"Hello robot from Nov.18th, 2016"',
    language: 'java',
    snippetLabel: 'robot/src/JavaRobot.java (v1) — all-in-one, no abstraction',
    codeSnippet: `// v1 — Nov 2016
// Inner classes, no separation of concerns
public class JavaRobot {
    class RobotAngle { double Rx, Ry, Rz; }
    class RobotPosition { double X, Y, Z; RobotAngle angle; }

    DatagramSocket socket;
    InetAddress address;

    public void moveTo(RobotPosition pos) throws Exception {
        // UDP logic mixed directly into movement method
        byte[] cmd = buildPacket(pos);
        socket.send(new DatagramPacket(cmd, cmd.length, address, 10040));
    }
}`,
  },
  {
    id: 'v2-demo',
    date: 'Dec 23, 2016',
    version: 'v2',
    title: 'First successful demo',
    description:
      'Six weeks of debugging UDP byte order, packet formats, and response parsing. ' +
      'The commit message says it all: "Dec23 first successful Demo, fix precision to 0.1 deg/mm". ' +
      'Added separate Servo, Hold, and Alert classes. The robot moved for the first time.',
    commitNote: '"Dec23 first successful Demo, fix precision to 0.1 deg/mm"',
    language: 'java',
    snippetLabel: 'robot2/src/UDPNode.java (v2) — proper UDP abstraction extracted',
    codeSnippet: `// v2 — Dec 2016
// UDPNode extracted as its own class
public class UDPNode {
    InetAddress address = InetAddress.getByName("192.168.2.250");
    int port = 10040;

    public byte[] send(byte[] command) throws Exception {
        DatagramSocket socket = new DatagramSocket();
        socket.send(new DatagramPacket(command, command.length, address, port));
        byte[] buf = new byte[256];
        socket.receive(new DatagramPacket(buf, buf.length));
        socket.close();
        return buf;
    }
}`,
  },
  {
    id: 'v3-stable',
    date: 'Dec 2016 – Jan 2017',
    version: 'v3',
    title: 'Stabilizing isCloseTo()',
    description:
      'Discovered that simple per-axis tolerance checks failed near rotational singularities. ' +
      'Refactored isCloseTo() to compare full 3×3 rotation matrices instead of individual Euler angles. ' +
      'The robot now reliably detects when it has reached its target orientation.',
    language: 'java',
    snippetLabel: 'RobotPosition.java — rotation matrix comparison instead of angle tolerance',
    codeSnippet: `// v3 — improved isCloseTo using rotation matrix comparison
public boolean isCloseTo(RobotPosition target) {
    // Position check (1mm tolerance)
    if (Math.abs(X - target.X) > 10) return false;
    if (Math.abs(Y - target.Y) > 10) return false;
    if (Math.abs(Z - target.Z) > 10) return false;

    // Rotation check via matrix — avoids Euler singularities
    RobotRotation a = new RobotRotation(Rx, Ry, Rz);
    RobotRotation b = new RobotRotation(target.Rx, target.Ry, target.Rz);
    return a.equals(b, 0.001);  // compare matrices, not angles
}`,
  },
  {
    id: 'v13-command-pattern',
    date: 'Feb 2017 – Jan 2018',
    version: 'v1.3',
    title: 'Command pattern & production release',
    description:
      'Complete rewrite. Each robot operation became its own Command class (Move, ServoOn, ' +
      'ServoOff, Hold, Alert). Positions became immutable value objects. A dedicated ' +
      'RobotMoveThread handled async movement. JavaRobot_1.3.jar was compiled and ' +
      'released for lab use in January 2018.',
    commitNote: 'v1.3 JAR compiled — JRE 1.8.0_151, Jan 2018',
    language: 'java',
    snippetLabel: 'Java/rfvlsi/Robot/RobotCommand/CommandMove.java — clean command pattern',
    codeSnippet: `// v1.3 — Feb 2017
// Command pattern: each operation is a class
public class CommandMove extends RobotCommand {
    private final RobotPosition target;
    private final int speed;

    public CommandMove(RobotPosition target, int speed) {
        this.target = target;
        this.speed = speed * 10;  // DX200 speed unit
    }

    @Override
    public byte[] getDatagram() {
        // Cleanly builds the 120-byte MOTOCOM32 UDP packet
        byte[] packet = new byte[120];
        writeHeader(packet);
        writePosition(packet, target);
        writeInt(packet, 96, speed);
        return packet;
    }
}`,
  },
  {
    id: 'matlab',
    date: 'Mar 2017',
    version: 'MATLAB',
    title: 'MATLAB integration for lab use',
    description:
      'Wrapped the Java library in MATLAB functions so researchers could script ' +
      'robot movements without writing Java. JavaRobotRead.m initializes the connection, ' +
      'JavaRobotMove2.m provides 6-DOF Cartesian control. Used in real experiments.',
    language: 'matlab',
    snippetLabel: 'Matlab/JavaRobotMove2.m — 6-DOF control in MATLAB',
    codeSnippet: `% JavaRobotMove2.m — March 2017
% Move robot to target XYZ + RPY from MATLAB
function mThread = JavaRobotMove2(Xin,Yin,Zin,Rxin,Ryin,Rzin,speed,JavaRobot,Tool,RefPosRMatrix)
    RzRyRx = RobotRotation(Rzin*pi/180, Ryin*pi/180, Rxin*pi/180);
    TargetRMatrix = RzRyRx.getRotationalMatrix() * RefPosRMatrix;
    TargetRot = RobotRotation.createRobotRotationFromRotationalMatrix(TargetRMatrix);

    newPos = rfvlsi.Robot.RobotPosition( ...
        Tool.X + Xin*100, Tool.Y + Yin*100, Tool.Z + Zin*100, ...
        int32(TargetRot.Rx*180/pi*10000), ... % convert back to int units
        int32(TargetRot.Ry*180/pi*10000), ...
        int32(TargetRot.Rz*180/pi*10000), ...
        Tool.ToolNumber, Tool.FormNumber);

    mThread = JavaRobot.moveTo(newPos, speed);
end`,
  },
  {
    id: 'web-now',
    date: 'Apr 2026',
    version: 'Web',
    title: 'Modern web simulator',
    description:
      'Eight years later — the same robot, now in a browser. React + Three.js 3D simulation, ' +
      'Node.js backend, analytical IK in TypeScript ported directly from RobotRotation.java. ' +
      'The rotation matrix math is unchanged. Future: ROS bridge, swarm control.',
    language: 'text',
    snippetLabel: 'webapp/src/utils/kinematics.ts — same ZYX rotation math, now in TypeScript',
    codeSnippet: `// kinematics.ts — Apr 2026
// Same ZYX Euler → rotation matrix as RobotRotation.java, 8 years later
function eulerZYX(rx: number, ry: number, rz: number): number[][] {
  const cx = Math.cos(rx), sx = Math.sin(rx)
  const cy = Math.cos(ry), sy = Math.sin(ry)
  const cz = Math.cos(rz), sz = Math.sin(rz)
  return [
    [cz*cy,  cz*sy*sx - sz*cx,  cz*sy*cx + sz*sx],
    [sz*cy,  sz*sy*sx + cz*cx,  sz*sy*cx - cz*sx],
    [-sy,    cy*sx,              cy*cx            ],
  ]
}`,
  },
]
