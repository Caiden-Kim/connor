document.body.style.overflow = 'hidden';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const objectData = [
  {pos:{x:0,y:0,z:0},rot:{x:0,y:0,z:0},cull:true},
  {pos:{x:0,y:0,z:-300},rot:{x:0,y:0,z:0},cull:true}
];

// var vertex = [[-50,-50,-50],[-50,50,-50],[50,-50,-50],[50,50,-50],[-50,-50,50],[-50,50,50],[50,-50,50],[50,50,50]]; //just cube
const vertex = [
  [[-25,-25,-25],[-25,25,-25],[25,-25,-25],[25,25,-25],[-25,-25,25],[-25,25,25],[25,-25,25],[25,25,25]],
  [[-50,-50,-50],[-50,50,-50],[50,-50,-50],[50,50,-50],[-50,-50,50],[-50,50,50],[50,-50,50],[50,50,50]],
]; //cube with extra
// var tris = [[0,1,2,[0,255,0]],[2,1,3,[0,255,255]]]; //back face
// var tris = [[0,2,4,[255,0,0]],[0,4,5,[255,255,0]]]; //bottom face
// var tris = [[0,4,5,[255,255,255]],[1,3,2,[200,200,200]]] //gray and white tris
// var tris = [[0,1,2,[0,0,105]],[1,2,3,[0,0,155]],[2,4,0,[0,0,205]],[2,6,4,[0,0,255]]] //two faces
const objectTris = [
  [
    [0,1,2,[0,0,100]],
    [1,3,2,[0,0,200]],
    [2,4,0,[0,100,0]],
    [2,6,4,[0,200,0]],
    [1,4,5,[100,0,0]],
    [1,0,4,[200,0,0]],
    [2,3,7,[0,100,100]],
    [2,7,6,[0,200,200]],
    [3,1,7,[100,100,0]],
    [5,7,1,[200,200,0]],
    [4,7,5,[100,0,100]],
    [4,6,7,[200,0,200]]
  ],

  [
    [0,1,2,[0,0,150]],
    [1,3,2,[0,0,150]],
    [2,4,0,[0,150,0]],
    [2,6,4,[0,150,0]],
    [1,4,5,[150,0,0]],
    [1,0,4,[150,0,0]],
    [2,3,7,[0,150,150]],
    [2,7,6,[0,150,150]],
    [3,1,7,[150,150,0]],
    [5,7,1,[150,150,0]],
    [4,7,5,[150,0,150]],
    [4,6,7,[150,0,150]]
  ],
];

var timer = 0;

const focalLength = 400;

const text = document.getElementById("text");

var cullID = [];
var culledTris = [];
var depths = [];

var coords = [];

var lastUpdate = Date.now();

function draw() {
  const now = Date.now();
  const dt = now - lastUpdate;
  lastUpdate = now;

  timer += dt * 0.01;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  cullID = [];
  culledTris = [];
  depths = [];
  coords = [];
  for (let i = 0; i < vertex.length; i++) {
    coords = coords.concat([[]]);
  }

  //modify properties
  objectData[0].pos.z = -timer * 4 - 100;
  objectData[0].rot = {x:timer * 0.1,y:timer * 0.1,z:timer * 0.1};
  
  objectData[1].pos.x = Math.sin(timer * 0.15) * 100;
  objectData[1].rot = {x:timer * 0.15,y:timer * 0.15,z:0};
  //

  // what to render
  renderObject(0);
  renderObject(1);
  //

  printScreen();

  lastUpdate = Date.now();
}

function renderObject(objectIndex) {
  const objData = objectData[objectIndex];
  calc(objectIndex,{x:objData.pos.x,y:objData.pos.y,z:objData.pos.z},{x:objData.rot.x,y:objData.rot.y,z:objData.rot.z});
  cullTris(objectIndex, coords[objectIndex], objectTris[objectIndex], objData.cull, true); //first is to cull, second is to order by centers
}

