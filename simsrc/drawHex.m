function drawHex (i,j,a)
[x,y] = rc(i,j,a);
hex = hexagon(x,y,a);
fill(hex, [1, 0, 0]);
end