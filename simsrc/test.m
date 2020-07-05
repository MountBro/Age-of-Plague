c = city (5, 5, 200);

for i = 1:10
    for j = 1:10
        if (i ~= 5 || j ~= 5)
            c.tilesIndex = [c.tilesIndex; [i, j]];
            t = tile(2 * i - j, i + 3 * j, 100); 
            t.infected = 5 * rand();
            t.productivity = 10 * rand(); % initialize wealth
            c.tiles{i, j} = t;
        end
    end
end



figure(1) % initial condition of the city
c.render
c = c.setQ(3, 4);
c = c.setQ(6, 7);
c = c.setQ(9, 10);
c = c.buildH(3,3);
c = c.buildH(6,6);
c = c.buildH(8,8);
c = c.buildH(1,5);
for cnt = 1:10
    c = c.level
    % c = c.virusAttack(virus);
end
figure(2) % 20 rounds later
c.render
for cnt = 1:10
    c = c.level
end
figure(3) % another 20 rounds later
c.render
