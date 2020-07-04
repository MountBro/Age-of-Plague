c = city (4,4, 200);

for i = 1:3
    for j = 1:4
        t = tile(2 * i - j, i + 3*j, 20);
        t.infected = mod (5* i + 13*j, 21);
        c.tiles = [c.tiles, t]
    end
end

for i = 1:(length(c.tiles)-1)
    c.tiles(i).render
end

