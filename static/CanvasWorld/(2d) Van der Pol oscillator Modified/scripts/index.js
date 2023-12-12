var x = 0.2;
var y = 0.2;
var u =-5 //0.001;
var maxp = 10000;
let scale = 100;

var options = {alpha : 0.2}

function setup() {
  // opts = new options()
  const gui = new dat.GUI();
  gui.add(options, 'alpha').min(-3).max(3).step(0.001).onChange(()=>{redraw()});
  can = createCanvas($("#canvas").width(), $("#canvas").height());

  can.parent("#canvas")
  pixelDensity(1);
  // noLoop();
  // noLoop();

}

function draw() {
  // background(0);
  stroke('aqua'); 
  translate(width / 2,  height / 2)

  strokeWeight(1);
  for (let i = 0; i < maxp; i++) {
    nx = u * (x - ((1/3)* (x**3)) - y)//y;
    ny = -u * (x**2 - 1) * y - x
    point(nx *scale, ny *scale)
    x = nx 
    y = ny 
  }
  u+= 0.03
  if(u > 10){u = -5;
    background(0);
  }
  $("#fps").text("u = " + u)
  x = 0.2
  y = 0.2
}

function windowResized() {

  resizeCanvas($("#canvas").width(), $("#canvas").height());
  redraw();
}

$(window).on("keyup", (e) => {
  e.keyCode == 109 ? scale-=1 : e.keyCode == 107 ? scale +=1 : "";
  redraw()
})