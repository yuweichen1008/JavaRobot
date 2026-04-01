import java.io.IOException;

public class Robot_ReadRect {

	static String receivedString = null;

	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}

	static byte[] command = { 89, 69, 82, 67, 32, 00, 00, 00, 03, 01, 00, 00, 00, 00, 00, 00, 57, 57, 57, 57, 57, 57,
			57, 57, 117, 00, 101, 00, 00, 01, 00, 00 };

	public void start() throws IOException {
		UDPNode Command = new UDPNode(command);
		receivedString = Command.submit();
	}
}
