
public class JavaRobot {

	Boolean botReady = false;
	RobotAngle targetAngle; 
	// Constructor with no value
	public JavaRobot() {
		this.targetAngle = new RobotAngle(0,0);
		this.setReady(true);
	}
	// Constructor with theta and phi
	public JavaRobot(int theta_in, int phi_in) {
		this.targetAngle = new RobotAngle(theta_in,phi_in);
		this.setReady(true);
	}


	void setReady(Boolean input) {
		this.botReady = input;
	}
	

	public void moveTo(int theta, int phi) {
		this.setReady(false);
		targetAngle.setTheta(theta);	//yaw
		targetAngle.setPhi(phi);		//pitch
	}

	public Boolean isCloseTo(RobotAngle otherAngle) {
		return (Math.abs(otherAngle.getTheta() - targetAngle.getTheta()) < 0.01)
				&& (Math.abs(otherAngle.getPhi() - targetAngle.getPhi()) < 0.01);
	}
	//Inner class of RobotAngle
	//contains yaw and pitch
	class RobotAngle{

		private int theta;
		private int phi;
		
		RobotAngle(int theta, int phi){
			this.theta=theta;
			this.phi=phi;
		}
		// basic void function set and get angle
		public void setTheta(int angle) {
			this.theta = angle;
		}

		public void setPhi(int angle) {
			this.phi = angle;
		}

		public int getTheta() {
			return this.theta;
		}

		public int getPhi() {
			return this.phi;
		}


	}
	//Inner class of Robot Position
	//contains X, Y and Z 
	class RobotPosition{
		private int X;
		private int Y;
		private int Z;
		private int[] robotposi = new int[3];
		RobotPosition(int X, int Y, int Z){
			this.X = X;
			this.Y = Y;
			this.Z = Z;
		}
		//basic void to set and get position
		public void setX(int position){
			this.X = position;
		}
		public void setY(int position){
			this.Y = position;
		}
		public void setZ(int position){
			this.Z = position;
		}
		public int[] getPosition(){
			this.robotposi[1] = X;
			this.robotposi[2] = Y;
			this.robotposi[3] = Z;
			return this.robotposi;
		}
	}
}
