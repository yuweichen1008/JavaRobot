import java.nio.ByteBuffer;
import java.util.Random;

public class SendUDP {
	private int[] ang = new int[2];
	static int[] command = { 89, 00, 69, 00, 00, 82, 67, 32, 00, 5, 89, 00, 69, 00, 00, 82, 67, 32, 00, 5 };
	static byte[] value = null;
	static byte[] received = new byte[256];
	static int port = 9999;
	static int timeOut = 1000;
	static String receivedString = null;
	// static String[] toolPosition = null;// Tool number ,Form ,X ,Y ,Z ,Xr ,Yr
	// ,Zr

	//Note : 
	//Create the construction to replace this static void main later the Beta version
	
	public static void main(String args[]) throws Exception {
		int[] valueofInt;

		SendUDP send = new SendUDP();
		valueofInt = send.generateRandomMunbers();
		value = ByteBuffer.allocate(4).putInt(valueofInt[1]).array();
		UDPNode Command = new UDPNode(port, timeOut, value);
		// String[] position = null;

		receivedString = Command.submit();
		// System.out.println("Client received :" + receivedString);
		// position = udp.toTool(receivedString);
		// System.out.println(position[0]);
	}

	public int[] toTool(byte[] inputByte) {
		int[] tool = new int[7];
		//Edit the Byte to int form
		
		//take out the data and revise into Tool integral array
		return tool;
	}

	public int[] generateRandomMunbers() throws Exception {
		// TODO Auto-generated method stub

		Random randomNumbers = new Random();
		// pick random integer from 100 to 9000
		int yaw = 100 + randomNumbers.nextInt(8900);
		int pitch = 100 + randomNumbers.nextInt(8900);
		ang[0] = yaw;
		ang[1] = pitch;
		// deBug
		System.out.println("ang[0] =" + ang[0] + " and ang[1] = " + ang[1]);
		return ang;
	}

	public int[] byteArrayToInt(byte[] b) {
		int[] transfered = new int[(b.length)/4];
		for(int j=0;j<(b.length/4);j++){
			transfered[j] = b[(j*4)+3] & 0xFF | (b[(j*4)+2] & 0xFF) << 8 | (b[(j*4)+1] & 0xFF) << 16 | (b[(j*4)+0] & 0xFF) << 24;
		}
		return transfered;
	}

	public byte[] InttoByteArray(int[] inputIntArray) {
		byte[] transfered = new byte[(inputIntArray.length * 4)];
		for (int j = 0; j < inputIntArray.length; j++) {
			transfered[(j * 4)] = (byte) (inputIntArray[j] >> 24);
			transfered[(j * 4) + 1] = (byte) (inputIntArray[j] >> 24);
			transfered[(j * 4) + 2] = (byte) (inputIntArray[j] >> 24);
			transfered[(j * 4) + 3] = (byte) (inputIntArray[j] >> 24);
		}

		return transfered;
	}

	public void command(byte[] command2) {
	    //to send the command here
	    
	}
}
