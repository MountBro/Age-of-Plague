function nb = neighborIndice(i, j)
nb = [i, j+1; i-1, j+1; i-1, j; i, j-1; i+1, j-1; i+1, j];
end
