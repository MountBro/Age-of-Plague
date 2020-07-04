function shape = hexagon (x, y, a)
h = a / sqrt(3);
shape = polyshape([x+a, x, x-a, x-a, x, x+a], [y+h, y+2*h, y+h, y-h, y-2*h, y-h]);
end