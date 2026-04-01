classdef RobotRotation
    properties
        Rx; % roll angle
        Ry; % pitch angle
        Rz; % yaw angle
    end
    
    methods 
        function obj=RobotRotation(Rx,Ry,Rz)
            obj.Rx=Rx;
            obj.Ry=Ry;
            obj.Rz=Rz; 
        end
        
        function output=getRotationalMatrix(obj)
            Mz=[cos(obj.Rz), -sin(obj.Rz), 0; sin(obj.Rz), cos(obj.Rz), 0; 0,0,1];
            My=[cos(obj.Ry), 0, sin(obj.Ry); 0, 1, 0; -sin(obj.Ry),0,cos(obj.Ry)];
            Mx=[1, 0, 0; 0, cos(obj.Rx), -sin(obj.Rx); 0, sin(obj.Rx), cos(obj.Rx)];
            %[cos(obj.Rz)*cos(obj.Ry), (cos(obj.Rz)*sin(obj.Ry)*sin(obj.Rx)-sin(obj.Rz)*cos(obj.Rx)), (cos(obj.Rz)*sin(obj.Ry)*cos(obj.Rx)+sin(obj.Rz)*sin(obj.Rx))]
            output=Mz*My*Mx; % be careful about the sequence
        end
    end
    methods(Static)
        function result=createRobotRotationFromRotationalMatrix(M) 
            % Note, the cos(Ry) is assuemd positive, and Ry lies between -pi/2 ~ pi/2
            Rz=atan2(M(2,1),M(1,1));
            Ry=atan2(-M(3,1),sqrt(M(3,2)^2+M(3,3)^2));
            Rx=atan2(M(3,2),M(3,3));
            result=RobotRotation(Rx, Ry, Rz);
        end
        function result=createRobotRotationFromRotationalMatrix2(M) 
            % Note, the cos(Ry) is assuemd negative, and Ry lies between -pi/2 ~ pi/2
            Rz=atan2(-M(2,1),-M(1,1));
            Ry=atan2(-M(3,1),-sqrt(M(3,2)^2+M(3,3)^2));
            Rx=atan2(-M(3,2),-M(3,3));
            result=RobotRotation(Rx, Ry, Rz);
        end            
        
    end
end

