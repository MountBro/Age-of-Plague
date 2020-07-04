c = city (5, 5, 200);

for i = 1:10
    for j = 1:10
        if (i ~= 5 || j ~= 5)
            c.tilesIndex = [c.tilesIndex; [i, j]];
            t = tile(2 * i - j, i + 3 * j, 100); 
            t.infected = 2 * rand();
            t.productivity = 10 * rand(); % initialize wealth
            c.tiles{i, j} = t;
        end
    end
end



figure(1)
c.render
for cnt = 1:20
    c = c.populationFlow;
    c = c.infect;
end
figure(2)
c.render
for cnt = 1:20
    c = c.populationFlow;
    c = c.infect;
end
figure(3)
c.render
