c = city (4,4, 200);

for i = 1:3
    for j = 1:4
        if (i ~= 2 || j ~= 2)
            c.tilesIndex = [c.tilesIndex; [i, j]];
            t = tile(2 * i - j, i + 3*j, 20);  
            t.infected = mod (5* i + 13*j, 21); % initialize infected population
            c.tiles{i, j} = t;
        end
    end
end

c

sizeOfIndex = size(c.tilesIndex);
numTiles = sizeOfIndex(1);
for k = 1:numTiles
    index = c.tilesIndex(k, :);
    i = index(1); j = index(2);
    c.tiles{i, j}.render;
end

