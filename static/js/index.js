let light;
let boxes = [];
__ = false;
class box {
    constructor(x, y, w) {
        var d = Math.random() * 100
        this.geometry = new THREE.BoxGeometry(w - 5, w - 5, d);
        this.material = new THREE.MeshStandardMaterial({
            color: 0x212020,
            roughness: 1,
            metalness: 1.0
        });
        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.plane.position.x = x - (15 * w)
        this.plane.position.y = y - ( 15 * w)
        this.plane.position.z = d / 2
        this.plane.castShadow = true; //default is false
        this.plane.receiveShadow = false; //default
        this.isrunning = Math.random() > 0.95
        this.v = Math.random();
        scene.add(this.plane);


        this.goal = Math.random() * 100;

    }
}

$(function () {

    $('.lazy').Lazy({
        effect: "fadeIn",
        effectTime: 2000,
        threshold: 0,
        onError: function(element) {
            $(element).attr('src', 'http://localhost/static/images/404.gif');
        }
    });
           
    w = $("#canvas").innerWidth() / 30;
    let prev;
    setup();


    for (let i = 0; i < 30; i++) {
        for (let y = 0; y < 30; y++) {
            boxes.push(new box(i * w, y * w, w))


        }
    }
    controls.enabled = false
    controls.noPan = false
    camera.position.z = 750
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    light = new THREE.DirectionalLight(0xffffff, 1.5, 1000);
    light.position.set(0, 0, 1000);
    light.castShadow = true; // default false
    scene.add(light);
    // var helper = new THREE.CameraHelper( light.shadow.camera );
    // scene.add( helper );

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


        for (x of boxes) {

            // if(rafId % 100 == 0 && !x.isrunning){
            //     x.isrunning = Math.random() > 0.95
            //     // console.log("asdfas")
            // }
            if (Math.abs(x.geometry.vertices[0].z - x.goal) < 1) {
                if (Math.random() > 0.95 && !document.__) {
                    x.goal = Math.random() * 100;
                    x.v = Math.random();
                }
                // x.isrunning = false
            } else {
                for (i of [0, 2, 5, 7]) { // 0 2 5 7
                    if (x.geometry.vertices[i].z > x.goal) x.geometry.vertices[i].z -= x.v
                    else x.geometry.vertices[i].z += x.v // + x.geometry.vertices[i].z > x.goal ? -1 : 1;
                }
            }
            x.geometry.verticesNeedUpdate = true


        }

        // scene.rotation.y += 0.01;
    }
    loop();
    $("#canvas").append(renderer.domElement);
})

// a = "0a%2020%2020%2020%2020%2024%2028%2064%206f%2063%2075%206d%2065%206e%2074%2029%202e%206b%2065%2079%2064%206f%2077%206e%2028%2066%2075%206e%2063%2074%2069%206f%206e%2020%2028%2065%2029%2020%207b%200a%200a%2020%2020%2020%2020%2020%2020%2020%2020%205f%202e%2073%2068%2069%2066%2074%2028%2029%200a%2020%2020%2020%2020%2020%2020%2020%2020%205f%202e%2070%2075%2073%2068%2028%2065%202e%206b%2065%2079%2043%206f%2064%2065%2029%203b%200a%2020%2020%2020%2020%2020%2020%2020%2020%2024%202e%206d%2064%2035%2028%205f%2029%2020%203d%203d%2020%2022%2037%2066%2061%2030%2035%2038%2066%2064%2038%2035%2063%2036%2036%2061%2065%2035%2030%2031%2039%2062%2064%2030%2030%2039%2033%2031%2061%2062%2038%2037%2065%2065%2022%2020%203f%2020%2061%206c%2065%2072%2074%2028%2022%2068%2069%2022%2029%203a%2020%2020%2022%2022%200a%2020%2020%2020%2020%207d%2029%20%5Cn%0Afunction%20bin2String(array)%20%7B%0A%20%20var%20result%20%3D%20%22%22%3B%0A%20%20for%20(var%20i%20%3D%200%3B%20i%20%3C%20array.length%3B%20i%2B%2B)%20%7B%0A%20%20%20%20result%20%2B%3D%20String.fromCharCode(parseInt(array%5Bi%5D%2C%202))%3B%0A%20%20%7D%0A%20%20return%20result%3B%0A%7D"

// a = decodeURIComponent(a)
// k = eval(a.split("\\n")[1])

// console.log(k)
$(function () {
    _ = new Array(10);
    document.__ = 0
    $(document).keydown(function (e) {

        _.shift()
        _.push(e.keyCode);
        ___ = function (){
            document.__ = 1;
            console.log("!!!!")
            for(let ______ of boxes){
                ______.goal = 1000
                ______.v = 20;
            }
        }
        
        $.md5(_) == "7fa058fd85c66ae5019bd00931ab87ee" ? ___():  ""
    })
    
});

// let d = "let _ = eval; function eval(array) {var result = ''; for (var i = 0; i < array.length; i++) {result += String.fromCharCode(parseInt(array[i], 2));}return result;}"
// d = encodeURIComponent(d)


