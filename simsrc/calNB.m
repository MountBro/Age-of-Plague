function nb = calNB(x, y)
nb = [x, y+1; x-1, y+1; x-1, y; x, y-1; x+1, y-1; x+1, y];
end
