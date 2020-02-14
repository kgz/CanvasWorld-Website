let world, scene, camera, renderer, composer, renderPass, controls, focusShader;



function setup() {

    dat.controllers.NumberControllerBox.prototype.updateDisplay = function updateDisplay() {
        this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision).toFixed(this.__precision);
        return _NumberController.prototype.updateDisplay.call(this);
    };


    scene = new THREE.Scene();
    world = new THREE.Object3D();
    scene.add(world);
    camera = new THREE.PerspectiveCamera(45, $("#canvas").innerWidth() / $("#canvas").innerHeight());
    camera.position.z = 1000;

    // renderer and shader passes
    renderer = new THREE.WebGLRenderer({
        alpha: true
    });
    renderer.setSize($("#canvas").innerWidth(), $("#canvas").innerHeight());
    renderer.setClearColor("black");
    renderer.setPixelRatio($("#canvas").devicePixelRatio);
	document.body.appendChild( renderer.domElement );

    composer = new THREE.EffectComposer(renderer);
    renderPass = new THREE.RenderPass(scene, camera);

    focusShader = new THREE.ShaderPass(THREE.FocusShader);
    focusShader.uniforms.screenWidth.value = $("#canvas").innerWidth();
    focusShader.uniforms.screenHeight.value = $("#canvas").innerHeight();
    focusShader.uniforms.sampleDistance.value = 0.1;
    focusShader.uniforms.waveFactor.value = 0.001;
    focusShader.renderToScreen = true;

    composer.addPass(renderPass);
    composer.addPass(focusShader);

	controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.9;
    controls.enableZoom = true;
   

    window.addEventListener('resize', () => {


        canvasWidth = $("#canvas").innerWidth();
        canvasHeight = $("#canvas").innerHeight();

        var pixelRatio = renderer.getPixelRatio();
        var newWidth = Math.floor(canvasWidth / pixelRatio) || 1;
        var newHeight = Math.floor(canvasHeight / pixelRatio) || 1;

        focusShader.uniforms.screenWidth.value = canvasWidth;
        focusShader.uniforms.screenHeight.value = canvasHeight;

        composer.setSize(newWidth, newHeight);

        camera.aspect = canvasWidth / canvasHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasWidth, canvasHeight);
    });

    // $("body").append(renderer.domElement);

}

