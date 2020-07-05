classdef tile
    properties
        position 
        population
        infected 
        construction
        medicalUnitNum = 0;
        quarantine = false;
        academy = false;
        hospital = false;
        hCure = 20;    
        medicalUnit = 0;
        muCure = 10;
        productivity
        infectRate = 0.05;
        a = 1;
    end
    methods
        function obj = tile (i, j, population)
            obj.position = [i,j];
            obj.population = population;
        end
        
        function render(obj)
            i = obj.position (1);
            j = obj.position (2);
            a = obj.a;
            ratio = obj.infected / obj.population;
            color = [1, 1-ratio, 1-ratio];
            black = [0, 0, 0];
            if (obj.hospital)
                centerColor = 'g';
            elseif (obj.academy)
                centerColor = 'y';
            else 
                centerColor = color;
            end
                    
            [h0, h1, h2, h3, h4, h5, h6] = hexagon7(i, j, a);
            if (~obj.quarantine)
                hold on 
                plot(h0, 'FaceColor', centerColor);
                plot(h1, 'FaceColor', color);
                plot(h2, 'FaceColor', color);
                plot(h3, 'FaceColor', color);
                plot(h4, 'FaceColor', color);
                plot(h5, 'FaceColor', color);
                plot(h6, 'FaceColor', color);
                hold off
            else 
                hold on 
                plot(h0, 'FaceColor', black);
                plot(h1, 'FaceColor', black);
                plot(h2, 'FaceColor', black);
                plot(h3, 'FaceColor', black);
                plot(h4, 'FaceColor', black);
                plot(h5, 'FaceColor', black);
                plot(h6, 'FaceColor', black);
                hold off
            end
        end
        
        function obj = tileInfect(obj)
            if obj.infected ^ (1 + obj.infectRate) > obj.population
                obj.infected = obj.population;
            else 
                obj.infected = obj.infected ^ ( 1 + obj.infectRate);
            end
        end
        % function obj = addMedicalUnit(obj)
        % function obj = cure(obj)
        function obj = setQuarantine(obj)
            if (obj.quarantine)
                disp('REDUNDANT OPERATION IN SETQUARANTINE: tile already put in quarantine');
            end
            obj.quarantine = true;
        end
        
        function obj = cancelQuarantine(obj)
            if (~obj.quarantine)
                disp('REDUNDANT OPERATION IN CANCELQUARANTINE: tile not put in quarantine');
            end
            obj.quarantine = false;
        end
        
        function obj = buildHospital(obj)
            if (obj.hospital || obj.academy)
                disp('CANNOT BUILD HOSPITAL')
            else
                obj.hospital = true;
            end
        end
        
        function obj = buildAcademy(obj)
            if (obj.hospital || obj.academy)
                disp('CANNOT BUILD ACADEMY')
            else
                obj.hospital = true;
            end
        end
        
        function obj = addMedicalUnit(obj)
            obj.medicalUnit = obj.medicalUnit + 1;
        end
        
        function obj = cureTile(obj)
            infected_ = obj.infected - obj.hospital * obj.hCure - obj.medicalUnit * obj.muCure;           
            obj.infected = max(0, infected_);
        end
        
        function obj = refreshProductivity(obj)
            obj.productivity = obj.population - obj.infected;
        end
        
        function obj = underAttack(obj, inf)
            obj.infected = min (obj.population, inf + obj.infected);
        end
    end
end