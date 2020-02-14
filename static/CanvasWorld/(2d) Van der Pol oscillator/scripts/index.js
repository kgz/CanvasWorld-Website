var x = 0.2;
var y = 0.2;
var u = 0//0.001;
var maxp = 10000;
let scale = 250;

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
  colorMode(HSL)
  translate(width / 2,  height / 2)

  strokeWeight(2);
  for (let i = 0; i < maxp; i++) {
    c = color("hsl(" + Math.round(map(u, 0, 3, 0, 360 ))+ " ,50%, 50%)")
    stroke(c)
    nx = u * (x - ((1/3)* (x**3)) - y)//y;
    ny = (1/u) * x //-u * (x**2 - 1) * y - x
    point(nx * scale, ny * scale)
    x = nx 
    y = ny 
  }
  u+= 0.01
  if(u > 2.3){u = 0;
    background(0);
  }
  $("#fps").text("u = " + u.toFixed(2))
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