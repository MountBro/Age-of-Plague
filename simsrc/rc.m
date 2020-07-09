function [x, y] = rc(i, j, a)
x = a * (i + 2 * j);
y = - a * i * sqrt(3);
end