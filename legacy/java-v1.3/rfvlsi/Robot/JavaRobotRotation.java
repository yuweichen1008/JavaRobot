/*
 * Modified on Feb 3rd, 2016 by Y.W. Chen
 * right reserved by RFVLSI NCTU
 */
package rfvlsi.Robot;

public class JavaRobotRotation {
	private JavaRobot javaRobot;
	private int x, y, z;
	private double[][] refRotationalMatrix;

	public JavaRobotRotation(JavaRobot javarobot) throws Exception {
		this.javaRobot = javarobot;
		RobotPosition currentPosition = javaRobot.getCurrentPosition();
		// System.out.println("The absolute(reference) position values are :");
		// System.out.println(currentPosition.toString());
		x = currentPosition.getX();
		y = currentPosition.getY();
		z = currentPosition.getZ();
		// Use case 1: queary current position;
		double rX = (double) currentPosition.getRx() / (double) 10000;
		double rY = (double) currentPosition.getRy() / (double) 10000;
		double rZ = (double) currentPosition.getRz() / (double) 10000;
		RobotRotation refRobotRotation = new RobotRotation(rX, rY, rZ);
		// refRobotRotation.toString();
		refRotationalMatrix = RobotRotation.getRotationalMatrix(refRobotRotation);
		RobotRotation.printMatrix(refRotationalMatrix);// print the matrix
	}

	public RobotPosition generate(double rollin, double pitchin, double yawin) {
		try {
			double roll = rollin; // degree
			double pitch = pitchin; // degree
			double yaw = yawin; // degree
			RobotRotation assignPosi = new RobotRotation(Math.toRadians(roll), Math.toRadians(pitch),
					Math.toRadians(yaw));
			double[][] assignMatix = RobotRotation.getRotationalMatrix(assignPosi);
			double[] Rxyz = RobotRotation.createRobotRotationFromRotationalMatrix(assignMatix);
			double[][] targetMatrix = RobotRotation.multMatrix(assignMatix, refRotationalMatrix);
			double[] targetRxyz = new double[3];
			if (Math.cos(Rxyz[1]) > 0) {
				targetRxyz = RobotRotation.createRobotRotationFromRotationalMatrix(targetMatrix);
			} else {
				targetRxyz = RobotRotation.createRobotRotationFromRotationalMatrix2(targetMatrix);
			}
			int Rx_result = (int) Math.toDegrees(targetRxyz[0]) * 10000;
			int Ry_result = (int) Math.toDegrees(targetRxyz[1]) * 10000;
			int Rz_result = (int) Math.toDegrees(targetRxyz[2]) * 10000;
			RobotPosition returnPosition = new RobotPosition(x, y, z, Rx_result, Ry_result, Rz_result);
			return returnPosition;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

	}

}
