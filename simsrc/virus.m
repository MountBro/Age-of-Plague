classdef virus
    %UNTITLED Summary of this class goes here
    %   Detailed explanation goes here
    
    properties
        pos
        stat


    end
    
    methods
        % construction function
        function obj = virus(where,status)
            obj.pos = where;
            obj.stat = status;
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

    end
end

