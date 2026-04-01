/*
 * Modified on Feb 3rd, 2016 by Y.W. Chen
 * right reserved by RFVLSI NCTU
 */
package rfvlsi.Robot;

public class RobotRotation {
	public double rX;
	public double rY;
	public double rZ;

	public RobotRotation(double rXin, double rYin, double rZin) {
		rX = Math.toRadians(rXin);
		rY = Math.toRadians(rYin);
		rZ = Math.toRadians(rZin);
	}

	public double getRx() {
		return rX;
	}

	public double getRy() {
		return rY;
	}

	public double getRz() {
		return rZ;
	}

	public String toString() {
		System.out.println("Rx  = " + getRx()); // in radians
		System.out.println("Ry  = " + getRy()); // in radians
		System.out.println("Rz  = " + getRz()); // in radians
		return null;

	}

	public static double[][] getRotationalMatrix(RobotRotation obj) {
		double[][] answer = new double[3][3];
		double[][] temp = new double[3][3];
		double Mx[][] = { { 1, 0, 0 }, { 0, Math.cos(obj.getRx()), -Math.sin(obj.getRx()) },
				{ 0, Math.sin(obj.getRx()), Math.cos(obj.getRx()) } };
		double Mz[][] = { { Math.cos(obj.getRz()), -Math.sin(obj.getRz()), 0 },
				{ Math.sin(obj.getRz()), Math.cos(obj.getRz()), 0 }, { 0, 0, 1 } };
		double My[][] = { { Math.cos(obj.getRy()), 0, Math.sin(obj.getRy()) }, { 0, 1, 0 },
				{ -Math.sin(obj.getRy()), 0, Math.cos(obj.getRy()) } };
		temp = multMatrix(Mz, My);
		answer = multMatrix(temp, Mx);
		return answer;

	}

	public static double[][] multMatrix(double[][] a, double[][] b) {
		if (a.length == 0)
			return new double[0][0];
		if (a[0].length != b.length)
			return null; // invalid dimensions

		int n = a[0].length;
		int m = a.length;
		int p = b[0].length;

		double answer[][] = new double[m][p];

		// For loop
		for (int i = 0; i < m; i++) {
			for (int j = 0; j < p; j++) {
				answer[i][j] = 0;
				for (int k = 0; k < n; k++) {
					answer[i][j] += a[i][k] * b[k][j];
				}
			}
		}

		return answer;

	}

	//Matrix transpose
	public static double[][] transposeMatrix(double[][] a){
		if (a.length == 0)
			return null; // invalid dimensions
		
		int row = a.length;
		int col = a[0].length;
		
		double[][] answer = new double[col][row];
		
		for(int i =0; i < col; i ++){
			for(int j = 0; j < row; j ++){
				answer[i][j] = a[j][i];	//simple transpose
			}
		}
		
		return answer;
	}
	
	// Tell whether the matrix is identical
	public static boolean isIdenticalMatrix(double[][] a){
		boolean isIdentical = false;
		
		int row = a.length;
		int col = a[0].length;
		int temp = (int) a[0][0];
		for(int i =0; i< row; i++){
			for(int j =0; j < col; j++){
				isIdentical = (((i == j) && ((int)Math.abs(a[i][j]) == temp)) || ((i != j) && (isZero(a[i][j],0.01)))); 	
				// (if i == j and value == 1 is true) or (if i != j and value == 0)
				if (isIdentical == false){
					return false;
				}
				//go on
			}
		}
		
		return isIdentical;
	}
	
	//check whether double is near to 0 
	public static boolean isZero(double value, double threshold){
	    return Math.abs(value) <= threshold;
	}
	
	public static void printMatrix(double[][] inputMatrix) {
		System.out.println("Matrix[" + inputMatrix.length + "][" + inputMatrix[0].length + "]");
		int rows = inputMatrix.length;
		int columns = inputMatrix[0].length;
		for (int i = 0; i < rows; i++) {
			for (int j = 0; j < columns; j++) {
				System.out.printf("%9.5e ", inputMatrix[i][j]);
			}
			System.out.println();
		}
		System.out.println();

	}

	public static double[] createRobotRotationFromRotationalMatrix(double[][] inputMatix) {
		double[] answerArray = new double[3];
		double Rz = Math.atan2(inputMatix[1][0], inputMatix[0][0]);
		double Ry = Math.atan2(-inputMatix[2][0],
				Math.sqrt(Math.pow(inputMatix[2][1], 2) + Math.pow(inputMatix[2][2], 2)));
		double Rx = Math.atan2(inputMatix[2][1], inputMatix[2][2]);
		answerArray[0] =  Rx;
		answerArray[1] =  Ry;
		answerArray[2] =  Rz;
		return answerArray;
	}

	public static double[] createRobotRotationFromRotationalMatrix2(double[][] inputMatix) {
		double[] answerArray = new double[3];
		double Rz = Math.atan2(inputMatix[1][0], inputMatix[0][0]);
		double Ry = Math.atan2(-inputMatix[2][0],
				Math.sqrt(Math.pow(inputMatix[2][1], 2) + Math.pow(inputMatix[2][2], 2)));
		double Rx = Math.atan2(inputMatix[2][1], inputMatix[2][2]);
		answerArray[0] =  Rx;
		answerArray[1] =  Ry;
		answerArray[2] =  Rz;
		return answerArray;
	}
}
