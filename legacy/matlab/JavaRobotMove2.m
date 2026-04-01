function mThread =  JavaRobotMove2(Xin,Yin,Zin,Roll,Pitch,Yaw,speed, JavaRobot, Tool, RefPosRMatrix)

AssPosi = RobotRotation(deg2rad(Roll),deg2rad(Pitch),deg2rad(Yaw));
AssMatix = AssPosi.getRotationalMatrix();
Rxyz =  RobotRotation.createRobotRotationFromRotationalMatrix(AssMatix);
TargetMatrix = mtimes(AssMatix,RefPosRMatrix);
if ( cos(Rxyz.Ry) > 0)
    TargetPosition = RobotRotation.createRobotRotationFromRotationalMatrix(TargetMatrix);
else
    TargetPosition = RobotRotation.createRobotRotationFromRotationalMatrix2(TargetMatrix);
end
Rx_result = rad2deg(TargetPosition.Rx*10000);
Ry_result = rad2deg(TargetPosition.Ry*10000);
Rz_result = rad2deg(TargetPosition.Rz*10000);
X = Tool.getX() + Xin*100;
Y = Tool.getY() + Yin*100;
Z = Tool.getZ() + Zin*100;


TargetPosition = rfvlsi.Robot.RobotPosition(X,Y,Z,Rx_result,Ry_result,Rz_result);
mThread = JavaRobot.moveTo(TargetPosition, speed);

end