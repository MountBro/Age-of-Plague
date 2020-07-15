function [I, J] = convertIndice(i, j)
% (i, j) indice of hexagon
% (I, J) indice of tile that includes the hexagon
    J = round ((2 * j - i) / 7);
    I = round ((3 * i + j) / 7);
end
