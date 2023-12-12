function setup() {
  class options {
    constructor() {
      this.a = 0.0025;
      this.b = 1.44
      this.scale = 1000;
      this.colorRange = 290
    }
  }

  can = createCanvas($("#canvas").width(), $("#canvas").height());
  can.parent("#canvas")
  pixelDensity(1);
  noLoop();

  opts = new options()
  const gui = new dat.GUI();
  gui.add(opts, 'a').min(0).max(0.01).step(0.0001).onChange(()=>redraw())
  gui.add(opts, 'b').min(0.5).max(2.5).step(0.01).onChange(()=>redraw())
  gui.add(opts, 'scale').min(0).max(5000).step(1).onChange(()=>redraw())
  // gui.add(opts, 'colorRange').min(1).max(360).step(1).onChange(()=>redraw())
}




function draw() {

  translate(width / 2, height / 2)
  background(0);
  let x = .1;
  let y = 0;
  colorMode(HSL)
  for (let i = 0; i < 50000; i++) {
    // stroke(color("hsl(" + i % 360 + ", 100%, 50%)"))
    nx = x + y + opts.a * y +  opts.b * x * (x - 1 ) - 0.1 * x * y

    ny = y+ opts.a * y + opts.b * x*(x - 1) - 0.1*x*y
    stroke(color("hsl(" + ((Math.round(x*50 * y*50 ) % opts.colorRange) + (360 - opts.colorRange))+ ", 100%, 50%)"))



    point(x * opts.scale, y * opts.scale)
    x = nx
    y = ny
  }
  noLoop()
}

function windowResized() {
  resizeCanvas($("#canvas").width(), $("#canvas").height());
}