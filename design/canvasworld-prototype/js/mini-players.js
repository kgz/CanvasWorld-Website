(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var accentInk = [61, 214, 198];
  var coolInk = [184, 196, 214];

  function bindPlayButton(btn, getPlaying, setPlaying) {
    if (!btn) return;
    function sync() {
      var playing = getPlaying();
      btn.classList.toggle("is-paused", !playing);
      btn.setAttribute("aria-label", playing ? "Pause" : "Play");
    }
    btn.addEventListener("click", function () {
      setPlaying(!getPlaying());
      sync();
    });
    sync();
  }

  function setupCanvas(root) {
    var canvas = root.querySelector(".mini-canvas");
    if (!canvas) return null;
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = 0;
    var height = 0;

    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);
    return { canvas: canvas, ctx: ctx, resize: resize, getW: function () { return width; }, getH: function () { return height; } };
  }

  function mountLorenz(root) {
    var view = setupCanvas(root);
    if (!view) return;

    var TOTAL = 4800;
    var DT = 0.008;
    var xs = new Float32Array(TOTAL);
    var ys = new Float32Array(TOTAL);
    var zs = new Float32Array(TOTAL);
    var sigma = Number(root.getAttribute("data-sigma") || 10);
    var rho = Number(root.getAttribute("data-rho") || 28);
    var beta = Number(root.getAttribute("data-beta") || 2.7);
    var drawn = 0;
    var playing = !reduceMotion;
    var rotation = 0.55;
    var last = null;
    var fpsEl = root.querySelector("[data-od-id='fps-value']");
    var fpsSmoothed = 60;
    var fpsLastPaint = 0;
    var sigmaInput = root.querySelector("[data-mini-sigma]");
    var rhoInput = root.querySelector("[data-mini-rho]");
    var betaInput = root.querySelector("[data-mini-beta]");
    var sigmaVal = root.querySelector("[data-mini-sigma-val]");
    var rhoVal = root.querySelector("[data-mini-rho-val]");
    var betaVal = root.querySelector("[data-mini-beta-val]");

    function compute() {
      var x = 0.1;
      var y = 0;
      var z = 0;
      for (var i = 0; i < TOTAL; i++) {
        var dx = sigma * (y - x);
        var dy = x * (rho - z) - y;
        var dz = x * y - beta * z;
        x += dx * DT;
        y += dy * DT;
        z += dz * DT;
        xs[i] = x;
        ys[i] = y;
        zs[i] = z;
      }
    }

    function render() {
      var width = view.getW();
      var height = view.getH();
      var ctx = view.ctx;
      ctx.fillStyle = "#05070a";
      ctx.fillRect(0, 0, width, height);
      if (drawn < 2) return;

      var scale = Math.min(width, height) / 58;
      var cx = width / 2;
      var cy = height / 2 + Math.min(width, height) * 0.05;
      var cosR = Math.cos(rotation);
      var sinR = Math.sin(rotation);
      var chunk = 48;

      for (var start = 0; start < drawn - 1; start += chunk) {
        var end = Math.min(start + chunk + 1, drawn);
        var age = start / TOTAL;
        var alpha = 0.14 + age * 0.6;
        var color = age > 0.55 ? coolInk : accentInk;
        ctx.beginPath();
        for (var i = start; i < end; i++) {
          var px = xs[i];
          var pz = zs[i] - 25;
          var rx = px * cosR - pz * sinR;
          var rz = px * sinR + pz * cosR;
          var sx = cx + rx * scale;
          var sy = cy - (ys[i] * 0.62 + rz * 0.5) * scale * 0.9;
          if (i === start) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + alpha.toFixed(3) + ")";
        ctx.lineWidth = 1.05;
        ctx.stroke();
      }
    }

    function paintFps(t, dtMs) {
      if (!fpsEl || dtMs <= 0) return;
      fpsSmoothed = fpsSmoothed * 0.88 + (1000 / dtMs) * 0.12;
      if (t - fpsLastPaint < 200 && fpsLastPaint !== 0) return;
      fpsLastPaint = t;
      fpsEl.textContent = String(Math.max(1, Math.round(fpsSmoothed)));
    }

    function tick(t) {
      var dt = last == null ? 16 : Math.min(t - last, 48);
      last = t;
      if (playing) {
        if (drawn >= TOTAL) drawn = 0;
        drawn = Math.min(TOTAL, drawn + (dt / 1000) * 520);
      }
      if (!reduceMotion) rotation += (dt / 1000) * 0.06;
      render();
      paintFps(t, dt);
      requestAnimationFrame(tick);
    }

    function onParam() {
      if (sigmaInput) {
        sigma = Number(sigmaInput.value);
        if (sigmaVal) sigmaVal.textContent = sigma.toFixed(1);
      }
      if (rhoInput) {
        rho = Number(rhoInput.value);
        if (rhoVal) rhoVal.textContent = rho.toFixed(1);
      }
      if (betaInput) {
        beta = Number(betaInput.value);
        if (betaVal) betaVal.textContent = beta.toFixed(1);
      }
      compute();
      drawn = 0;
      playing = true;
      var playBtn = root.querySelector("[data-mini-play]");
      if (playBtn) {
        playBtn.classList.remove("is-paused");
        playBtn.setAttribute("aria-label", "Pause");
      }
    }

    [sigmaInput, rhoInput, betaInput].forEach(function (el) {
      if (el) el.addEventListener("input", onParam);
    });

    bindPlayButton(
      root.querySelector("[data-mini-play]"),
      function () { return playing; },
      function (v) {
        playing = v;
        if (playing && drawn >= TOTAL) drawn = 0;
      }
    );

    compute();
    view.resize();
    if (reduceMotion) {
      drawn = TOTAL;
      render();
    } else {
      requestAnimationFrame(tick);
    }
  }

  function mountHalvorsen(root) {
    var view = setupCanvas(root);
    if (!view) return;

    var TOTAL = 4200;
    var DT = 0.01;
    var a = 1.4;
    var xs = new Float32Array(TOTAL);
    var ys = new Float32Array(TOTAL);
    var zs = new Float32Array(TOTAL);
    var drawn = 0;
    var playing = !reduceMotion;
    var rotation = 0.4;
    var last = null;

    function compute() {
      var x = -5;
      var y = 0;
      var z = 0;
      for (var i = 0; i < TOTAL; i++) {
        var dx = -a * x - 4 * y - 4 * z - y * y;
        var dy = -a * y - 4 * z - 4 * x - z * z;
        var dz = -a * z - 4 * x - 4 * y - x * x;
        x += dx * DT;
        y += dy * DT;
        z += dz * DT;
        xs[i] = x;
        ys[i] = y;
        zs[i] = z;
      }
    }

    function render() {
      var width = view.getW();
      var height = view.getH();
      var ctx = view.ctx;
      ctx.fillStyle = "#05070a";
      ctx.fillRect(0, 0, width, height);
      if (drawn < 2) return;

      var scale = Math.min(width, height) / 28;
      var cx = width / 2;
      var cy = height / 2;
      var cosR = Math.cos(rotation);
      var sinR = Math.sin(rotation);
      var chunk = 40;

      for (var start = 0; start < drawn - 1; start += chunk) {
        var end = Math.min(start + chunk + 1, drawn);
        var age = start / TOTAL;
        var alpha = 0.16 + age * 0.55;
        var color = age > 0.5 ? coolInk : accentInk;
        ctx.beginPath();
        for (var i = start; i < end; i++) {
          var px = xs[i];
          var pz = zs[i];
          var rx = px * cosR - pz * sinR;
          var sx = cx + rx * scale;
          var sy = cy - ys[i] * scale * 0.85;
          if (i === start) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + alpha.toFixed(3) + ")";
        ctx.lineWidth = 1.05;
        ctx.stroke();
      }
    }

    function tick(t) {
      var dt = last == null ? 16 : Math.min(t - last, 48);
      last = t;
      if (playing) {
        if (drawn >= TOTAL) drawn = 0;
        drawn = Math.min(TOTAL, drawn + (dt / 1000) * 480);
      }
      if (!reduceMotion) rotation += (dt / 1000) * 0.05;
      render();
      requestAnimationFrame(tick);
    }

    bindPlayButton(
      root.querySelector("[data-mini-play]"),
      function () { return playing; },
      function (v) {
        playing = v;
        if (playing && drawn >= TOTAL) drawn = 0;
      }
    );

    compute();
    view.resize();
    if (reduceMotion) {
      drawn = TOTAL;
      render();
    } else {
      requestAnimationFrame(tick);
    }
  }

  function mountMandelbrot(root) {
    var view = setupCanvas(root);
    if (!view) return;

    var playing = !reduceMotion;
    var zoom = 1;
    var targetZoom = 1.8;
    var last = null;
    var dirty = true;

    function render() {
      var canvas = view.canvas;
      var ctx = view.ctx;
      var bw = canvas.width;
      var bh = canvas.height;
      if (bw < 2 || bh < 2) return;
      var img = ctx.createImageData(bw, bh);
      var data = img.data;
      var maxIter = 56;
      var cx = -0.745;
      var cy = 0.186;
      var scale = 2.4 / zoom;
      var aspect = bw / Math.max(1, bh);

      for (var py = 0; py < bh; py++) {
        for (var px = 0; px < bw; px++) {
          var x0 = cx + ((px / bw) - 0.5) * scale * aspect;
          var y0 = cy + ((py / bh) - 0.5) * scale;
          var x = 0;
          var y = 0;
          var iter = 0;
          while (x * x + y * y <= 4 && iter < maxIter) {
            var xt = x * x - y * y + x0;
            y = 2 * x * y + y0;
            x = xt;
            iter++;
          }
          var i = (py * bw + px) * 4;
          if (iter >= maxIter) {
            data[i] = 5;
            data[i + 1] = 7;
            data[i + 2] = 10;
          } else {
            var t = iter / maxIter;
            data[i] = Math.floor(20 + t * 40);
            data[i + 1] = Math.floor(40 + t * 170);
            data[i + 2] = Math.floor(50 + t * 160);
          }
          data[i + 3] = 255;
        }
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.putImageData(img, 0, 0);
      dirty = false;
    }

    function tick(t) {
      var dt = last == null ? 16 : Math.min(t - last, 48);
      last = t;
      if (playing && !reduceMotion) {
        zoom += (targetZoom - zoom) * Math.min(1, dt * 0.00035);
        if (Math.abs(targetZoom - zoom) < 0.002) {
          targetZoom = targetZoom > 2 ? 1.15 : 3.2;
        }
        dirty = true;
      }
      if (dirty) render();
      requestAnimationFrame(tick);
    }

    bindPlayButton(
      root.querySelector("[data-mini-play]"),
      function () { return playing; },
      function (v) { playing = v; }
    );

    view.resize();
    window.addEventListener("resize", function () { dirty = true; });
    if (reduceMotion) {
      zoom = 1.8;
      render();
    } else {
      requestAnimationFrame(tick);
    }
  }

  function mountLsystem(root) {
    var view = setupCanvas(root);
    if (!view) return;

    var axiom = "X";
    var rules = { X: "F+[[X]-X]-F[-FX]+X", F: "FF" };
    var angle = 22.5 * Math.PI / 180;
    var generation = 0;
    var targetGen = 5;
    var playing = !reduceMotion;
    var lastStep = 0;
    var sentence = axiom;

    function expand(src) {
      var out = "";
      for (var i = 0; i < src.length; i++) {
        var ch = src.charAt(i);
        out += rules[ch] || ch;
      }
      return out;
    }

    function rebuild() {
      sentence = axiom;
      for (var g = 0; g < generation; g++) sentence = expand(sentence);
    }

    function render() {
      var width = view.getW();
      var height = view.getH();
      var ctx = view.ctx;
      ctx.fillStyle = "#05070a";
      ctx.fillRect(0, 0, width, height);

      var step = Math.max(2, Math.min(width, height) / (12 + generation * 8));
      var x = width * 0.5;
      var y = height * 0.92;
      var dir = -Math.PI / 2;
      var stack = [];

      ctx.strokeStyle = "rgba(61,214,198,0.72)";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(x, y);

      for (var i = 0; i < sentence.length; i++) {
        var ch = sentence.charAt(i);
        if (ch === "F") {
          x += Math.cos(dir) * step;
          y += Math.sin(dir) * step;
          ctx.lineTo(x, y);
        } else if (ch === "+") {
          dir += angle;
        } else if (ch === "-") {
          dir -= angle;
        } else if (ch === "[") {
          stack.push([x, y, dir]);
        } else if (ch === "]" && stack.length) {
          var state = stack.pop();
          x = state[0];
          y = state[1];
          dir = state[2];
          ctx.moveTo(x, y);
        }
      }
      ctx.stroke();
    }

    function tick(t) {
      if (playing && t - lastStep > 900) {
        lastStep = t;
        generation = generation >= targetGen ? 0 : generation + 1;
        rebuild();
        render();
      }
      requestAnimationFrame(tick);
    }

    bindPlayButton(
      root.querySelector("[data-mini-play]"),
      function () { return playing; },
      function (v) { playing = v; }
    );

    rebuild();
    view.resize();
    render();
    window.addEventListener("resize", render);
    if (!reduceMotion) requestAnimationFrame(tick);
  }

  var mounts = {
    lorenz: mountLorenz,
    halvorsen: mountHalvorsen,
    mandelbrot: mountMandelbrot,
    lsystem: mountLsystem
  };

  document.querySelectorAll("[data-mini]").forEach(function (root) {
    var kind = root.getAttribute("data-mini");
    var mount = mounts[kind];
    if (mount) mount(root);
  });
})();
