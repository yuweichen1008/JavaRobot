import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.Hashtable;
import java.util.concurrent.Callable;

public class UDPNode2 {
	String host = "192.168.1.130";								//Robot IPAddress
	int port = 10040;    										//Robot Port
	int timeOut = 1000;
	int MAX_BUFFER_LENGTH = 1024;
	byte[] robotCommand = new byte[256];            			//Sending command
	byte[] receiveData = new byte[MAX_BUFFER_LENGTH];			//Received buffer package of data
	int[] data = new int[MAX_BUFFER_LENGTH*8];
	InetAddress robotAddress;
	//Add the static Socket object?
	
	//Modified on 18th, Nov, 2016
	//constructor
	public UDPNode2(int port, int timeOut, byte[] robotCommand) {
		this.port = port;
		this.timeOut = timeOut;
		this.robotCommand = robotCommand;
		try {
			robotAddress = InetAddress.getByName(host);
			System.out.println("Robot IP address : " + robotAddress.getHostAddress());

		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
	}
	public UDPNode2(byte[] robotCommand) {
		this.robotCommand = robotCommand;
		try {
			robotAddress = InetAddress.getByName(host);
			System.out.println("Robot IP address : " + robotAddress.getHostAddress());

		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
	}
	public UDPNode2() {
		try {
			robotAddress = InetAddress.getByName(host);
			System.out.println("Robot IP address : " + robotAddress.getHostAddress());

		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
	}
	
	//Inner class
	

}
