classdef city 
    properties 
        tiles 
        centerPosition
        centerPopulation
        educated
        wealth
        techPoint = 0;
        hospitalLevel
        quarantineLeek
    end
    methods
        function obj = city (I, J, population)
            obj.centerPosition = [I, J];
            obj.centerPopulation = population;
        end 
        function obj = upgradeTech(obj, increment)
            obj.techPoint = obj.techPoint + increment;
        end 
        function obj = upgradeHospitalLevel(obj, increment)
            if (obj.techPoint >= 1)
            obj.hospitalLevel = obj.hospitalLevel + increment;
            obj.techPoint = obj.techPoint - 1;
            else
                disp('techPoint=0, cannot upgrade')
            end
        end
        function obj = upgradeQuarantine(obj)
            obj.quarantineLeek = obj.quarantineLeek * 0.5;
        end
        % function populationFlow
        % function virusAttack(obj, virus)
    end
end