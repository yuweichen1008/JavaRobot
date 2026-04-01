
public class Robot_ReadPosition {

	static byte[] command = {};
	private int[] angles;
	private int[] rectangulers;

	private boolean JReady = false;

	// constructor of Robot_ReadPosition
	public Robot_ReadPosition() {

	}

	// basic function to get/set Boolean
	public boolean setJReady(boolean bool) {
		this.JReady = bool;
		return JReady;
	}

	public boolean getJReady() {
		return JReady;
	}

	// basic function to translate the data received
	public int[] byteArrayToInt(byte[] b) {
		int[] transfered = new int[(b.length) / 4];
		for (int j = 0; j < (b.length / 4); j++) {
			transfered[j] = b[(j * 4) + 3] & 0xFF | (b[(j * 4) + 2] & 0xFF) << 8 | (b[(j * 4) + 1] & 0xFF) << 16
					| (b[(j * 4) + 0] & 0xFF) << 24;
		}
		return transfered;
	}

	public byte[] InttoByteArray(int[] inputIntArray) {
		byte[] transfered = new byte[(inputIntArray.length * 4)];
		for (int j = 0; j < inputIntArray.length; j++) {
			transfered[(j * 4)] = (byte) (inputIntArray[j] >> 24);
			transfered[(j * 4) + 1] = (byte) (inputIntArray[j] >> 16);
			transfered[(j * 4) + 2] = (byte) (inputIntArray[j] >> 8);
			transfered[(j * 4) + 3] = (byte) (inputIntArray[j]);
		}
		return transfered;
	}

	public static void main(String[] args) {


	}

}
