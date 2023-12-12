function preload() {

}

function setup() {
    canvas = createCanvas($("#canvas").innerWidth(), $("#canvas").innerHeight());
    canvas.parent('canvas');
    console.log()
    

    pixelDensity(1);
    // draw()

}

function draw() {
    
    background(270);

    // Establish a range of values on the complex plane
    // A different range will allow us to "zoom" in or out on the fractal

    // It all starts with the width, try higher or lower values
    const w = 4;
    const h = (w * height) / width;

    // Start at negative half the width and height
    const xmin = -w / 2;
    const ymin = -h / 2;

    // Make sure we can write to the pixels[] array.
    // Only need to do this once since we don't do any other drawing.
    loadPixels();

    // Maximum number of iterations for each point on the complex plane
    const maxiterations = 100;

    // x goes from xmin to xmax
    const xmax = xmin + w;
    // y goes from ymin to ymax
    const ymax = ymin + h;

    // Calculate amount we increment x,y for each pixel
    const dx = (xmax - xmin) / (width);
    const dy = (ymax - ymin) / (height);

    // Start y
    let y = ymin;

    for (let j = 0; j < height; j++) {
        // Start x
        let x = xmin;
        for (let i = 0; i < width; i++) {

            // Now we test, as we iterate z = z^2 + cm does z tend towards infinity?
            let a = x;
            let b = y;
            let n = 0;
            const pix = (i + j * width) * 4;

            while (n < maxiterations) {
                const aa = a * a;
                const bb = b * b;
                const twoab = 2.0 * a * b;
                a = aa - bb + x;
                b = twoab + y;
                k = dist(aa, bb, 0, 0)
                // Infinty in our finite world is simple, let's just consider it 16
                if (k > 16) {

                    c = color('hsl(270, 100%, '+Math.round(map(k, 0, 360, 0, 100)) + '%)')
                    pixels[pix + 0] = c.levels[0]
                    pixels[pix + 1] = c.levels[1]
                    pixels[pix + 2] = c.levels[2]
                    pixels[pix + 3] = 255;

                    // if(k > 200)
                        break; // Bail
                }
                n++;
            }

            // We color each pixel based on how long it takes to get to infinity
            // If we never got there, let's pick the color black
            // const norm = map(n, 0, maxiterations, 0, 1);
            // let bright = map(sqrt(norm), 0, 1, 0, 255);
            if (n == maxiterations) {
               
            } else {
                // c = new THREE.Color("hsl(" + map(k, 0, 255, 0,255) + ", 80%, 50%)")//.convertLinearToGamma()
                    // console.log(map(k , 0, 365, 210,260), k)
                // c = color('hsl('+Math.round(map(k, 0, 1000, 0, 360)) + ', 80%, 50%)')
                // pixels[pix + 0] = c.levels[0]
                // pixels[pix + 1] = c.levels[1]
                // pixels[pix + 2] = c.levels[2]
                // pixels[pix + 3] = 255;
            }
            x += dx;
        }
        y += dy;
    }
    updatePixels();

    $("#fps").text(getFrameRate())
    noLoop();

}

