const numParticles = 100000 //1000000;
let currentPos = 0;
let colorPos = 0;
let interval;
let starField;
let x = 0,
    y = 0,
    z = 0;

let scale = 1000
class options {
    constructor() {
        this.u = 0.867 * scale; //Dat.gui wouldn't allow anything below .1 :(


    }
}
$(function () {
    opts = new options()
    const gui = new dat.GUI();
    gui.add(opts, 'u', 0, 1000).name("u / " + scale)

    setup();
    var starsGeometry = new THREE.BufferGeometry();
    starsGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numParticles * 2), 2));
    starsGeometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(numParticles * 2), 2));

    var starsMaterial = new THREE.PointsMaterial({
        vertexColors: THREE.VertexColors,
        // color:new THREE.Color("rgb(0, 255, 255)")
    });
    starField = new THREE.Points(starsGeometry, starsMaterial);
    var colors = starField.geometry.attributes.color.array

    // for (let index = 0; index < starField.geometry.attributes.color.array.length; index += 3) {
    //     const colors = starField.geometry.attributes.color.array

    //     percent = (index / 255)
    //     out = percent * 255
    //     // c = new THREE.Color("hsl(" + out % 255 + ", 50%, 50%)")
    //     colors[index] = c.r;
    //     colors[index + 1] = c.g
    //     colors[index + 2] = c.b
    // }
    scene.add(starField)
    var positions = starField.geometry.attributes.position.array;

    let up = function () {

        // if (currentPos >= numParticles) {
        //     currentPos = 0;
        //     colorPos = 0;
        //     x = 0;
        //     y = 0;
        //     z = 0;
        // }
        const w = 4;
        const width = 100;
        const height = 100;
        const h = (w * height / width);

        // Start at negative half the width and height
        const xmin = -w / 2;
        const ymin = -h / 2;

        // Make sure we can write to the pixels[] array.
        // Only need to do this once since we don't do any other drawing.
        // loadPixels();

        // Maximum number of iterations for each point on the complex plane
        const maxiterations = 10000;

        // x goes from xmin to xmax
        const xmax = xmin + w;
        // y goes from ymin to ymax
        const ymax = ymin + h;

        const dx = 1//(xmax - xmin) / (width);
        const dy = 1//(ymax - ymin) / (height);
        var pix;


        let y = ymin;
        for (let j = 0; j < height; j++) {
            // Start x
            let x = xmin;
            for (let i = 0; i < width; i++) {

                // Now we test, as we iterate z = z^2 + cm does z tend towards infinity?
                let a = x;
                let b = y;
                let n = 0;
                while (n < maxiterations) {
                    const aa = a * a;
                    const bb = b * b;
                    const twoab = 2.0 * a * b;
                    a = aa - bb + x;
                    b = twoab + y;
                    // Infinty in our finite world is simple, let's just consider it 16
                    if (new THREE.Vector2(aa, bb).distanceTo(new THREE.Vector3(0,0)) > 16) {
                        break; // Bail
                    }
                    n++;
                }

                // We color each pixel based on how long it takes to get to infinity
                // If we never got there, let's pick the color black
                pix = (i + j * width) * 4;
                const norm = map(n, 0, maxiterations, 0, 1);
                let bright = map(Math.sqrt(norm), 0, 1, 0, 255);
                if (n == maxiterations) {
                    bright = 0;
                } else {
                    // Gosh, we could make fancy colors here if we wanted
                    colors[pix + 0] = 255 - bright;
                    colors[pix + 1] =255 -  bright;
                    colors[pix + 2] = 255 - bright;
                    positions[pix + 0] = j ;
                    positions[pix + 1] = i ;
                    // positions[pix + 2] =  0;
                }
    
                x += dx;

            }

            y += dy;

        }
        starField.geometry.attributes.color.needsUpdate = true;
        starField.geometry.attributes.position.needsUpdate = true;
        camera.lookAt(starField.position);
        controls.update();
        renderer.render(scene, camera);
    }
    var prev;
    const loop = (now) => {
        // u = u + 0.001 % 1; 
        controls.update();
        renderer.render(scene, camera);
        camera.lookAt(scene.position);

      


        composer.render();
        rafId = requestAnimationFrame(loop);

        if (rafId % 10 == 0) {
            var delta = now - prev;
            var fps = 1000 / delta;
            prev = now;
            $("#fps").text("fps: " + Math.round(fps * 10) + " at 100 intervals ")
        }

    }

    loop();
    interval = setInterval(function () {
        up();
    }, 0)

    $("#canvas").append(renderer.domElement);
});