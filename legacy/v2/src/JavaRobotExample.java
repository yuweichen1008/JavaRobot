/*
 * Modified on Dec. 13, 2016 by Y.W. Chen
 * right reserved by RFVLSI NCTU
 */
public class JavaRobotExample {
	private static Boolean flag = new Boolean(false);
	private static int[] tool;
	private static int speed = 100;

	public static void main(String[] args) throws Exception {
		JavaRobot jr = new JavaRobot();
		// jr.servo(1);
		tool = jr.read();
		System.out.println(jr.getReady());
		jr.moveTo(10,10);
    }
}
