classdef virus
    %UNTITLED Summary of this class goes here
    %   Detailed explanation goes here
    
    properties
        stat
        % pos


    end
    
    methods
        % construction function
        function obj = virus()
            obj.stat = [];
        end
        
        % function survFlag = judgeSurv(stat)
        %     survFlag = (status - 2) > 0 ; 
        % end

        % change the virus status according to its neighbour numbers
        function obj = change()
            for i = 1:height(obj.stat)
                obj.stat(i,1) = obj.stat(i,2) > 2 ;
            end
        end

        % this function calculates its neighnours' virus number
        function nb = calNB(x,y)
            % x1=abs(x);
            % y1=abs(y);
            % if (abs(x) > 1) && (abs(y) > 1) 
            nb(1,:) = [x-1,y];
            nb(2,:) = [x-1,y+1];
            nb(3,:) = [x,y-1];
            nb(4,:) = [x,y+1];
            nb(5,:) = [x+1,y-1];
            nb(6,:) = [x+1,y];
            % elseif x1 == 1 && y1 > 1 
            %     nb(1,:) = [x,y-1];
            %     nb(2,:) = [x,y+1];
            %     nb(3,:) = [x+1,y-1];
            %     nb(4,:) = [x+1,y];
            % elseif x1 > 1 && y1 == 1 
            %     nb(1,:) = [x-1,y];
            %     nb(2,:) = [x-1,y+1];
            %     % nb(3,:) = [x,y-1];
            %     nb(3,:) = [x,y+1];
            %     % nb(5,:) = [x+1,y-1];
            %     nb(4,:) = [x+1,y];
            % elseif x1 == 1 && y1 == 1 
            %     % nb(1,:) = [x-1,y];
            %     % nb(2,:) = [x-1,y+1];
            %     % nb(3,:) = [x,y-1];
            %     nb(1,:) = [x,y+1];
            %     % nb(5,:) = [x+1,y-1];
            %     nb(2,:) = [x+1,y];
            % end
        end

        function obj = deriveNB()
            n = mapsz;
            for i = 1:height(obj.stat)
               nb = calNB(obj.stat(i,3),obj.stat(i,4));
               x = obj.stat(i,3);
               y = obj.stat(i,4);
               for j = 1:6
                   if obj.stat( ( (n + 1) * nb(j,1) + 1 + nb(j,2) ) , 1) == true
                        obj.stat(i,2) = obj.stat(i,2) + 1;
                   end
                end

            end

        end

    end

end

