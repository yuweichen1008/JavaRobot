function [JavaRobot, Tool, RefPosRMatrix] = JavaRobotRead()
JavaRobot = rfvlsi.Robot.JavaRobot;
Tool = JavaRobot.getRefPosition();     %Set the original position as X, Y ,Z all = 0
Rxin = Tool.getRx();
Ryin = Tool.getRy();
Rzin = Tool.getRz();
Rx = double(Rxin)/double(10000);
Ry = double(Ryin)/double(10000);
Rz = double(Rzin)/double(10000);

RefPos = RobotRotation(deg2rad(Rx),deg2rad(Ry),deg2rad(Rz));
RefPosRMatrix = RefPos.getRotationalMatrix(); % get the rotational Matrix of RefPos


fprintf('The absolute position values are : \n');
JavaRobot.getCurrentPosition().toString()

end