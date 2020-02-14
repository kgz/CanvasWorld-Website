/**
 * Minified by jsDelivr using Terser v3.14.1.
 * Original file: /npm/three-orbitcontrols@2.108.1/OrbitControls.js
 * 
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
var THREE = require("three");
THREE.OrbitControls = function (e, t) {
    var o, n, a, i, c;
    this.object = e, this.domElement = void 0 !== t ? t : document, this.enabled = !0, this.target = new THREE.Vector3, this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = .05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !1, this.keyPanSpeed = 7, this.autoRotate = !1, this.autoRotateSpeed = 2, this.enableKeys = !0, this.keys = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        BOTTOM: 40
    }, this.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
    }, this.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
    }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this.getPolarAngle = function () {
        return p.phi
    }, this.getAzimuthalAngle = function () {
        return p.theta
    }, this.saveState = function () {
        s.target0.copy(s.target), s.position0.copy(s.object.position), s.zoom0 = s.object.zoom
    }, this.reset = function () {
        s.target.copy(s.target0), s.object.position.copy(s.position0), s.object.zoom = s.zoom0, s.object.updateProjectionMatrix(), s.dispatchEvent(r), s.update(), m = l.NONE
    }, this.update = (o = new THREE.Vector3, n = (new THREE.Quaternion).setFromUnitVectors(e.up, new THREE.Vector3(0, 1, 0)), a = n.clone().inverse(), i = new THREE.Vector3, c = new THREE.Quaternion, function () {
        var e = s.object.position;
        return o.copy(e).sub(s.target), o.applyQuaternion(n), p.setFromVector3(o), s.autoRotate && m === l.NONE && w(2 * Math.PI / 60 / 60 * s.autoRotateSpeed), s.enableDamping ? (p.theta += d.theta * s.dampingFactor, p.phi += d.phi * s.dampingFactor) : (p.theta += d.theta, p.phi += d.phi), p.theta = Math.max(s.minAzimuthAngle, Math.min(s.maxAzimuthAngle, p.theta)), p.phi = Math.max(s.minPolarAngle, Math.min(s.maxPolarAngle, p.phi)), p.makeSafe(), p.radius *= b, p.radius = Math.max(s.minDistance, Math.min(s.maxDistance, p.radius)), !0 === s.enableDamping ? s.target.addScaledVector(T, s.dampingFactor) : s.target.add(T), o.setFromSpherical(p), o.applyQuaternion(a), e.copy(s.target).add(o), s.object.lookAt(s.target), !0 === s.enableDamping ? (d.theta *= 1 - s.dampingFactor, d.phi *= 1 - s.dampingFactor, T.multiplyScalar(1 - s.dampingFactor)) : (d.set(0, 0, 0), T.set(0, 0, 0)), b = 1, !!(O || i.distanceToSquared(s.object.position) > h || 8 * (1 - c.dot(s.object.quaternion)) > h) && (s.dispatchEvent(r), i.copy(s.object.position), c.copy(s.object.quaternion), O = !1, !0)
    }), this.dispose = function () {
        s.domElement.removeEventListener("contextmenu", $, !1), s.domElement.removeEventListener("mousedown", I, !1), s.domElement.removeEventListener("wheel", K, !1), s.domElement.removeEventListener("touchstart", q, !1), s.domElement.removeEventListener("touchend", J, !1), s.domElement.removeEventListener("touchmove", Q, !1), document.removeEventListener("mousemove", B, !1), document.removeEventListener("mouseup", G, !1), window.removeEventListener("keydown", W, !1)
    };
    var s = this,
        r = {
            type: "change"
        },
        u = {
            type: "start"
        },
        E = {
            type: "end"
        },
        l = {
            NONE: -1,
            ROTATE: 0,
            DOLLY: 1,
            PAN: 2,
            TOUCH_ROTATE: 3,
            TOUCH_PAN: 4,
            TOUCH_DOLLY_PAN: 5,
            TOUCH_DOLLY_ROTATE: 6
        },
        m = l.NONE,
        h = 1e-6,
        p = new THREE.Spherical,
        d = new THREE.Spherical,
        b = 1,
        T = new THREE.Vector3,
        O = !1,
        f = new THREE.Vector2,
        R = new THREE.Vector2,
        g = new THREE.Vector2,
        H = new THREE.Vector2,
        v = new THREE.Vector2,
        y = new THREE.Vector2,
        P = new THREE.Vector2,
        N = new THREE.Vector2,
        A = new THREE.Vector2;

    function L() {
        return Math.pow(.95, s.zoomSpeed)
    }

    function w(e) {
        d.theta -= e
    }

    function j(e) {
        d.phi -= e
    }
    var M, C = (M = new THREE.Vector3, function (e, t) {
            M.setFromMatrixColumn(t, 0), M.multiplyScalar(-e), T.add(M)
        }),
        S = function () {
            var e = new THREE.Vector3;
            return function (t, o) {
                !0 === s.screenSpacePanning ? e.setFromMatrixColumn(o, 1) : (e.setFromMatrixColumn(o, 0), e.crossVectors(s.object.up, e)), e.multiplyScalar(t), T.add(e)
            }
        }(),
        k = function () {
            var e = new THREE.Vector3;
            return function (t, o) {
                var n = s.domElement === document ? s.domElement.body : s.domElement;
                if (s.object.isPerspectiveCamera) {
                    var a = s.object.position;
                    e.copy(a).sub(s.target);
                    var i = e.length();
                    i *= Math.tan(s.object.fov / 2 * Math.PI / 180), C(2 * t * i / n.clientHeight, s.object.matrix), S(2 * o * i / n.clientHeight, s.object.matrix)
                } else s.object.isOrthographicCamera ? (C(t * (s.object.right - s.object.left) / s.object.zoom / n.clientWidth, s.object.matrix), S(o * (s.object.top - s.object.bottom) / s.object.zoom / n.clientHeight, s.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), s.enablePan = !1)
            }
        }();

    function Y(e) {
        s.object.isPerspectiveCamera ? b /= e : s.object.isOrthographicCamera ? (s.object.zoom = Math.max(s.minZoom, Math.min(s.maxZoom, s.object.zoom * e)), s.object.updateProjectionMatrix(), O = !0) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), s.enableZoom = !1)
    }

    function D(e) {
        s.object.isPerspectiveCamera ? b *= e : s.object.isOrthographicCamera ? (s.object.zoom = Math.max(s.minZoom, Math.min(s.maxZoom, s.object.zoom / e)), s.object.updateProjectionMatrix(), O = !0) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), s.enableZoom = !1)
    }

    function U(e) {
        f.set(e.clientX, e.clientY)
    }

    function x(e) {
        H.set(e.clientX, e.clientY)
    }

    function V(e) {
        if (1 == e.touches.length) f.set(e.touches[0].pageX, e.touches[0].pageY);
        else {
            var t = .5 * (e.touches[0].pageX + e.touches[1].pageX),
                o = .5 * (e.touches[0].pageY + e.touches[1].pageY);
            f.set(t, o)
        }
    }

    function z(e) {
        if (1 == e.touches.length) H.set(e.touches[0].pageX, e.touches[0].pageY);
        else {
            var t = .5 * (e.touches[0].pageX + e.touches[1].pageX),
                o = .5 * (e.touches[0].pageY + e.touches[1].pageY);
            H.set(t, o)
        }
    }

    function X(e) {
        var t = e.touches[0].pageX - e.touches[1].pageX,
            o = e.touches[0].pageY - e.touches[1].pageY,
            n = Math.sqrt(t * t + o * o);
        P.set(0, n)
    }

    function _(e) {
        if (1 == e.touches.length) R.set(e.touches[0].pageX, e.touches[0].pageY);
        else {
            var t = .5 * (e.touches[0].pageX + e.touches[1].pageX),
                o = .5 * (e.touches[0].pageY + e.touches[1].pageY);
            R.set(t, o)
        }
        g.subVectors(R, f).multiplyScalar(s.rotateSpeed);
        var n = s.domElement === document ? s.domElement.body : s.domElement;
        w(2 * Math.PI * g.x / n.clientHeight), j(2 * Math.PI * g.y / n.clientHeight), f.copy(R)
    }

    function Z(e) {
        if (1 == e.touches.length) v.set(e.touches[0].pageX, e.touches[0].pageY);
        else {
            var t = .5 * (e.touches[0].pageX + e.touches[1].pageX),
                o = .5 * (e.touches[0].pageY + e.touches[1].pageY);
            v.set(t, o)
        }
        y.subVectors(v, H).multiplyScalar(s.panSpeed), k(y.x, y.y), H.copy(v)
    }

    function F(e) {
        var t = e.touches[0].pageX - e.touches[1].pageX,
            o = e.touches[0].pageY - e.touches[1].pageY,
            n = Math.sqrt(t * t + o * o);
        N.set(0, n), A.set(0, Math.pow(N.y / P.y, s.zoomSpeed)), Y(A.y), P.copy(N)
    }

    function I(e) {
        if (!1 !== s.enabled) {
            switch (e.preventDefault(), s.domElement.focus ? s.domElement.focus() : window.focus(), e.button) {
                case 0:
                    switch (s.mouseButtons.LEFT) {
                        case THREE.MOUSE.ROTATE:
                            if (e.ctrlKey || e.metaKey || e.shiftKey) {
                                if (!1 === s.enablePan) return;
                                x(e), m = l.PAN
                            } else {
                                if (!1 === s.enableRotate) return;
                                U(e), m = l.ROTATE
                            }
                            break;
                        case THREE.MOUSE.PAN:
                            if (e.ctrlKey || e.metaKey || e.shiftKey) {
                                if (!1 === s.enableRotate) return;
                                U(e), m = l.ROTATE
                            } else {
                                if (!1 === s.enablePan) return;
                                x(e), m = l.PAN
                            }
                            break;
                        default:
                            m = l.NONE
                    }
                    break;
                case 1:
                    switch (s.mouseButtons.MIDDLE) {
                        case THREE.MOUSE.DOLLY:
                            if (!1 === s.enableZoom) return;
                            ! function (e) {
                                P.set(e.clientX, e.clientY)
                            }(e), m = l.DOLLY;
                            break;
                        default:
                            m = l.NONE
                    }
                    break;
                case 2:
                    switch (s.mouseButtons.RIGHT) {
                        case THREE.MOUSE.ROTATE:
                            if (!1 === s.enableRotate) return;
                            U(e), m = l.ROTATE;
                            break;
                        case THREE.MOUSE.PAN:
                            if (!1 === s.enablePan) return;
                            x(e), m = l.PAN;
                            break;
                        default:
                            m = l.NONE
                    }
            }
            m !== l.NONE && (document.addEventListener("mousemove", B, !1), document.addEventListener("mouseup", G, !1), s.dispatchEvent(u))
        }
    }

    function B(e) {
        if (!1 !== s.enabled) switch (e.preventDefault(), m) {
            case l.ROTATE:
                if (!1 === s.enableRotate) return;
                ! function (e) {
                    R.set(e.clientX, e.clientY), g.subVectors(R, f).multiplyScalar(s.rotateSpeed);
                    var t = s.domElement === document ? s.domElement.body : s.domElement;
                    w(2 * Math.PI * g.x / t.clientHeight), j(2 * Math.PI * g.y / t.clientHeight), f.copy(R), s.update()
                }(e);
                break;
            case l.DOLLY:
                if (!1 === s.enableZoom) return;
                ! function (e) {
                    N.set(e.clientX, e.clientY), A.subVectors(N, P), A.y > 0 ? Y(L()) : A.y < 0 && D(L()), P.copy(N), s.update()
                }(e);
                break;
            case l.PAN:
                if (!1 === s.enablePan) return;
                ! function (e) {
                    v.set(e.clientX, e.clientY), y.subVectors(v, H).multiplyScalar(s.panSpeed), k(y.x, y.y), H.copy(v), s.update()
                }(e)
        }
    }

    function G(e) {
        !1 !== s.enabled && (document.removeEventListener("mousemove", B, !1), document.removeEventListener("mouseup", G, !1), s.dispatchEvent(E), m = l.NONE)
    }

    function K(e) {
        !1 === s.enabled || !1 === s.enableZoom || m !== l.NONE && m !== l.ROTATE || (e.preventDefault(), e.stopPropagation(), s.dispatchEvent(u), function (e) {
            e.deltaY < 0 ? D(L()) : e.deltaY > 0 && Y(L()), s.update()
        }(e), s.dispatchEvent(E))
    }

    function W(e) {
        !1 !== s.enabled && !1 !== s.enableKeys && !1 !== s.enablePan && function (e) {
            var t = !1;
            switch (e.keyCode) {
                case s.keys.UP:
                    k(0, s.keyPanSpeed), t = !0;
                    break;
                case s.keys.BOTTOM:
                    k(0, -s.keyPanSpeed), t = !0;
                    break;
                case s.keys.LEFT:
                    k(s.keyPanSpeed, 0), t = !0;
                    break;
                case s.keys.RIGHT:
                    k(-s.keyPanSpeed, 0), t = !0
            }
            t && (e.preventDefault(), s.update())
        }(e)
    }

    function q(e) {
        if (!1 !== s.enabled) {
            switch (e.preventDefault(), e.touches.length) {
                case 1:
                    switch (s.touches.ONE) {
                        case THREE.TOUCH.ROTATE:
                            if (!1 === s.enableRotate) return;
                            V(e), m = l.TOUCH_ROTATE;
                            break;
                        case THREE.TOUCH.PAN:
                            if (!1 === s.enablePan) return;
                            z(e), m = l.TOUCH_PAN;
                            break;
                        default:
                            m = l.NONE
                    }
                    break;
                case 2:
                    switch (s.touches.TWO) {
                        case THREE.TOUCH.DOLLY_PAN:
                            if (!1 === s.enableZoom && !1 === s.enablePan) return;
                            ! function (e) {
                                s.enableZoom && X(e), s.enablePan && z(e)
                            }(e), m = l.TOUCH_DOLLY_PAN;
                            break;
                        case THREE.TOUCH.DOLLY_ROTATE:
                            if (!1 === s.enableZoom && !1 === s.enableRotate) return;
                            ! function (e) {
                                s.enableZoom && X(e), s.enableRotate && V(e)
                            }(e), m = l.TOUCH_DOLLY_ROTATE;
                            break;
                        default:
                            m = l.NONE
                    }
                    break;
                default:
                    m = l.NONE
            }
            m !== l.NONE && s.dispatchEvent(u)
        }
    }

    function Q(e) {
        if (!1 !== s.enabled) switch (e.preventDefault(), e.stopPropagation(), m) {
            case l.TOUCH_ROTATE:
                if (!1 === s.enableRotate) return;
                _(e), s.update();
                break;
            case l.TOUCH_PAN:
                if (!1 === s.enablePan) return;
                Z(e), s.update();
                break;
            case l.TOUCH_DOLLY_PAN:
                if (!1 === s.enableZoom && !1 === s.enablePan) return;
                ! function (e) {
                    s.enableZoom && F(e), s.enablePan && Z(e)
                }(e), s.update();
                break;
            case l.TOUCH_DOLLY_ROTATE:
                if (!1 === s.enableZoom && !1 === s.enableRotate) return;
                ! function (e) {
                    s.enableZoom && F(e), s.enableRotate && _(e)
                }(e), s.update();
                break;
            default:
                m = l.NONE
        }
    }

    function J(e) {
        !1 !== s.enabled && (s.dispatchEvent(E), m = l.NONE)
    }

    function $(e) {
        !1 !== s.enabled && e.preventDefault()
    }
    s.domElement.addEventListener("contextmenu", $, !1), s.domElement.addEventListener("mousedown", I, !1), s.domElement.addEventListener("wheel", K, !1), s.domElement.addEventListener("touchstart", q, !1), s.domElement.addEventListener("touchend", J, !1), s.domElement.addEventListener("touchmove", Q, !1), window.addEventListener("keydown", W, !1), this.update()
}, THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype), THREE.OrbitControls.prototype.constructor = THREE.OrbitControls, THREE.MapControls = function (e, t) {
    THREE.OrbitControls.call(this, e, t), this.mouseButtons.LEFT = THREE.MOUSE.PAN, this.mouseButtons.RIGHT = THREE.MOUSE.ROTATE, this.touches.ONE = THREE.TOUCH.PAN, this.touches.TWO = THREE.TOUCH.DOLLY_ROTATE
}, THREE.MapControls.prototype = Object.create(THREE.EventDispatcher.prototype), THREE.MapControls.prototype.constructor = THREE.MapControls, module.exports = exports.default = THREE.OrbitControls;
//# sourceMappingURL=/sm/afd4831257d5a011e6931de12543329d6cf17db5eafc0af52892dbdf70f7b4e7.map