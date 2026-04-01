package rfvlsi.Robot;

public class RobotPosition {
	private final int x;
	private final int y;
	private final int z;
	private final int Rx;
	private final int Ry;
	private final int Rz;
	private final int ToolNumber;
	private final int FormNumber;
	
	public RobotPosition(int X, int Y, int Z, int Rx, int Ry, int Rz, int Tool, int Form) {
	    this.x = X;
	    this.y = Y;
	    this.z = Z;
	    this.Rx = Rx;
	    this.Ry = Ry;
	    this.Rz= Rz;
	    this.ToolNumber = Tool;
	    this.FormNumber = Form;
	}
	
	public RobotPosition(int X, int Y, int Z, int Rx, int Ry, int Rz) throws Exception {
		JavaRobot jr = new JavaRobot();
	    this.x = X;
	    this.y = Y;
	    this.z = Z;
	    this.Rx = Rx;
	    this.Ry = Ry;
	    this.Rz= Rz;
	    this.ToolNumber = jr.getCurrentPosition().getTool();
	    this.FormNumber = jr.getCurrentPosition().getForm();
	}
	

	// basic void to set and get position
	public int getX(){
		return this.x;
	}

	public int getY(){
		return this.y;
	}

	public int getZ(){
		return this.z;
	}

	public int getRx(){
		return this.Rx;
	}
	public int getRy(){
		return this.Ry;
	}
	
	public int getRz() {
	    return this.Rz; 
	}

	public int getTool(){
		return this.ToolNumber;
	}
	
	public int getForm(){
		return this.FormNumber;
	}
	public static boolean isCloseTo(RobotPosition targetPosition, RobotPosition currentPosition) {
		/* 
		 * original boolean function
		boolean test;
		test = (Math.abs(Math.abs(currentPosition.getX()) - Math.abs(targetPosition.getX())) <= 100) // 0.1 mm
				&& (Math.abs(Math.abs(currentPosition.getY()) - Math.abs(targetPosition.getY())) <= 100) // 0.1 mm
				&& (Math.abs(Math.abs(currentPosition.getZ()) - Math.abs(targetPosition.getZ())) <= 100) // 0.1 mm
				&& (Math.abs(Math.abs(currentPosition.getRx()) - Math.abs(targetPosition.getRx())) <= 1000) // 0.1 degree = 1000* 0.0001 degree
				&& (Math.abs(Math.abs(currentPosition.getRy()) - Math.abs(targetPosition.getRy())) <= 1000) // 0.1 degree = 1000* 0.0001 degree
				&& (Math.abs(Math.abs(currentPosition.getRz()) - Math.abs(targetPosition.getRz())) <= 1000); // 0.1 degree = 1000* 0.0001 degree
		 */
		
		boolean isIdenticalMatrix = false;
		
		double Target_rX = (double) targetPosition.getRx() / (double) 10000;
		double Target_rY = (double) targetPosition.getRy() / (double) 10000;
		double Target_rZ = (double) targetPosition.getRz() / (double) 10000;
		double Curr_rX = (double) currentPosition.getRx() / (double) 10000;
		double Curr_rY = (double) currentPosition.getRy() / (double) 10000;
		double Curr_rZ = (double) currentPosition.getRz() / (double) 10000;
		
		// create RobotRotation object for target and current position
		RobotRotation tagRobotRotation = new RobotRotation(Target_rX, Target_rY, Target_rZ);
		RobotRotation curRobotRotation = new RobotRotation(Curr_rX, Curr_rY, Curr_rZ);
		
		// generate the rotational matrix for target and reference
		double[][] tagRotationalMatrix = RobotRotation.getRotationalMatrix(tagRobotRotation);
		double[][] curRotationalMatrix = RobotRotation.getRotationalMatrix(curRobotRotation);
		
		//transpose the target rotational matrix
		tagRotationalMatrix = RobotRotation.transposeMatrix(tagRotationalMatrix);
		
		double[][] resultMatrix = RobotRotation.multMatrix(curRotationalMatrix, tagRotationalMatrix);
		// check whether the current and target matrix's multiple matrix is identical
		isIdenticalMatrix = RobotRotation.isIdenticalMatrix(resultMatrix);
		
		return isIdenticalMatrix;
	
	/*
	 * Original boolean code in Matlab
	 * 
    Tx = Data(1)/10^2;          % 0.01  degree
    Ty = Data(2)/10^2;          % 0.01  degree
    Tz = Data(3)/10^2;          % 0.01  degree
    %pitch value
    if abs(Tz) <= abs(Tx)
        pitch = -(9000 + Ty);            %pitch < 0
    elseif abs(Tz) > abs(Tx)
        pitch = (9000 + Ty);           %pitch > 0
    end
    %yaw value
    if Tx >= 0 &&  Tx*Tz >= 0         %Tx >0 && Tz > 0
        Yaw_total = Tx + Tz;
        yaw = Yaw_total - 18000;
    elseif Tx< 0 && Tz >= 0          %Tx <0 && Tz > 0
        if abs(Tx) > abs(Tz)
            yaw = (18000 + Tz) - abs(Tx);
        else
            yaw = Tz -(18000 - Tx);
        end
    elseif Tx> 0 && Tz < 0          %Tx <0 && Tz > 0 
        if abs(Tz) > abs(Tx)
            yaw = Tx + (18000 - abs(Tz)); %%%%%Ke
        else
            yaw = -(18000 - Tx - Tz);%%%%Ke
        end
    elseif Tx < 0 && Tz < 0         %Tx < 0 Tz  < 0
        Yaw_total = Tx + Tz;
        yaw = Yaw_total + 18000;
    end
	 */
	}
	public String toString(){
		StringBuilder sb=new StringBuilder();
		sb.append(" X is : " + this.getX());
		sb.append(", Y is : " + this.getY());
		sb.append(", Z is : " + this.getZ());
		sb.append(", Roll (Rx) is : "+this.getRx());
		sb.append(", Pitch (Ry): "+this.getRy());
		sb.append(", Yaw (Rz): "+this.getRz());
		return sb.toString();
	}
}
