var timer = 0;
var logIndent = 0;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const text = document.getElementById("text");

var shapes = [
    [[{x:50,y:50},{x:-50,y:50},{x:-50,y:-50},{x:50,y:-50}],{x:0,y:0,rot:0}],
    [[{x:0,y:-10},{x:10,y:0},{x:0,y:200},{x:-10,y:0}],{x:0,y:0,rot:0}],
    [[{x:2,y:0},{x:0,y:2},{x:-2,y:0},{x:0,y:-2}],{x:0,y:0,rot:0}],
    [[{x:400,y:0},{x:280,y:280},{x:0,y:400},{x:-280,y:280},{x:-400,y:0},{x:-280,y:-280},{x:0,y:-400},{x:280,y:-280}],{x:0,y:0,rot:0}],
];

function draw() {
    //pre-draw
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    timer += 0.01;
    logIndent = 0
    //
    shapes[0][1].x = Math.sin(timer) * 200;
    shapes[0][1].y = Math.cos(timer) * 200;
    shapes[0][1].rot = timer * 2;
    
    shapes[1][1].rot = -timer;

    log("this some text :D");
    log("this is on another line");
    log("and so is this one");

    ctx.strokeStyle = "black";
    for (let i = 0; i < shapes.length; i++) {
        drawShape(i);
    }
}

setInterval(draw, 10);

function drawShape(i) {
    ctx.beginPath();
    var pos = rotate(shapes[i][1].x,shapes[i][1].y,shapes[i][0][shapes[i][0].length - 1].x + shapes[i][1].x,shapes[i][0][shapes[i][0].length - 1].y + shapes[i][1].y,shapes[i][1].rot);
    ctx.moveTo(pos.x + canvas.width / 2,pos.y + canvas.height / 2);
    for (let j = 0; j < shapes[i][0].length; j ++) {
        pos = rotate(shapes[i][1].x,shapes[i][1].y,shapes[i][0][j].x + shapes[i][1].x,shapes[i][0][j].y + shapes[i][1].y,shapes[i][1].rot);
        ctx.lineTo(pos.x + canvas.width / 2,pos.y + canvas.height / 2);
    }
    ctx.stroke();
}

function rotate(cx,cy,x,y,theta) {
    sin = Math.sin(theta);
    cos = Math.cos(theta);
    nx = (cos * (x - cx)) - (sin * (y - cy)) + cx;
    ny = (sin * (x - cx)) + (cos * (y - cy)) + cy;
    return {x:nx,y:ny};
}

function generateCircle() {
    
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.onresize = resize;
resize();

function log(text) {
    logIndent += 1;
    ctx.fillStyle = "black"
    ctx.font = "16px serif";
    ctx.fillText(text, 2, 16 * logIndent);
}
