function tiles
hold on 
a = 1;
for i = 1:3
    for j = 1:3
        drawHex(i,j,a);
    end
end

hold off
end