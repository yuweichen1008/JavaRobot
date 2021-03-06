/*
 * Modified on Dec. 13, 2016 by Y.W. Chen
 * right reserved by RFVLSI NCTU
 */
public class JavaRobotServo extends SendUDP {

	private static Boolean status = new Boolean(false);

	// Constructor for JavaRobotServo
	public JavaRobotServo() {

	}

	public JavaRobotServo(int i) {
		super((i + 3));// Servo 4: ON / 5: OFF
	}

	public static Boolean makeServo(int index) {
		int[] response = null;
		JavaRobotServo js = new JavaRobotServo(index);
		try {
			response = js.sendint();
			if (response.length == 1) {
				System.out.println("Robot Servo cannot get response, please check the connection or contact  Y.W. Chen");
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (response[6] == 144 && index == 1) {
			status = true;
			System.out.println("Robot Servo ON successfully");
		} else if (response[6] == 144 && index == 2) {
			status = true;
			System.out.println("Robot Servo OFF successfully");
		} else {
			status = false;
		}

		return status;
	}
}
