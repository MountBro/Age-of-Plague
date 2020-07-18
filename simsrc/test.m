%% initialize city
c = city;
n = 0;
for i = 1:3
    for j = 1:3
        c.tilesIndex = [c.tilesIndex; [i, j]];
        t = tile(2 * i - j, i + 3 * j, 10);
        n = n + 10;
        t.infected = 0;
        t.dead = 0;
        t.productivity = 10 * (rand()+0.1); % initialize wealth
        c.tiles{i, j} = t;
    end
end

c = c.setQ(3, 3);
c = c.buildH(2,2);
c = c.buildA(1,2);
c = c.buildH(1,1);
%% initialize virus
posInit = [1,2;2,2;2,3;2,4;3,4;4,5;4,6;5,6;7,8];
v = virus(4, posInit, 5);


%% simulation
figure(1) % initial condition of the city
clf;
c = c.virusAttack(v);
c = c.level;
disp('Step 0 :');
disp('Population:');
disp(c.totalPeo);
disp('Sick:');
disp(c.totalsick);
disp('Death:');
disp(c.death);

v.render;c.render;
%disp(c.centerPopulation);
% clf; v.render; c.render;
v = v.change;
figure(2) % initial condition of the city
clf;
for cnt = 1:5
    c = c.virusAttack(v);
    c = c.virusKill(v);
    c = c.level;
    %disp(c.centerPopulation);
    % clf; v.render; c.render;
    v = v.change;
end
disp('Step 1 :');
disp('Population:');
disp(c.totalPeo);
disp('Sick:');
disp(c.totalsick);
disp('Death:');
disp(c.death);
v.render;c.render;

figure(3)
clf;
for cnt = 5:10
    c = c.virusAttack(v);
    c = c.virusKill(v);
    c = c.level;
    %disp(c.centerPopulation);
    % clf; v.render; c.render;
    v = v.change;
end
disp('Step 2 :');
disp('Population:');
disp(c.totalPeo);
disp('Sick:');
disp(c.totalsick);
disp('Death:');
disp(c.death);
v.render;c.render;

figure(4)
clf;
for cnt = 11:15
    c = c.virusAttack(v);
    c = c.virusKill(v);
    c = c.level;
    %disp(c.centerPopulation);
    % clf; v.render; c.render;
    v = v.change;
end
disp('Step 3 :');
disp('Population:');
disp(c.totalPeo);
disp('Sick:');
disp(c.totalsick);
disp('Death:');
disp(c.death);
v.render;c.render;
