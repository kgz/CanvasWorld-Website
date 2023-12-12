let dSlider;
let nSlider;
let h;
let gui;
let coords = []
let fps;
class options {
    constructor() {
        this.d = 14//(Math.random() * 250)
        this.n = 92// (Math.random() * 250)
        this.speed = 5;

        this.Random = () => {
            this.d = (Math.random() * 250)
            this.n = (Math.random() * 250)
            redraw()
        }
        this.random = $("<button/>", {
                text: "Randomize!",
                click:this.Random,
                css: {
                    position: "fixed",
                    bottom:"0px",
                    left:"0px",
                }}).appendTo("#canvas");

        }
    }



    function setup() {
        can = createCanvas($("#canvas").width(), $("#canvas").height());
        can.parent("#canvas")
        h = (width > height ? height : width) / 2
        // pixelDensity(1);
        // noLoop();
        angleMode(DEGREES);
        // dSlider = createSlider(1,180,1);
        // nSlider = createSlider(1,100,1);
        opts = new options()
        gui = new dat.GUI();
        gui.add(opts, 'd').min(0).max(250).step(1)
        gui.add(opts, 'n').min(0).max(250).step(1)
        gui.add(opts, 'Random')


        // frameRate(0)
    }


    let n = 5;
    let d = 200;

    function draw() {
        coords = []
        colorMode(HSB)
        background(0);
        translate(width / 2, (height / 2));
        d = opts.d
        n = opts.n
        noFill();
        strokeWeight(1);
        smooth()
        stroke(0)
        beginShape(TRIANGLE_STRIP);
        for (let i = 0; i < 360; i++) {
            let k = i * d;
            let r = h * sin(n * k);
            let x = r * cos(k);
            let y = r * sin(k);

            stroke('hsl(' + i + ', 50%, 50%)')
            // stroke('hsla('+i % 100+', 100%, 50%, .2)')

            curveVertex(x, y);
        }
        endShape();



        for (var i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
        }
        if (frameCount % 10 == 0) fps = frameRate()
        $("#fps").text("fps: " + Math.round(fps) + " | d = " + opts.d.toFixed(4) + " | n = " + opts.n.toFixed(4))
    }




    function windowResized() {
        resizeCanvas($("#canvas").width(), $("#canvas").height());
        h = (width > height ? height : width) / 2

    }
    $(() => {
        $("#canvas").on("wheel", (e) => e.originalEvent.deltaY < 0 ? h *= 1.1 : h *= .9);


    })