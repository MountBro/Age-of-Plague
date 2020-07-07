%% initialize city
c = city ([1, 1; 
           1, 2;
           1, 3;]);

for i = 1:5
    for j = 1:5
        if (i ~= 5 || j ~= 5)
            c.tilesIndex = [c.tilesIndex; [i, j]];
            t = tile(2 * i - j, i + 3 * j, 100); 
            t.infected = 0;
            t.productivity = 10 * rand(); % initialize wealth
            c.tiles{i, j} = t;
        end
    end
end

c = c.setQ(3, 4);
c = c.setQ(6, 7);
c = c.setQ(9, 10);
c = c.buildH(2,2);
c = c.buildH(1,2);
c = c.buildH(3,3);
c = c.buildH(6,6);
c = c.buildH(8,8);
c = c.buildH(1,5);

%% initialize virus
posInit = [1,2;2,2;2,3;2,4;3,4;4,5;4,6;5,6;7,8];
v = virus(10, posInit);


%% simulation
figure(1) % initial condition of the city
clf;

for cnt = 1:20
    c = c.virusAttack(v);
    c = c.level; 
    % clf; v.render; c.render;    
    v = v.change;
end

v.render;c.render;

