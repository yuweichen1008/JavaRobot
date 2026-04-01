%%
%Modified by Y.W. Chen 8th March, 2017
%create Java Obj here
%%
%initialize
% methodsview (Java obj) to know how to use the Java class in detail
%***********************IMPORTANT**************************%
%This function will executed once and for all position you are about to use
[JavaRobot, Tool, RefPosRMatrix] = JavaRobotRead();
%%
% Move to Target Position
X = 0;
Y = 0;
Z = 0;
Roll = 0;
Pitch = 0;
Yaw = 0;
speed = 100;
mThread = JavaRobotMove(Roll, Pitch, Yaw, speed, JavaRobot, Tool, RefPosRMatrix);  %Only move angles
mThread2 = JavaRobotMove2(X,Y,Z,Roll, Pitch, Yaw, speed, JavaRobot, Tool, RefPosRMatrix); %Move angles and position
%%
% Ask is there yet?
flag = mThread.isRobotMoveFinished();% throw out boolean function
% flag == 1 : Robot've moved to the target
% flag == 0 : Not yet
