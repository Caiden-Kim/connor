var timer = 0;
var speed = 0;
var keysDown = [];
var logIndent = 0;

const loadout = 1;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const deg = Math.PI / 180;

const text = document.getElementById("text");

if (loadout == 0) {
    var shapes = [
        [{type:"circle",radius:25,x:-250,y:0,rot:0}],
        [{type:"polygon",x:0,y:0,rot:0,boundingBox:{x:0,y:0,w:0,h:0}},[{x:50,y:50},{x:-50,y:50},{x:-50,y:-50},{x:50,y:-50}]],
        [{type:"polygon",x:0,y:0,rot:0,boundingBox:{x:0,y:0,w:0,h:0}},[{x:0,y:-10},{x:10,y:0},{x:0,y:200},{x:-10,y:0}]],
        [{type:"circle",radius:50,x:0,y:0,rot:0}],
        [{type:"polygon",x:0,y:0,rot:0,boundingBox:{x:0,y:0,w:0,h:0}},[{x:10,y:0},{x:0,y:-10},{x:-10,y:0},{x:0,y:10}]],
    ];
} else if (loadout == 1) {
    var shapes = [
        [{type:"polygon",x:0,y:0,rot:0,boundingBox:{x:0,y:0,w:0,h:0}},[{x:50,y:50},{x:-50,y:50},{x:-50,y:-50},{x:50,y:-50}]],
        [{type:"polygon",x:0,y:0,rot:0,boundingBox:{x:0,y:0,w:0,h:0}},[{x:50,y:50},{x:-50,y:50},{x:-50,y:-50},{x:50,y:-50}]],
        [{type:"polygon",x:0,y:0,rot:0,boundingBox:{x:0,y:0,w:0,h:0}},[{x:0,y:-10},{x:10,y:0},{x:0,y:200},{x:-10,y:0}]],
    ];
} else if (loadout == 2) {
    var shapes = [
        [{type:"polygon",x:0,y:0,rot:0,boundingBox:{x:0,y:0,w:0,h:0}},[{x:50,y:50},{x:-50,y:50},{x:-50,y:-50},{x:50,y:-50}]],
        [{type:"polygon",x:0,y:0,rot:0,boundingBox:{x:0,y:0,w:0,h:0}},[{x:50,y:50},{x:-50,y:50},{x:-50,y:-50},{x:50,y:-50}]],
    ];
}

var staticShapes = [
    
];

var allShapes = shapes.concat(staticShapes);

function draw() {
    //pre-draw
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    timer += speed * 0.001;
    logIndent = 0

    log("Press W or Up Arrow to progress time forward")
    log("Press S or Down Arrow to progress time backward")

    if (loadout == 0) {
        shapes[1][0].x = Math.sin((Math.PI / 2) * timer) * 200;
        shapes[1][0].y = Math.cos((Math.PI / 2) * timer) * 200;

        shapes[3][0].x = Math.sin(timer / 2) * 300;
        shapes[3][0].y = Math.cos(timer / 2) * 300;
        
        shapes[0][0].rot = timer;

        shapes[4][0].x = Math.cos(timer / 4) * 400;

        rotate(shapes[2], (deg / 10) * speed);
        rotate(shapes[1], (-deg / 10) * speed);
    } else if (loadout == 1) {
        rotate(shapes[0], (deg / 10) * speed);
        rotate(shapes[2], -0.01 * speed);
        shapes[1][0].x = Math.sin(timer * 5) * 50;
    } else if (loadout == 2) {
        rotate(shapes[0], (deg / 10) * speed);
        shapes[1][0].x = timer * 200;
    }

    for (let i = 0; i < allShapes.length; i++) {
        calcBoundingBox(allShapes[i])
    }
    runCollisionDetection()

    for (let i = 0; i < allShapes.length; i++) {
        drawBoundingBox(allShapes[i])
        drawShape(allShapes[i],i);
    }
}

setInterval(draw, 10);

