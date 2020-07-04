posInit = [1,2;2,2;2,3;2,4;3,4;4,5;4,6;5,6;7,8];
v = virus(posInit);
figure(1)
axis([0, 30, 0, 30]);

for i = 1:10
v.render
v = v.change;
clf;
end    