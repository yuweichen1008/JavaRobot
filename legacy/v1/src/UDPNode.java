import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.nio.ByteBuffer;

public class UDPNode {
	String host = "192.168.1.130"; // Robot IPAddress
	private int port = 7000; // Computer's Port
	private int robotPort = 10040; // Robot's Port
	private int timeOut = 1000;
	int MAX_BUFFER_LENGTH = 256;
	byte[] robotCommand = new byte[MAX_BUFFER_LENGTH]; // Sending command
	byte[] receiveData = new byte[MAX_BUFFER_LENGTH]; // Received buffer package
														// of data
	InetAddress robotAddress;

	// constructor
	public UDPNode(int port, int timeOut, byte[] robotCommand) {
		this.robotPort = port;
		this.timeOut = timeOut;
		this.robotCommand = robotCommand;
		try {
			robotAddress = InetAddress.getByName(host);
			// System.out.println("Robot IP address : " +
			// robotAddress.getHostAddress());

		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
	}

	public UDPNode(byte[] robotCommand) {
		this.robotCommand = robotCommand;
		try {
			robotAddress = InetAddress.getByName(host);
			// System.out.println("Robot IP address : " +
			// robotAddress.getHostAddress());

		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
	}

	public UDPNode() {
		// No command send
		try {
			robotAddress = InetAddress.getByName(host);
			// System.out.println("Robot IP address : " +
			// robotAddress.getHostAddress());

		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
	}

	public String submit() throws IOException {
		try {
			DatagramSocket socket = new DatagramSocket(port); // Set
																// send/receive
																// UDP Socket.
			socket.setSoTimeout(timeOut); // Millisecond
			DatagramPacket request = new DatagramPacket(robotCommand, robotCommand.length, robotAddress, robotPort);
			socket.send(request);
			System.out.println("From Local IP address is : " + InetAddress.getLocalHost().getHostAddress());
			System.out.println("Local Port is :¡@" + socket.getLocalPort());
			System.out.println("Set Timeout : " + socket.getSoTimeout());
			String command = new String(request.getData());
			System.out.println("Send command : " + command);
			DatagramPacket response = new DatagramPacket(receiveData, receiveData.length);
			socket.receive(response);
			//debug part
			System.out.println("Message SocketAddress is : " + response.getSocketAddress());
			System.out.println("Message Port is : " + response.getPort());
			//System.out.println("");
			String message = new String(response.getData(), response.getOffset(), response.getLength());
			//debug part
			int num = ByteBuffer.wrap(response.getData()).getInt();
			System.out.println("The response integral is: " + num + "has the length " + response.getLength());
			socket.close();
			return message;
		} catch (UnknownHostException e) {
			e.printStackTrace();
			System.out.println("Please contact Y.W. Chen");
			return null;
		}
	}

}
