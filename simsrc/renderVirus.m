posInit = [1,2;2,2;2,3;2,4;3,4;4,5;4,6;5,6;7,8];
v = virus(posInit);

figure(1)
v.render;

figure(2)
v = v.change;
v.render;

figure(3)
v = v.change;
v.render