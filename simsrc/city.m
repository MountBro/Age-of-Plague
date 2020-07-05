classdef city 
    properties 
        tilesIndex = [];
        tiles = {};
        centerPosition
        centerPopulation
        educated
        academyNum = 0;
        wealth = 0;
        techPoint = 0;
        hospitalLevel
        quarantineLeek
        exportRatio = 0.05;
        
    end
    methods
        % constructor
        function obj = city (I, J, population)
            obj.centerPosition = [I, J];
            obj.centerPopulation = population;
        end 
        
        % upgrade tech
        function obj = upgradeTech(obj, increment)
            obj.techPoint = obj.techPoint + increment;
        end
        
        % upgrade curing ability of hospitals
        function obj = upgradeHospitalLevel(obj, increment)
            if (obj.techPoint >= 1)
            obj.hospitalLevel = obj.hospitalLevel + increment;
            obj.techPoint = obj.techPoint - 1;
            else
                disp('techPoint=0, cannot upgrade')
            end
        end
        
        % upgrade reliability of qurantine zones
        function obj = upgradeQuarantine(obj)
            if (obj.techPoint >= 1)
                obj.quarantineLeek = obj.quarantineLeek * 0.5;
                obj.techPoint = obj.techPoint - 1;
            else
                disp('CANNOT UPGRADE QUARANTINE');
            end
        end
        
        % number of tiles in the city
        function numTiles = numTiles(obj)
           sizeOfIndex = size(obj.tilesIndex);
           numTiles = sizeOfIndex(1); 
        end
        
        % the indexes of the neighboring tiles of a tile
        function neighborIndex = neighborhood(obj, i, j)
            out = [];
            index = obj.tilesIndex;
            if ismember([i, j+1], index, 'row')
                out = [out; [i, j+1]];
            end
            if ismember([i-1, j+1], index, 'row')
                out = [out; [i-1, j+1]];
            end
            if ismember([i-1, j], index, 'row')
                out = [out; [i-1, j]];
            end
            if ismember([i, j-1], index, 'row')
                out = [out; [i, j-1]];
            end
            if ismember([i+1, j-1], index, 'row')
                out = [out; [i+1, j-1]];
            end
            if ismember([i+1, j], index, 'row')
                out = [out; [i+1, j]];
            end         
            neighborIndex = out;
        end
        
        % the indexes of the richer neighboring tiles of a tile
        function neighborIndex = richNeighborhood(obj, i, j)
            out = [];
            index = obj.tilesIndex;
            tile = obj.tiles{i, j};           
            w = tile.productivity;
            if ismember([i, j+1], index, 'row') && (obj.tiles{i, j+1}.productivity > w)
                out = [out; [i, j+1]];
            end
            if ismember([i-1, j+1], index, 'row') && (obj.tiles{i-1, j+1}.productivity >w)
                out = [out; [i-1, j+1]];
            end
            if ismember([i-1, j], index, 'row') && (obj.tiles{i-1, j}.productivity > w)
                out = [out; [i-1, j]];
            end
            if ismember([i, j-1], index, 'row') && (obj.tiles{i, j-1}.productivity > w)
                out = [out; [i, j-1]];
            end
            if ismember([i+1, j-1], index, 'row') && (obj.tiles{i+1, j-1}.productivity > w)
                out = [out; [i+1, j-1]];
            end
            if ismember([i+1, j], index, 'row') && (obj.tiles{i+1, j}.productivity > w)
                out = [out; [i+1, j]];
            end         
            neighborIndex = out;
        end
        
        % the indexes of the richer neighboring tiles of a tile that are
        % not put in quarantine
        function neighborIndex = richValidNeighborhood(obj, i, j)
            out = [];
            index = obj.tilesIndex;
            tile = obj.tiles{i, j};           
            w = tile.productivity;
            if ismember([i, j+1], index, 'row') && (obj.tiles{i, j+1}.productivity > w) && (~obj.tiles{i, j+1}.quarantine)
                out = [out; [i, j+1]];
            end
            if ismember([i-1, j+1], index, 'row') && (obj.tiles{i-1, j+1}.productivity >w) && (~obj.tiles{i-1, j+1}.quarantine)
                out = [out; [i-1, j+1]];
            end
            if ismember([i-1, j], index, 'row') && (obj.tiles{i-1, j}.productivity > w) && (~obj.tiles{i-1, j}.quarantine)
                out = [out; [i-1, j]];
            end
            if ismember([i, j-1], index, 'row') && (obj.tiles{i, j-1}.productivity > w) && (~obj.tiles{i, j-1}.quarantine)
                out = [out; [i, j-1]];
            end
            if ismember([i+1, j-1], index, 'row') && (obj.tiles{i+1, j-1}.productivity > w) && (~obj.tiles{i+1, j-1}.quarantine)
                out = [out; [i+1, j-1]];
            end
            if ismember([i+1, j], index, 'row') && (obj.tiles{i+1, j}.productivity > w) && (~obj.tiles{i+1, j}.quarantine)
                out = [out; [i+1, j]];
            end         
            neighborIndex = out;
        end
        
        
        
        % population flow according to economy status               
        function obj = populationFlow(obj)
            N = numTiles(obj);
            
            % enumerate neighboring tiles
            for l = 1:N
               t_index = obj.tilesIndex(l,:);
               i = t_index(1); j = t_index(2);
               t = obj.tiles{i, j};
               if (~t.quarantine)
                   neighborIndex = richValidNeighborhood(obj, i, j);
                   sizeNeighborIndex = size(neighborIndex);
                   numNeighbor = sizeNeighborIndex(1);          
                   if (numNeighbor ~= 0)
                       obj.tiles{i, j}.population = t.population - obj.exportRatio*t.population;
                       obj.tiles{i, j}.infected = t.infected - obj.exportRatio*t.infected;
                       for a = 1:numNeighbor
                           neighbor_index = neighborIndex(a, :);
                           in = neighbor_index(1);
                           jn = neighbor_index(2);
                           neighbor = obj.tiles{in, jn};
                           neighbor.population = neighbor.population + obj.exportRatio*t.population/numNeighbor;
                           neighbor.infected = neighbor.infected + obj.exportRatio*t.infected/numNeighbor;
                           obj.tiles{in, jn} = neighbor;                      
                       end
                   end
               end
            end
            
        end
        
        function obj = infect(obj)
           N = numTiles(obj);
           for k = 1:N
               index = obj.tilesIndex(k, :);
               i = index(1); j = index(2);
               obj.tiles{i, j} = obj.tiles{i, j}.tileInfect;
           end
        end
        
        function render(obj)
            sizeOfIndex = size(obj.tilesIndex);
            numTiles = sizeOfIndex(1);
            for k = 1:numTiles
                index = obj.tilesIndex(k, :);
                i = index(1); j = index(2);
                obj.tiles{i, j}.render;
            end 
        end
        
        % function obj = virusAttack(obj, virus);
        function obj = setQ(obj, i, j)
            obj.tiles{i,j} = obj.tiles{i, j}.setQuarantine;
        end
        
        function obj = cancelQ(obj, i, j)
            obj.tiles{i, j} = obj.tiles{i, j}.cancelQuarantine;
        end
        
        function obj = levelIncome(obj)
            N = numTiles(obj);
            for k = 1:N
                index = obj.tilesIndex(k, :);
                i = index(1); j = index(2);
                obj.wealth = obj.wealth + obj.tiles{i, j}.productivity;
            end
        end
        
        function obj = refreshProd(obj)
            N = numTiles(obj);
            for k = 1:N
                index = obj.tilesIndex(k, :);
                i = index(1); j = index(2);
                obj.tiles{i, j} = obj.tiles{i, j}.refreshProductivity;
            end
        end
        
        function obj = cure(obj)
            N = numTiles(obj);
            for k = 1:N
                index = obj.tilesIndex(k, :);
                i = index(1); j = index(2);
                obj.tiles{i, j} = obj.tiles{i, j}.cureTile;
            end
        end
            
        
        function obj = level(obj)
            obj = obj.cure;
            obj = obj.infect;
            obj = obj.populationFlow; 
            obj = obj.refreshProd;
            obj = obj.levelIncome;
        end
        % function obj = summonMedicalUnit(obj)
        % function obj = sendMedicalUnit(obj, i, j)
        function obj = buildH(obj, i, j) % build hospital
            obj.tiles{i, j} = obj.tiles{i, j}.buildHospital;
        end
        % function obj = buildA(obj, i, j) % build academy
    end
    end