function printScreen() {
  console.log(cullID)
  console.log(culledTris)
  console.log(depths)
  for (let i = 0; i < culledTris.length; i++) {
    triangle(
    coords[cullID[i]][objectTris[cullID[i]][culledTris[i]][0]].x,
    coords[cullID[i]][objectTris[cullID[i]][culledTris[i]][0]].y,
    coords[cullID[i]][objectTris[cullID[i]][culledTris[i]][1]].x,
    coords[cullID[i]][objectTris[cullID[i]][culledTris[i]][1]].y,
    coords[cullID[i]][objectTris[cullID[i]][culledTris[i]][2]].x,
    coords[cullID[i]][objectTris[cullID[i]][culledTris[i]][2]].y,
    objectTris[cullID[i]][culledTris[i]][3],
    false //for stroke
    );
  }
}

function triangle(x,y,x1,y1,x2,y2,color,stroke) {
  var width = canvas.width * 0.5;
  var height = canvas.height * 0.5;
  ctx.beginPath();
  ctx.moveTo(x + width,y + height);
  ctx.lineTo(x1 + width,y1 + height);
  ctx.lineTo(x2 + width,y2 + height);
  ctx.fillStyle = `rgb(
    ${color[0]}
    ${color[1]}
    ${color[2]}
  )`;
  ctx.fill();
  ctx.lineTo(x + width,y + height);
  if (stroke == true) {
    ctx.strokeStyle = "white";
  } else {
    ctx.strokeStyle = `rgb(
      ${color[0]}
      ${color[1]}
      ${color[2]}
    )`;
  }
  ctx.stroke();
}

function calc(index,trans,rot) {
  const vertices = vertex[index];
  for (let i = 0; i < vertices.length; i++) {
    var x = vertices[i][0];
    var y = vertices[i][1];
    var z = vertices[i][2];

    let sin = {x:Math.sin(rot.x),y:Math.sin(rot.y),z:Math.sin(rot.z)}
    let cos = {x:Math.cos(rot.x),y:Math.cos(rot.y),z:Math.cos(rot.z)}

    var nx = x
    var ny = y
    var nz = z
    //x rot
    nx = x
    ny = (cos.x * y) - (sin.x * z);
    nz = (sin.x * y) + (cos.x * z);
    //y rot
    x = (cos.y * nx) + (sin.y * nz)
    y = ny
    z = (cos.y * nz) - (sin.y * nx)
    //z rot
    nx = (cos.z * x) - (sin.z * y);
    ny = (sin.z * x) + (cos.z * y);
    nz = z

    //translate
    nx += trans.x
    ny += trans.y
    nz += trans.z

    nx *= (focalLength / nz);
    ny *= (focalLength / nz);

    coords[index] = coords[index].concat([{x:nx,y:ny,z:nz}]);
  }
}

function cullTris(index, coords, tris, doCull, doOrder) {
  for (let i = 0; i < tris.length; i++) {
    var cull = 1
    if (doCull == true) {
      const p0 = {x:coords[tris[i][0]].x,y:coords[tris[i][0]].y};
      const p1 = {x:coords[tris[i][1]].x,y:coords[tris[i][1]].y};
      const p2 = {x:coords[tris[i][2]].x,y:coords[tris[i][2]].y};
      cull = (p0.x*p1.y-p0.y*p1.x)+(p1.x*p2.y-p1.y*p2.x)+(p2.x*p0.y-p2.y*p0.x);
    }
    if (cull > 0) {
      if (doOrder == true) {
        var depth = (coords[tris[i][0]].z + coords[tris[i][1]].z + coords[tris[i][2]].z) / 3;
        if (culledTris.length > 0) {
          for (var j = 0; j < culledTris.length; j++) {
            if (depth <= depths[j]) {
              break;
            }
          }
          culledTris.splice(j, 0, i);
          depths.splice(j, 0, depth);
          cullID.splice(j, 0, index)
        } else {
          culledTris = [i];
          depths = [depth];
          cullID = [index];
        }
      } else {
        culledTris = culledTris.concat([i]);
        cullID = cullID.concat([index])
      }
    }
  }
}

function resizeWindow() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeWindow();
window.onresize = resizeWindow;

setInterval(draw, 10);
