classdef virus
    properties
        stat
        name
    end
    
    methods
        % construction function
        function obj = virus(pos)
            obj.stat = pos;
        end
        
        function searched = search(obj)
            s = size(obj.stat);
            N = s(1);
            if (N > 1)
                out = [];
                xmin = min(obj.stat(:, 1));
                xmax = max(obj.stat(:, 1));
                ymin = min(obj.stat(:, 2));
                ymax = max(obj.stat(:, 2));
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
               
                    
        % change the virus status according to its neighbour numbers
        function obj = change(obj)
            searched = search(obj);
            sizeOfSearched = size(searched);
            N = sizeOfSearched(1);
            out = [];
            if (N > 0)
                for i = N:1
                    rowSearched = searched(i, :);
                    x = rowSearched(1); y = rowSearched(2);
                    if judgeAlive(obj, x, y)
                        out = [out; [x, y]];
                    end
                end
            end
            obj.stat = out;
        end
       

        function res = judgeAlive(obj, x, y)
            % calculate the nb number
            n = 0;
            for i = 1:6
                nb = calNB(x, y);
                nb_size = size(nb);
                N = nb_size(1);
                for j = 1:N
                    if ismember(nb(j, :), obj.stat, 'row')
                        n = n + 1;
                    end
                end
                disp(n);
            end
            % judge alive or not
            if n >= 3
                res = true;
            else
                res = false;
            end
        end
        
        function render(obj)
            s = size(obj.stat);
            num = s(1);
            a = 1;
            hold on 
            for k = 1:num
                row = obj.stat(k, :);
                i = row(1); j = row(2);
                [x, y] = rc(i, j, a);
                hex = hexagon(x, y, a);
                plot(hex, 'FaceColor', 'magenta', 'FaceAlpha', 1);
            end
        end
            
    end
end







