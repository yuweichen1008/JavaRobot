/*
 * Modified on April 17, 2016 by Y.W. Chen
 * right reserved by RFVLSI NCTU
 */
package rfvlsi.Robot;

import rfvlsi.Robot.RobotCommand.CommandReadPosition;

public class JavaRobot {
	private UDPNode robotNode = new UDPNode();

	private RobotPosition refPosition;
	// the robot should always start at refPosition;

	public RobotPosition getRefPosition() {
		return refPosition;
	}

	public UDPNode getUDPNode() {
		return this.robotNode;
	}

	// Constructor with no value
	public JavaRobot() throws Exception {
		refPosition = getCurrentPosition();
		System.out.println("refPosition is : " + refPosition.toString());
	}

	public synchronized RobotPosition getCurrentPosition() throws Exception {
		// Note; need to use "synchronized" modifier; only one thread can run
		// this method.
		try {
			CommandReadPosition cmdReadPos = new CommandReadPosition();
			return (RobotPosition) cmdReadPos.sendTo(this, (int) (Math.random() * 150) + 10050);
		} catch (NullPointerException e) {
			System.out.println("Can not get RobotPosition.");
			return null;
		}
	}

	public RobotMoveThread moveTo(RobotPosition target, int speed) {
		RobotMoveThread moveThread = new RobotMoveThread(this, target, speed);
		moveThread.start(); // start the new thread to run the run() function.
		return moveThread;
	}
}
