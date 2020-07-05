posInit = [1,2;2,2;2,3;2,4;3,4;4,5;4,6;5,6;7,8];
v = virus(10, posInit);
v.render;

%%
for i = 1:13
v.render            % show the virus in the figure
v = v.change;       % evolution of the virus
clf;                % clear figure
end



