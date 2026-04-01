
/*
 * Modified on Feb 3rd, 2016 by Y.W. Chen
 * right reserved by RFVLSI NCTU
 */
import rfvlsi.Robot.JavaRobot;
import rfvlsi.Robot.JavaRobotRotation;
import rfvlsi.Robot.RobotMoveThread;
import rfvlsi.Robot.RobotPosition;

public class JavaRobotExample {

	public static void main(String[] args) throws Exception {
		try {
			// Use case 1: Create Object of JavaRobot and JavaRobotRotation
			JavaRobot jr = new JavaRobot();
			JavaRobotRotation jrr = new JavaRobotRotation(jr);
			// Use case 2: moving
			double rollin  = 100;
			double pitchin = 100;
			double yawin   = 110;
			int speed = 200;
			RobotPosition targetPosition = jrr.generate(rollin, pitchin, yawin);
			RobotMoveThread mThread = jr.moveTo(targetPosition, speed);
			mThread.getCurrentPosition();

			// do other things.
			
			// You can do other program in between.
			System.out.println("TargetPosition : " + targetPosition.toString());

		} catch (NullPointerException e) {
			System.out.println("End!");
		}
	}
}
