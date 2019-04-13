const numParticles = 800000  //1000000;
let currentPos = 0;
let colorPos = 0;
let interval;
let starField
let x = -2,
    y = -2,
    z = 0;

class options {
    constructor() {
        this.a = -9669; //Dat.gui wouldn't allow anything below .1 :(
        this.b = 28798 ; //these get divided by 1,000 in the algorithm
        this.c = 7651;
        this.d = 7447;
    }
}
$(function () {
    opts = new options()
    const gui = new dat.GUI();
    gui.add(opts, 'a', -30000, 30000).name("a / 10000")
    gui.add(opts, 'b', -300000, 30000).name("b / 100000")
    gui.add(opts, 'c', -5000, 15000).name("c / 10000")
    gui.add(opts, 'd', -5000, 15000).name("d / 10000")
    setup();
    // camera.position.x = 411.9288657852996
    // camera.position.y = 139.651467039443
    // camera.position.z = -411.458381486034

    var starsGeometry = new THREE.BufferGeometry();
    starsGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));
    starsGeometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));

    var starsMaterial = new THREE.PointsMaterial({
        vertexColors: THREE.VertexColors
    });
    starField = new THREE.Points(starsGeometry, starsMaterial);

    for (let index = 0; index < starField.geometry.attributes.color.array.length; index += 3) {
        const colors = starField.geometry.attributes.color.array

        percent = (index / 255)
        out = percent * 255
        c = new THREE.Color("hsl(" + out % 255 + ", 50%, 50%)")
        colors[index] = c.r;
        colors[index + 1] = c.g
        colors[index + 2] = c.b
    }


    scene.add(starField)
    var positions = starField.geometry.attributes.position.array;

    let up = function () {

        if (currentPos >= numParticles) {
            currentPos = 0;
            colorPos = 0;
            x = -2;
            y = -2;
            z = 0;
        }
        for (let index = 0; index < numParticles / 1000; index++) {
            // a =  opts.a / 10000;
            // b = opts.b / 100000;
            // c = opts.c / 10000;
            // d = opts.d / 10000;
            let a = 1.5,
            b = 0.7,
            c = 1.4,
            d = 1.2

            // xnew=Math.sin(y*b)+c*Math.sin(x*b)
            // ynew=Math.sin(x*a)+d*Math.sin(y*a)
            xnew = Math.sin(-b * y) -c * Math.sin(-b * x)
            ynew = Math.sin(a *x) + d * Math.sin(a * y)
            x += xnew * 3;
            y += ynew * 3;
            positions[currentPos++] = x //- $("#canvas").innerWidth()/2;
            positions[currentPos++] = y ;
            positions[currentPos++] = 0;
        }
        starField.geometry.attributes.position.needsUpdate = true;
        starField.geometry.attributes.color.needsUpdate = true;

        controls.update();
        renderer.render(scene, camera);
    }
    var prev;
    const loop = (now) => {
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
        stars = starField.geometry.attributes.color.array
        first = (stars[stars.length - 3], stars[stars.length - 2], stars[stars.length - 1])
        for (let x = 3; x < starField.geometry.attributes.color.array.length; x = x + 3) {
            stars[x - 3] = stars[x];
            stars[x - 2] = stars[x + 1];
            stars[x - 1] = stars[x + 2];
        }
        stars[0] = first[0]
        stars[1] = first[1]
        stars[2] = first[2]

    }
    loop();
    interval = setInterval(function () {
        up();
    }, 0)

    $("#canvas").append(renderer.domElement);
});