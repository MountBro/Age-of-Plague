classdef virus

    properties
        stat
        name


    end
    
    methods
        % construction function
        function obj = virus()
            obj.stat = [];
        end

        % change the virus status according to its neighbour numbers
        function obj = change()
            for i = 1:height(obj.stat)
                if ~judgeAlive(obj.stat(i,:))
                    obj.stat(i,:)=[];
                end
            end
        end

        % this function calculates its neighnours' virus number
        function nb = calNB(x,y)
            nb(1,:) = [x-1,y];
            nb(2,:) = [x-1,y+1];
            nb(3,:) = [x,y-1];
            nb(4,:) = [x,y+1];
            nb(5,:) = [x+1,y-1];
            nb(6,:) = [x+1,y];
        end

        % check whether a hex is a member of virus
        function res = ismember(pos)
            for i = 1:height(obj.stat)
                if pos == obj.stat(i,:)
                    break
                end
            end
            res = ~(i == height(obj.stat));
        end


        function res = judgeAlive(x,y)

            % calculate the nb number
            n = 1;
            for i = 1:6
                if ismember(calNB(x,y))
                    n = n + 1;
                end
            end

            % judge alive or not
            if n >= 3
                res = true;
            else
                res = false;
            end

        end

    end

end