function drawShape(shapeInfo,i) {
    ctx.strokeStyle = "black";
    if (shapeInfo[0].type == "circle") {
        ctx.beginPath();
        ctx.arc(shapeInfo[0].x + canvas.width / 2, shapeInfo[0].y + canvas.height / 2, shapeInfo[0].radius, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(shapeInfo[0].x + canvas.width / 2, shapeInfo[0].y + canvas.height / 2);
        var sin = Math.sin(shapeInfo[0].rot);
        var cos = Math.cos(shapeInfo[0].rot);
        ctx.lineTo(sin * shapeInfo[0].radius + shapeInfo[0].x + canvas.width / 2, cos * shapeInfo[0].radius + shapeInfo[0].y + canvas.height / 2);
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.moveTo(shapeInfo[1][shapeInfo[1].length - 1].x + shapeInfo[0].x + canvas.width / 2,shapeInfo[1][shapeInfo[1].length - 1].y + shapeInfo[0].y + canvas.height / 2);
        for (let j = 0; j < shapeInfo[1].length; j ++) {
            ctx.lineTo(shapeInfo[1][j].x + shapeInfo[0].x + canvas.width / 2, shapeInfo[1][j].y + shapeInfo[0].y + canvas.height / 2);
        }
        ctx.stroke();
    }
    ctx.fillStyle = "blue"
    ctx.font = "12px serif";
    ctx.fillText(i,shapeInfo[0].x + canvas.width / 2,shapeInfo[0].y + canvas.height / 2)
}

function rotate(shapeInfo,theta) {
    var sin = Math.sin(theta);
    var cos = Math.cos(theta);
    for (let j = 0; j < shapeInfo[1].length; j ++) {
        var nx = (cos * shapeInfo[1][j].x) - (sin * shapeInfo[1][j].y);
        var ny = (sin * shapeInfo[1][j].x) + (cos * shapeInfo[1][j].y);
        shapeInfo[1][j].x = nx;
        shapeInfo[1][j].y = ny;
    }
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

function calcBoundingBox(shapeInfo) {
    if (shapeInfo.length == 2) {
        var maxX = -999;
        var maxY = -999;
        var minX = 999;
        var minY = 999;
        for (let i = 0; i < shapeInfo[1].length; i++) {
            if (shapeInfo[1][i].x > maxX) {
                maxX = shapeInfo[1][i].x;
            }
            if (shapeInfo[1][i].x < minX) {
                minX = shapeInfo[1][i].x;
            }
            if (shapeInfo[1][i].y > maxY) {
                maxY = shapeInfo[1][i].y;
            }
            if (shapeInfo[1][i].y < minY) {
                minY = shapeInfo[1][i].y;
            }
        }
        shapeInfo[0].boundingBox.x = minX + shapeInfo[0].x;
        shapeInfo[0].boundingBox.y = minY + shapeInfo[0].y;
        shapeInfo[0].boundingBox.w = maxX - minX;
        shapeInfo[0].boundingBox.h = maxY - minY;
    }
}

function drawBoundingBox(shapeInfo) {
    if (shapeInfo.length == 2) {
        ctx.strokeStyle = "red";
        ctx.strokeRect(shapeInfo[0].boundingBox.x + canvas.width / 2,shapeInfo[0].boundingBox.y + canvas.height / 2,shapeInfo[0].boundingBox.w,shapeInfo[0].boundingBox.h)
    }
}

function runCollisionDetection() {
    for (let i = 0; i < allShapes.length; i++) {
        if (allShapes[i].length == 2) {
            var RectA = {
                x:allShapes[i][0].boundingBox.x,
                y:allShapes[i][0].boundingBox.y,
                x2:allShapes[i][0].boundingBox.x + allShapes[i][0].boundingBox.w,
                y2:allShapes[i][0].boundingBox.y + allShapes[i][0].boundingBox.h
            };

            for (let j = 0; j < allShapes.length; j++) {
                if (i != j) {
                    if (allShapes[j].length == 2) {
                        var RectB = {
                            x:allShapes[j][0].boundingBox.x,
                            y:allShapes[j][0].boundingBox.y,
                            x2:allShapes[j][0].boundingBox.x + allShapes[j][0].boundingBox.w,
                            y2:allShapes[j][0].boundingBox.y + allShapes[j][0].boundingBox.h
                        };
                        if (RectA.x < RectB.x2 && RectA.x2 > RectB.x && RectA.y < RectB.y2 && RectA.y2 > RectB.y) {
                            //log("Bounding Box Collision: " + [i,j])
                            for (let l = 0; l < allShapes[i][1].length; l++) {
                                for (let f = 0; f < allShapes[j][1].length; f++) {
                                    // i -> main shape
                                    // j -> second shape
                                    // l -> main shape vertex index (l+1 too)
                                    // f -> second shape vertex index (f+1 too)

                                    const a1 = (allShapes[i][1][(l + 1) % (allShapes[i][1].length)].x) - (allShapes[i][1][l].x)
                                    const a2 = (allShapes[i][1][(l + 1) % (allShapes[i][1].length)].y) - (allShapes[i][1][l].y)
                                    const b1 = (allShapes[j][1][(f + 1) % (allShapes[j][1].length)].x) - (allShapes[j][1][f].x)
                                    const b2 = (allShapes[j][1][(f + 1) % (allShapes[j][1].length)].y) - (allShapes[j][1][f].y)
                                    const c1 = (allShapes[j][1][f].x + allShapes[j][0].x) - (allShapes[i][1][l].x + allShapes[i][0].x);
                                    const c2 = (allShapes[j][1][f].y + allShapes[j][0].y) - (allShapes[i][1][l].y + allShapes[i][0].y);

                                    const s0 = (c1 * b2 - c2 * b1) / (a1 * b2 - a2 * b1);
                                    const t0 = (a1 * c2 - a2 * c1) / (a1 * b2 - a2 * b1);
                                    const x0 = (allShapes[i][1][l].x + allShapes[i][0].x) + s0 * a1;
                                    const y0 = (allShapes[i][1][l].y + allShapes[i][0].y) + s0 * a2;
                                    if (s0 > 0 && s0 < 1 && t0 > -1 && t0 < 0) {
                                        ctx.fillStyle = "green"
                                        ctx.beginPath();
                                        ctx.fillRect(x0 + canvas.width / 2 - 2, y0 + canvas.height / 2 - 2, 4, 4)
                                        ctx.stroke();
                                        log("Box Collision: " + [i,j])
                                    }
                                }
                            }
                        }
                    } else {
                        
                    }
                }
            }
        } else {
            for (let j = 0; j < allShapes.length; j++) {
                if (i != j) {
                    if (allShapes[j].length != 2) {
                        var dist = Math.sqrt(
                            (allShapes[i][0].x - allShapes[j][0].x) * (allShapes[i][0].x - allShapes[j][0].x) + 
                            (allShapes[i][0].y - allShapes[j][0].y) * (allShapes[i][0].y - allShapes[j][0].y)
                        )
                        if (dist <= allShapes[i][0].radius + allShapes[j][0].radius) {
                            log("Circle-Circle Collision: " + [i,j])
                        }
                    } else {
                        for (let l = 0; l < allShapes[j][1].length; l++) {
                            var dist = Math.sqrt(
                                (allShapes[i][0].x - (allShapes[j][1][l].x + allShapes[j][0].x)) * (allShapes[i][0].x - (allShapes[j][1][l].x + allShapes[j][0].x)) + 
                                (allShapes[i][0].y - (allShapes[j][1][l].y + allShapes[j][0].y)) * (allShapes[i][0].y - (allShapes[j][1][l].y + allShapes[j][0].y))
                            )
                            if (dist <= allShapes[i][0].radius) {
                                log("Circle-Polygon Collision: " + [i,j])
                                break
                            }
                        }

                        //detection along lines (very pro)
                    }
                }
            }
        }
    }
}

document.addEventListener("keydown", (event) => {
    if (event.code == "KeyW" || event.code == "ArrowUp") {
        speed = 1;
    }
    if (event.code == "KeyS" || event.code == "ArrowDown") {
        speed = -1;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.code == "KeyW" || event.code == "ArrowUp" || event.code == "KeyS" || event.code == "ArrowDown") {
        speed = 0;
    }
});
