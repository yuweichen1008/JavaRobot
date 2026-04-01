/*
 * Modified on April 17, 2016 by Y.W. Chen
 * right reserved by RFVLSI NCTU
 */
package rfvlsi.Robot;

import rfvlsi.Robot.RobotCommand.CommandMove;


public class RobotMoveThread extends Thread {

	private RobotPosition targetPosition;
	private JavaRobot robot;
	private int speed;
	boolean isRobotMoveFinished = false;

	public RobotMoveThread(JavaRobot robot, RobotPosition targetPosition, int speedin) {
		this.robot = robot;
		this.targetPosition = targetPosition;
		this.speed = speedin;
	}

	@Override
	public void run() {
		// prepare to move
		//CommandServoOn cmdServoOn = new CommandServoOn();
		//CommandHoldOff cmdHoldOff = new CommandHoldOff();
		//CommandAlertRead cmdAlertRead = new CommandAlertRead();
		long threadId = Thread.currentThread().getId();

		try {
			//cmdAlertRead.sendTo(robot, 10043);// Read Alarm.
			//cmdHoldOff.sendTo(robot, 10044); // Hold off
			//cmdServoOn.sendTo(robot, 10045); // Server on
			CommandMove cmdMove = new CommandMove(this.targetPosition, this.speed);
			System.out.println("Thread ID is Thread-" + threadId);
			cmdMove.sendTo(robot, 10046);
			// int i = 1; //count loop
			while (!(updateRobotMoveFinished())) {
				Thread.sleep(1000);// pause resent command
				// System.out.println("Loop: " + i++); //debug code
			}

		} catch (Exception e) {
			System.out.println("Some Error happened in MoveThread -" + threadId);
			return;
			// e.printStackTrace();
		}

	}

	private boolean updateRobotMoveFinished() throws Exception {
		// this function is not open to users.
		this.isRobotMoveFinished = RobotPosition.isCloseTo(this.targetPosition, this.robot.getCurrentPosition());
		if ((this.isRobotMoveFinished))
			System.out.println("Done!");
		return this.isRobotMoveFinished;

	}

	public void getCurrentPosition() throws Exception {
		//System.out.println("Target Position : ");
		//System.out.println(this.targetPosition.toString());
		System.out.println("Current Position : ");
		System.out.println(this.robot.getCurrentPosition().toString());
	}

	public boolean isRobotMoveFinished() throws Exception {
		// this function is intended to be queried by user.
		//updateRobotMoveFinished();
		if (!(this.isRobotMoveFinished)) {
			System.out.println("Robot hasn't finished.");
		} else {
			System.out.println("Done! Robot've moved to the target. ");
		}
		return this.isRobotMoveFinished;
	}
}
