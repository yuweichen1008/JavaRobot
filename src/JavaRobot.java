
public class JavaRobot extends SendUDP {
    private Boolean botinitial = false;
    private Boolean botReady = false;
    private RobotAngle targetAngle = new RobotAngle();
    private RobotAngle otherAngle = new RobotAngle();
    private RobotPosition targetPosition = new RobotPosition();
    private Tool tool = new Tool();
    private int[] intTool = new int[8];
    // Constructor with no value
    public JavaRobot() {
	this.setInitial(false);
	this.setReady(true);
    }

    // Constructor with theta and phi
    public JavaRobot(int theta_in, int phi_in) {
	this.setInitial(false);
	this.setReady(true);
	this.targetAngle = new RobotAngle(theta_in, phi_in);
    }

    private void setReady(Boolean input) {
	this.botReady = input;
    }

    // initialize boolean function
    private void setInitial(Boolean input) {
	this.botinitial = input;
    }

    private boolean getReady() {
	return botReady;
    }

    private boolean getInitial() {
	return botinitial;
    }

    // Before moveTo or move command, we have to initialize first
    public void init() {
	tool.setting(0, 1); // Set Tool number and Form number
	tool.setrX(10); // X
	tool.setrY(23); // Y
	tool.setrZ(12); // Z
	tool.settX(32); // yaw
	tool.settY(32); // pitch
	tool.settZ(0); // Tz
    }

    public void moveTo(int theta, int phi) {
	if (!(botinitial)) {
	    // We have to initialize the JavaRobot first
	    this.setReady(false);
	    RobotReadPosition tg = new RobotReadPosition();
	    try {
		this.intTool = tg.read();
		System.out.println("Move to tool point.");
	    } catch (Exception e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	} else {
	    this.setReady(false);
	    targetAngle.setTheta(theta); // yaw
	    targetAngle.setPhi(phi); // pitch
	    System.out.println("Robot start moving");
	    System.out.printf("Robot is moving to yaw = ", targetAngle.getTheta(), " and pitch = ",
		    targetAngle.getPhi());
	}

    }

    public void test() {
	RobotReadPosition robotread = new RobotReadPosition();
	robotread.read();
    }

    public void move() throws Exception {
	this.setReady(false);
	System.out.println("Robot start moving! ");
	RobotMove robotmove = new RobotMove(targetAngle.getTheta(), targetAngle.getPhi(), intTool);
	System.out.printf("\nRobot is moving to yaw = %d and pitch = %d\n", targetAngle.getTheta(),
		targetAngle.getPhi());
	robotmove.move();
    }

    public Boolean isCloseTo(RobotAngle otherAngle) {
	return (Math.abs(otherAngle.getTheta() - targetAngle.getTheta()) < 0.01)
		&& (Math.abs(otherAngle.getPhi() - targetAngle.getPhi()) < 0.01);
    }

    public Boolean isCloseTo() {
	return (Math.abs(otherAngle.getTheta() - targetAngle.getTheta()) < 0.01)
		&& (Math.abs(otherAngle.getPhi() - targetAngle.getPhi()) < 0.01);
    }

    // Inner class of Tool store information
    class Tool {
	private int toolnumber;
	private int formnumber;
	private int rX;
	private int rY;
	private int rZ;
	private int tX;
	private int tY;
	private int tZ;

	Tool(int[] toolin) {
	    this.toolnumber = toolin[0];
	    this.formnumber = toolin[1];
	    this.rX = toolin[2];
	    this.rY = toolin[3];
	    this.rZ = toolin[4];
	    this.tX = toolin[5];
	    this.tY = toolin[6];
	    this.tZ = toolin[7];
	}

	public Tool() {
	    // TODO Auto-generated constructor stub
	    // Initialize Tool with certain value
	    this.toolnumber = 0;
	    this.formnumber = 1;
	    this.rX = 9999;
	    this.rY = 9999;
	    this.rZ = 9999;
	    this.tX = 9999;
	    this.tY = 9999;
	    this.tZ = 9999;
	}
	public void setting(int inputTool, int inputForm) {
	    this.toolnumber = inputTool;
	    this.formnumber = inputForm;
	}

	public void setrX(int input) {
	    this.rX = input;
	}

	public void setrY(int input) {
	    this.rY = input;
	}

	public void setrZ(int input) {
	    this.rZ = input;
	}

	public void settX(int input) {
	    this.tX = input;
	}

	public void settY(int input) {
	    this.tY = input;
	}

	public void settZ(int input) {
	    this.tZ = input;
	}

	public int getrX() {
	    return this.rX;
	}

	public int getrY() {
	    return this.rY;
	}

	public int getrZ() {
	    return this.rZ;
	}

	public int gettX() {
	    return this.tX;
	}

	public int gettY() {
	    return this.tY;
	}

	public int gettZ() {
	    return this.tZ;
	}

    }

    // Inner class of RobotAngle
    // contains yaw and pitch
    class RobotAngle {

	private int theta;
	private int phi;

	RobotAngle(int theta, int phi) {
	    this.theta = theta;
	    this.phi = phi;
	}

	public RobotAngle() {
	    // TODO Auto-generated constructor stub
	    // Initialize the RobotAngle with (0,0)
	    this.theta = 0;
	    this.phi = 0;
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

    // Inner class of Robot Position
    // contains X, Y and Z
    class RobotPosition {
	private int X;
	private int Y;
	private int Z;
	private int[] robotposi = new int[3];

	RobotPosition(int X, int Y, int Z) {
	    this.X = X;
	    this.Y = Y;
	    this.Z = Z;
	}

	public RobotPosition() {
	    // TODO Auto-generated constructor stub
	    this.X = 0;
	    this.Y = 0;
	    this.Z = 0;
	}

	// basic void to set and get position
	public void setX(int position) {
	    this.X = position;
	}

	public void setY(int position) {
	    this.Y = position;
	}

	public void setZ(int position) {
	    this.Z = position;
	}

	public int[] getPosition() {
	    this.robotposi[1] = X;
	    this.robotposi[2] = Y;
	    this.robotposi[3] = Z;
	    return this.robotposi;
	}
    }

}
