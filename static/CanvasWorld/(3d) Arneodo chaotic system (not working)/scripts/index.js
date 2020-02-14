const numParticles = 20000;
let currentPos = 0;
let x = 6,
    y = 8,
    z = 2;
var  options = {
       a : 7.5,
       b: 3.8,
       c : 1,
       d : -1,
       scale: 50
    
}

let starfield;
$(function () {

    function gen() {
        scene.children = []
        var starsGeometry = new THREE.BufferGeometry();
        starsGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));
        starsGeometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));
        var starsMaterial = new THREE.PointsMaterial({
            vertexColors: THREE.VertexColors,
            // color: 0xffa500,
            transparent: true,
            opacity: 0.8
        });
        starField = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starField);
    }
    const gui = new dat.GUI();
    gui.add(options, 'a').min(-10).max(10).step(0.01)
    gui.add(options, 'b').min(-10).max(10).step(0.01)
    gui.add(options, 'c').min(-10).max(10).step(0.01)
    gui.add(options, 'd').min(-10).max(10).step(0.01)
    gui.add(options, 'scale').min(1).max(500).step(1)


    setup();
    var prev = 0;
    gen()
    var positions = starField.geometry.attributes.position.array;
    var colors = starField.geometry.attributes.color.array

    let up = function () {
        if (currentPos >= numParticles) {
            currentPos = 0;
            x = 0;
            y = 0;
            z = 0;
        }
        for (let i = 0; i < numParticles; i++) {

            var a=options.a
            var b=options.b
            var c=options.c
            var d=options.d
         

            xnew = y + 0.2
            ynew = z + 0.2
            znew = (a*x)-(b*y)-z-Math.pow(y,2)+d //-a*x-b*y-c*z+d*(x**3)


            x = xnew
            y = ynew
            z = znew
            col = Math.abs(map(Math.sin(x + y - z), 0, 1, 200, 360))

            col ? c = new THREE.Color("hsl(" + col + ", 50%, 50%)") : new THREE.Color("hsl(0, 50%, 50%)")
            colors[currentPos] = c.r;
            colors[currentPos + 1] = c.g
            colors[currentPos + 2] = c.b


            positions[currentPos++] = x * options.scale;
            positions[currentPos++] = y* options.scale;
            positions[currentPos++] = z* options.scale;
        }
        hasres = false;

        starField.geometry.attributes.color.needsUpdate = true;
        starField.geometry.attributes.position.needsUpdate = true;
    }

    const loop = (now) => {
        camera.lookAt(scene.position);
        composer.render();
        rafId = requestAnimationFrame(loop);
        if (rafId % 10 == 0) {
            var delta = now - prev;
            var fps = 1000 / delta;
            prev = now;
            $("#fps").text("fps: " + Math.round(fps * 10))
        }
    }
    loop();
    interval = setInterval(function () {
        up();
    }, 0)
    $("#canvas").append(renderer.domElement);
});