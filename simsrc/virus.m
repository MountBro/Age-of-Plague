classdef virus
    properties
        inf
        pos
        kill %50 for death rate 50%
        name
    end
    
    methods
        % construction function
        function obj = virus(inf, pos, kill)
            obj.inf = inf;
            obj.pos = pos;
            obj.kill = kill;
        end
        
        function searched = search(obj)
            s = size(obj.pos);
            N = s(1);
            if (N > 1)
                out = [];
                xmin = min(obj.pos(:, 1));
                xmax = max(obj.pos(:, 1));
                ymin = min(obj.pos(:, 2));
                ymax = max(obj.pos(:, 2));
                for i = (xmin-1):(xmax+1)
                    for j = (ymin-1):(ymax+1)
                        out = [out;[i,j]];
                    end
                end
                searched = out;
            else
                searched = [];
            end
                
        end
               
                    
        % change the virus posus according to its neighbour numbers
        function obj = change(obj)
            searched = search(obj);
            sizeOfSearched = size(searched);
            N = sizeOfSearched(1);
            out = [];
            if (N > 0)
                for i = 1 : N
                    rowSearched = searched(i, :);
                    x = rowSearched(1);
                    y = rowSearched(2);
                    if judgeAlive(obj, x, y)
                        out = [out; [x, y]];
                    end
                end
            end
            obj.pos = out;
        end
       

        function res = judgeAlive(obj, x, y)
            % calculate the nb number
            n = 0;
            nbIndice = neighborIndice(x, y);           
            nbIndice_size = size(nbIndice);
            N = nbIndice_size(1);
            for j = 1:N
                if ismember(nbIndice(j, :), obj.pos, 'row')
                    n = n + 1;
                end
            end
            %disp(n);

            % judge alive or not
            if n == 2 || n == 4
                res = true;
            else
                res = false;
            end
        end
        
        function render(obj)
            s = size(obj.pos);
            num = s(1);
            a = 1;
            hold on 
            for k = 1:num
                row = obj.pos(k, :);
                i = row(1); j = row(2);
                [x, y] = rc(i, j, a);
                hex = hexagon(x, y, a);
                plot(hex, 'FaceColor', 'b', 'FaceAlpha', 1);
            end
        end
    end
end







