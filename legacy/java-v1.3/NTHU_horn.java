import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FilenameFilter;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

import rfvlsi.Robot.JavaRobot;
import rfvlsi.Robot.RobotPosition;

public class NTHU_horn {
	private static double rollin;
	private static double pitchin;
	private static double yawin;
	private static int speed = 100; // default value

	public static void main(String[] args) {
		try {
			
			if(args.length == 2 && args[1] == "1"){
				//Read the original position and save it into the txt file
				JavaRobot jr = new JavaRobot();
				RobotPosition original = jr.getRefPosition();
				
				
				
			}else if(args.length == 2 && args[1] == "2"){
				//Rewrite the original position
				
			}else if(args.length == 1){
				
			}
			initialize();
			float[] magnitude = new float[4];
			float[] distance = new float[4];
			
			// get current path
			Path folderPath = Paths.get(args[0]); // path from argument
			//Paths.get("./path/somewhere");  // specify your directory
			File lastModifiedFile = getLatestFilefromDir(folderPath.toString());
			
			System.out.println("File is : " +  lastModifiedFile.toString());
			
			BufferedReader br = null;
			// open the csv file
			try{
				
				FileReader fin = new FileReader(lastModifiedFile.toString());
				br = new BufferedReader(fin);
				String line;
				int i = 0;
				while ((line = br.readLine()) != null) {
				    System.out.println(line);
				    // parse the string to magnitude and distance
				    String[] data = line.split(",");
				    magnitude[i] = Float.parseFloat(data[0]);
				    distance[i] = Float.parseFloat(data[1]);
				}
				fin.close();
				
				
				// Determine which direction and how much should Robot move
				float X = Math.min(magnitude[0],  magnitude[3]); // X  
				float Y = Math.min(magnitude[1], magnitude[2]); // Y
				// Move the robot
				
				
				
			}catch(IOException e){
				e.printStackTrace();
			}
		} catch (Exception e) {
			System.out.println("Cannot have JavaRobot object");
			e.printStackTrace();
		}

	}
	private static File getLatestFilefromDir(String dirPath){
	    File[] files = new File(dirPath).listFiles(new FilenameFilter(){
	    	public boolean accept(File dir,String name){
	    		return name.toLowerCase().endsWith(".csv");
	    	}
	    });
	    // prevent error, doesn't have file
	    if (files == null || files.length == 0) {
	        return null;
	    }

	    File lastModifiedFile = files[0];
	    for (int i = 1; i < files.length; i++) {
	       if (lastModifiedFile.lastModified() < files[i].lastModified()) {
	           lastModifiedFile = files[i];
	       }
	    }
	    return lastModifiedFile;
	}
	private static void initialize() {
		
			// initialize the value
			rollin = 0;
			pitchin = 0;
			yawin = 0;
			speed = 100;
		

	}
}
