function [h0, h1, h2, h3, h4, h5, h6] = hexagon7(i, j, a)
[x0, y0] = rc(i, j, a);
[x1, y1] = rc(i, j+1, a);
[x2, y2] = rc(i-1, j+1, a);
[x3, y3] = rc(i-1, j, a);
[x4, y4] = rc(i, j-1, a);
[x5, y5] = rc(i+1, j-1, a);
[x6, y6] = rc(i+1, j,a);
h0 = hexagon(x0, y0, a);
h1 = hexagon(x1, y1, a);
h2 = hexagon(x2, y2, a);
h3 = hexagon(x3, y3, a);
h4 = hexagon(x4, y4, a);
h5 = hexagon(x5, y5, a);
h6 = hexagon(x6, y6, a);
end