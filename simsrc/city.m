classdef city 
    properties 
        tilesIndex = [];
        tiles = {};
        totalPeo;
        totalsick;
        dead;
        educated;
        academyNum = 0;
        wealth = 0;
        techPoint = 0;
        techRatio = 0.1;
        hospitalLevel;
        quarantineLeak;
        exportRatio = 0.5;
    end
    methods
        
        % upgrade tech
        function obj = upgradeTech(obj)
            increment = obj.academyNum * 0.0012 * obj.totalPeo/(( 1 + obj.techPoint )^2);
            obj.techPoint = obj.techPoint + increment;
            %disp(increment);
        end
        
        function obj = sumPopulation(obj)
           N = numTiles(obj);
           obj.totalPeo = 0;
           for k = 1:N
               index = obj.tilesIndex(k, :);
               i = index(1); j = index(2);
               obj.totalPeo = obj.tiles{i, j}.population + obj.totalPeo;
           end
        end
        
        function obj = sick(obj)
           N = numTiles(obj);
           obj.totalsick = 0;
           for k = 1:N
               index = obj.tilesIndex(k, :);
               i = index(1); j = index(2);
               obj.totalsick = obj.tiles{i, j}.infected + obj.totalsick;
           end
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
                obj.quarantineLeak = obj.quarantineLeak * 0.5;
                obj.techPoint = obj.techPoint - 1;
            else
                disp('CANNOT UPGRADE QUARANTINE');
            end
        end
        
        % number of tiles in the city
        function numTiles = numTiles(obj)
           sizeOfIndex = size(obj.tilesIndex);
           numTiles = sizeOfIndex(1); 
           %disp(obj.tilesIndex);
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
        
        % the indexes of the neighboring tiles where citizens haven't been
        % totally slaughtered or located in any quarantine area 
        function neighborIndex = validneighborhood(obj, i, j)
            out = [];
            index = obj.tilesIndex;
            if ismember([i, j+1], index, 'row') && (~obj.tiles{i, j+1}.quarantine) && (obj.tiles{i, j+1}.population > 0)
                out = [out; [i, j+1]];
            end
            if ismember([i-1, j+1], index, 'row') && (~obj.tiles{i-1, j+1}.quarantine) && (obj.tiles{i-1, j+1}.population > 0)
                out = [out; [i-1, j+1]];
            end
            if ismember([i-1, j], index, 'row') && (~obj.tiles{i-1, j}.quarantine) && (obj.tiles{i-1, j}.population > 0)
                out = [out; [i-1, j]];
            end
            if ismember([i, j-1], index, 'row') && (~obj.tiles{i, j-1}.quarantine) && (obj.tiles{i, j-1}.population > 0)
                out = [out; [i, j-1]];
            end
            if ismember([i+1, j-1], index, 'row') && (~obj.tiles{i+1, j-1}.quarantine) && (obj.tiles{i+1, j-1}.population > 0)
                out = [out; [i+1, j-1]];
            end
            if ismember([i+1, j], index, 'row') && (~obj.tiles{i+1, j}.quarantine) && (obj.tiles{i+1, j}.population > 0)
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
            for k = 1:N
               t_index = obj.tilesIndex(k,:);
               i = t_index(1); j = t_index(2);
               t = obj.tiles{i, j};
               if (~t.quarantine && t.population >0 )
                   neighborIndex = validneighborhood(obj, i, j);
                   sizeNeighborIndex = size(neighborIndex);
                   numNeighbor = sizeNeighborIndex(1);
                   if (numNeighbor ~= 0)
                       r = randperm(t.population);
                       leave = r(1:numNeighbor);
                       sickleave = [];
                       for M = 1:numNeighbor
                           sickleave = [sickleave, M];
                       end
                       obj.tiles{i, j}.population = t.population - leave;
                       obj.tiles{i, j}.infected = t.infected - sickleave;
                       for a = 1:numNeighbor
                           neighbor_index = neighborIndex(a, :);
                           in = neighbor_index(1);
                           jn = neighbor_index(2);
                           neighbor = obj.tiles{in, jn};
                           neighbor.population = neighbor.population + 1;
                           if ismember(a,sickleave)
                              neighbor.infected = neighbor.infected + 1;
                           end
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
        
        function obj = virusAttack(obj, virus)
            pos = virus.pos;
            inf = virus.inf;
            s = size(pos);
            N = s(1);            
            for k = 1:N
                row = pos(k, :);
                i = row(1); j = row(2);
                [I, J] = convertIndice(i, j); 
                if (ismember([I, J], obj.tilesIndex, 'row'))
                    obj.tiles{I, J} = obj.tiles{I, J}.underAttack(inf);
                end
            end
        end
            
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
            obj = obj.sumPopulation;
            obj = obj.cure;
            obj = obj.infect;
            obj = obj.populationFlow; 
            obj = obj.refreshProd;
            obj = obj.levelIncome;
            obj = obj.upgradeTech;
            obj = obj.sick;
        end
        % function obj = summonMedicalUnit(obj)
        function obj = sendMedicalUnit(obj, i, j)
            obj.tiles{i, j} = obj.tiles{i, j}.addMedicalUnit;
        end
        
        %function obj = sendWorkerUnit(obj, i, j)
       %     obj.tiles{i, j} = obj.tiles{i, j}.addWorkerUnit;
       % end
        
        function obj = buildH(obj, i, j) % build hospital
            obj.tiles{i, j} = obj.tiles{i, j}.buildHospital;
        end
        function obj = buildA(obj, i, j) % build academy
            obj.academyNum = obj.academyNum + 1;
            obj.tiles{i, j} = obj.tiles{i, j}.buildAcademy;
        end
        
    end
    end
