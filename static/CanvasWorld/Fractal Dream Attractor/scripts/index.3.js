const numParticles = 100000;

let scale = 20
let a=-0.966918, b=2.879879, c=0.765145,d=0.744728

let x = -2,
    y = -2,
    z = 0;
let line;
$(function () {
    setup();
    camera.position.z = -200
    var prev = 0;
    var starsGeometry = new THREE.Geometry();

    for (let i = 0; i < numParticles; i++) {
        // console.log("sdaf")

        xnew = Math.sin(b * y) +c * Math.sin(b * x)
        ynew = Math.sin(a * x) + d * Math.sin(a * y)
        x += xnew
        y += ynew


        var star = new THREE.Vector3();
        star.x = xnew * 50
        star.y = ynew * 50
        star.z = 0

        starsGeometry.vertices.push(star);
    }
    var starsMaterial = new THREE.PointsMaterial({
        color: 0x888888
    });
    var starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);
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
        // scene.rotation.y += 0.01
    }
    loop();
    $("#canvas").append(renderer.domElement);
});