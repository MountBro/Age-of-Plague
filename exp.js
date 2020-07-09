// Initialize
var box = document.getElementById("box");
box.style.position = "absolute";
// Initialize the variants
var mx, my, ox, oy;

function e(event) {
    event.mx = event.pageX || event.clientX + document.body.scrollLeft;
    event.my = event.pageY || event.clientY + document.body.scrollTop;
    return event;
}
// define the mouse disposal function
document.onmousedown = function (event) {
    event = e(event);
    o = event.target;
    ox = parseInt(o.offsetLeft);
    oy = parseInt(o.offsetTop);
    mx = event.mx;
    my = event.my;
    document.onmousemove = move;
    document.onmouseup = stop;
}

function move(event) {
    event = e(event);
    o.style.left = ox + event.mx - mx + "px";
    o.style.top = oy + event.my - my + "py";
}

function stop(event) {
    event = e(event);
    o = event.target;
    ox = parseInt(o.offsetLeft);
    oy = parseInt(o.offsetTop);
    mx = event.mx;
    my = event.my;
    o = document.onmousemove = document.onmouseup = null;
}