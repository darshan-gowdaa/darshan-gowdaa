// src/components/atoms/LiquidEther.jsx
// Raw WebGL fluid simulation — no Three.js dependency
// Simulation math is identical to the Three.js version; only the GPU API layer changed.
import { useEffect, useRef } from 'react';

export default function LiquidEther({
    mouseForce = 20,
    cursorSize = 100,
    isViscous = false,
    viscous = 30,
    iterationsViscous = 32,
    iterationsPoisson = 32,
    dt = 0.014,
    BFECC = true,
    resolution = 0.5,
    isBounce = false,
    colors = ['#5227FF', '#FF9FFC', '#B19EEF'],
    style = {},
    className = '',
    autoDemo = true,
    autoSpeed = 0.5,
    autoIntensity = 2.2,
    takeoverDuration = 0.25,
    autoResumeDelay = 1000,
    autoRampDuration = 0.6
}) {
    const mountRef = useRef(null);
    const webglRef = useRef(null);
    const rafRef = useRef(null);
    const resizeObserverRef = useRef(null);
    const intersectionObserverRef = useRef(null);
    const isVisibleRef = useRef(true);
    const resizeRafRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        let rIC = null;
        let tID = null;
        let isCancelled = false;

        const initWebGL = () => {
            if (isCancelled || !mountRef.current) return;

        // ── helpers ──────────────────────────────────────────────────────
        function hexToRGB(hex) {
            hex = hex.replace('#', '');
            if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
            return [
                parseInt(hex.substring(0,2), 16) / 255,
                parseInt(hex.substring(2,4), 16) / 255,
                parseInt(hex.substring(4,6), 16) / 255,
            ];
        }

        function makePaletteData(stops) {
            let arr = (Array.isArray(stops) && stops.length > 0)
                ? (stops.length === 1 ? [stops[0], stops[0]] : stops)
                : ['#ffffff', '#ffffff'];
            const w = arr.length;
            const data = new Uint8Array(w * 4);
            for (let i = 0; i < w; i++) {
                const [r, g, b] = hexToRGB(arr[i]);
                data[i*4+0] = Math.round(r * 255);
                data[i*4+1] = Math.round(g * 255);
                data[i*4+2] = Math.round(b * 255);
                data[i*4+3] = 255;
            }
            return { data, width: w };
        }

        // ── GL helpers ───────────────────────────────────────────────────
        function createShader(gl, type, source) {
            const s = gl.createShader(type);
            gl.shaderSource(s, source);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl.getShaderInfoLog(s));
                gl.deleteShader(s);
                return null;
            }
            return s;
        }

        function createProgram(gl, vsSrc, fsSrc) {
            const vs = createShader(gl, gl.VERTEX_SHADER, vsSrc);
            const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSrc);
            if (!vs || !fs) return null;
            const prog = gl.createProgram();
            gl.attachShader(prog, vs);
            gl.attachShader(prog, fs);
            gl.linkProgram(prog);
            if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
                console.error('Program link error:', gl.getProgramInfoLog(prog));
                return null;
            }
            // Shaders can be deleted after linking
            gl.deleteShader(vs);
            gl.deleteShader(fs);
            return prog;
        }

        function createFBO(gl, w, h) {
            const tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            // Use HALF_FLOAT if available (better perf on mobile), else FLOAT
            const halfFloatExt = gl.getExtension('OES_texture_half_float');
            const useHalfFloat = !!halfFloatExt;
            const floatType = useHalfFloat ? halfFloatExt.HALF_FLOAT_OES : gl.FLOAT;
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, floatType, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            const fb = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.bindTexture(gl.TEXTURE_2D, null);
            return { texture: tex, framebuffer: fb, width: w, height: h };
        }

        function resizeFBO(gl, fbo, w, h) {
            const halfFloatExt = gl.getExtension('OES_texture_half_float');
            const useHalfFloat = !!halfFloatExt;
            const floatType = useHalfFloat ? halfFloatExt.HALF_FLOAT_OES : gl.FLOAT;
            gl.bindTexture(gl.TEXTURE_2D, fbo.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, floatType, null);
            gl.bindTexture(gl.TEXTURE_2D, null);
            fbo.width = w;
            fbo.height = h;
        }

        // ── shaders ──────────────────────────────────────────────────────
        const QUAD_VS = `
            attribute vec2 a_position;
            varying vec2 uv;
            void main() {
                uv = a_position * 0.5 + 0.5;
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        const ADVECTION_VS = `
            attribute vec2 a_position;
            uniform vec2 u_boundarySpace;
            varying vec2 uv;
            void main() {
                vec2 scale = 1.0 - u_boundarySpace * 2.0;
                vec2 pos = a_position * scale;
                uv = pos * 0.5 + 0.5;
                gl_Position = vec4(pos, 0.0, 1.0);
            }
        `;

        const ADVECTION_FS = `
            precision highp float;
            uniform sampler2D u_velocity;
            uniform float u_dt;
            uniform bool u_isBFECC;
            uniform vec2 u_fboSize;
            varying vec2 uv;
            void main() {
                vec2 ratio = max(u_fboSize.x, u_fboSize.y) / u_fboSize;
                if (!u_isBFECC) {
                    vec2 vel = texture2D(u_velocity, uv).xy;
                    vec2 uv2 = uv - vel * u_dt * ratio;
                    gl_FragColor = vec4(texture2D(u_velocity, uv2).xy, 0.0, 0.0);
                } else {
                    vec2 spot_new = uv;
                    vec2 vel_old = texture2D(u_velocity, uv).xy;
                    vec2 spot_old = spot_new - vel_old * u_dt * ratio;
                    vec2 vel_new1 = texture2D(u_velocity, spot_old).xy;
                    vec2 spot_new2 = spot_old + vel_new1 * u_dt * ratio;
                    vec2 error = spot_new2 - spot_new;
                    vec2 spot_new3 = spot_new - error / 2.0;
                    vec2 vel_2 = texture2D(u_velocity, spot_new3).xy;
                    vec2 spot_old2 = spot_new3 - vel_2 * u_dt * ratio;
                    gl_FragColor = vec4(texture2D(u_velocity, spot_old2).xy, 0.0, 0.0);
                }
            }
        `;

        const EXTERNAL_FORCE_VS = `
            attribute vec2 a_position;
            attribute vec2 a_uv;
            uniform vec2 u_center;
            uniform vec2 u_scale;
            uniform vec2 u_px;
            varying vec2 vUv;
            void main() {
                vec2 pos = a_position * u_scale * 2.0 * u_px + u_center;
                vUv = a_uv;
                gl_Position = vec4(pos, 0.0, 1.0);
            }
        `;

        const EXTERNAL_FORCE_FS = `
            precision highp float;
            uniform vec2 u_force;
            varying vec2 vUv;
            void main() {
                vec2 circle = (vUv - 0.5) * 2.0;
                float d = 1.0 - min(length(circle), 1.0);
                d *= d;
                gl_FragColor = vec4(u_force * d, 0.0, 1.0);
            }
        `;

        const DIVERGENCE_FS = `
            precision highp float;
            uniform sampler2D u_velocity;
            uniform float u_dt;
            uniform vec2 u_px;
            varying vec2 uv;
            void main() {
                float x0 = texture2D(u_velocity, uv - vec2(u_px.x, 0.0)).x;
                float x1 = texture2D(u_velocity, uv + vec2(u_px.x, 0.0)).x;
                float y0 = texture2D(u_velocity, uv - vec2(0.0, u_px.y)).y;
                float y1 = texture2D(u_velocity, uv + vec2(0.0, u_px.y)).y;
                float div = (x1 - x0 + y1 - y0) / 2.0;
                gl_FragColor = vec4(div / u_dt);
            }
        `;

        const POISSON_FS = `
            precision highp float;
            uniform sampler2D u_pressure;
            uniform sampler2D u_divergence;
            uniform vec2 u_px;
            varying vec2 uv;
            void main() {
                float p0 = texture2D(u_pressure, uv + vec2(u_px.x * 2.0, 0.0)).r;
                float p1 = texture2D(u_pressure, uv - vec2(u_px.x * 2.0, 0.0)).r;
                float p2 = texture2D(u_pressure, uv + vec2(0.0, u_px.y * 2.0)).r;
                float p3 = texture2D(u_pressure, uv - vec2(0.0, u_px.y * 2.0)).r;
                float div = texture2D(u_divergence, uv).r;
                gl_FragColor = vec4((p0 + p1 + p2 + p3) / 4.0 - div);
            }
        `;

        const PRESSURE_FS = `
            precision highp float;
            uniform sampler2D u_pressure;
            uniform sampler2D u_velocity;
            uniform vec2 u_px;
            uniform float u_dt;
            varying vec2 uv;
            void main() {
                float p0 = texture2D(u_pressure, uv + vec2(u_px.x, 0.0)).r;
                float p1 = texture2D(u_pressure, uv - vec2(u_px.x, 0.0)).r;
                float p2 = texture2D(u_pressure, uv + vec2(0.0, u_px.y)).r;
                float p3 = texture2D(u_pressure, uv - vec2(0.0, u_px.y)).r;
                vec2 v = texture2D(u_velocity, uv).xy;
                vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;
                gl_FragColor = vec4(v - gradP * u_dt, 0.0, 1.0);
            }
        `;

        const VISCOUS_FS = `
            precision highp float;
            uniform sampler2D u_velocity;
            uniform sampler2D u_velocity_new;
            uniform float u_v;
            uniform vec2 u_px;
            uniform float u_dt;
            varying vec2 uv;
            void main() {
                vec2 old = texture2D(u_velocity, uv).xy;
                vec2 n0 = texture2D(u_velocity_new, uv + vec2(u_px.x * 2.0, 0.0)).xy;
                vec2 n1 = texture2D(u_velocity_new, uv - vec2(u_px.x * 2.0, 0.0)).xy;
                vec2 n2 = texture2D(u_velocity_new, uv + vec2(0.0, u_px.y * 2.0)).xy;
                vec2 n3 = texture2D(u_velocity_new, uv - vec2(0.0, u_px.y * 2.0)).xy;
                vec2 newv = 4.0 * old + u_v * u_dt * (n0 + n1 + n2 + n3);
                newv /= 4.0 * (1.0 + u_v * u_dt);
                gl_FragColor = vec4(newv, 0.0, 0.0);
            }
        `;

        const COLOR_FS = `
            precision highp float;
            uniform sampler2D u_velocity;
            uniform sampler2D u_palette;
            uniform vec4 u_bgColor;
            varying vec2 uv;
            void main() {
                vec2 vel = texture2D(u_velocity, uv).xy;
                float lenv = clamp(length(vel), 0.0, 1.0);
                vec3 c = texture2D(u_palette, vec2(lenv, 0.5)).rgb;
                vec3 outRGB = mix(u_bgColor.rgb, c, lenv);
                float outA = mix(u_bgColor.a, 1.0, lenv);
                gl_FragColor = vec4(outRGB, outA);
            }
        `;

        // boundary lines vertex shader (for bounce mode)
        const BOUNDARY_VS = `
            attribute vec2 a_position;
            uniform vec2 u_px;
            varying vec2 uv;
            void main() {
                vec2 pos = a_position;
                uv = pos * 0.5 + 0.5;
                vec2 n = sign(pos);
                pos = abs(pos) - u_px;
                pos *= n;
                gl_Position = vec4(pos, 0.0, 1.0);
            }
        `;

        // ── Canvas & GL Init ──────────────────────────────────────────────
        const container = mountRef.current;
        container.style.position = container.style.position || 'relative';
        container.style.overflow = container.style.overflow || 'hidden';

        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        container.prepend(canvas);

        const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false })
            || canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false, antialias: false });

        if (!gl) {
            console.error('WebGL not supported');
            return;
        }

        // Required extensions
        gl.getExtension('OES_texture_float');
        gl.getExtension('OES_texture_half_float');
        gl.getExtension('OES_texture_float_linear');
        gl.getExtension('OES_texture_half_float_linear');

        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

        // ── Fullscreen Quad Geometry ──────────────────────────────────────
        const quadVerts = new Float32Array([-1,-1, 1,-1, -1,1, 1,1]);
        const quadBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
        gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW);

        // Mouse plane (1x1 with UVs)
        const mousePlanePos = new Float32Array([-0.5,-0.5, 0.5,-0.5, -0.5,0.5, 0.5,0.5]);
        const mousePlaneUV = new Float32Array([0,0, 1,0, 0,1, 1,1]);
        const mousePosBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mousePosBuf);
        gl.bufferData(gl.ARRAY_BUFFER, mousePlanePos, gl.STATIC_DRAW);
        const mouseUVBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mouseUVBuf);
        gl.bufferData(gl.ARRAY_BUFFER, mousePlaneUV, gl.STATIC_DRAW);

        // Boundary lines
        const boundaryVerts = new Float32Array([
            -1,-1, -1,1, -1,1, 1,1, 1,1, 1,-1, 1,-1, -1,-1
        ]);
        const boundaryBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, boundaryBuf);
        gl.bufferData(gl.ARRAY_BUFFER, boundaryVerts, gl.STATIC_DRAW);

        // ── Create Programs ──────────────────────────────────────────────
        const progAdvection = createProgram(gl, ADVECTION_VS, ADVECTION_FS);
        const progBoundary = createProgram(gl, BOUNDARY_VS, ADVECTION_FS);
        const progExternalForce = createProgram(gl, EXTERNAL_FORCE_VS, EXTERNAL_FORCE_FS);
        const progDivergence = createProgram(gl, ADVECTION_VS, DIVERGENCE_FS);
        const progPoisson = createProgram(gl, ADVECTION_VS, POISSON_FS);
        const progPressure = createProgram(gl, ADVECTION_VS, PRESSURE_FS);
        const progViscous = createProgram(gl, ADVECTION_VS, VISCOUS_FS);
        const progColor = createProgram(gl, QUAD_VS, COLOR_FS);

        // ── Palette Texture ──────────────────────────────────────────────
        const palData = makePaletteData(colors);
        const palTex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, palTex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, palData.width, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, palData.data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // ── State ────────────────────────────────────────────────────────
        let canvasW = 1, canvasH = 1;
        let simW = 1, simH = 1;
        let cellScaleX = 1, cellScaleY = 1;

        // FBOs
        let vel0, vel1, velVisc0, velVisc1, divFbo, pres0, pres1;

        // Simulation options (mutable)
        const simOpts = {
            mouse_force: mouseForce,
            cursor_size: cursorSize,
            isViscous,
            viscous,
            iterations_viscous: iterationsViscous,
            iterations_poisson: iterationsPoisson,
            dt,
            BFECC,
            resolution,
            isBounce,
        };

        // Mouse state
        const mouse = {
            coords: [0, 0],
            coordsOld: [0, 0],
            diff: [0, 0],
            mouseMoved: false,
            isHoverInside: false,
            hasUserControl: false,
            isAutoActive: false,
            autoIntensity: autoIntensity,
            takeoverActive: false,
            takeoverStartTime: 0,
            takeoverDuration: takeoverDuration,
            takeoverFrom: [0, 0],
            takeoverTo: [0, 0],
            timer: null,
        };

        // Auto driver state
        const auto = {
            enabled: autoDemo,
            speed: autoSpeed,
            resumeDelay: autoResumeDelay,
            rampDurationMs: autoRampDuration * 1000,
            active: false,
            current: [0, 0],
            target: [0, 0],
            lastTime: performance.now(),
            activationTime: 0,
            margin: 0.2,
        };
        pickNewAutoTarget();

        let lastUserInteraction = performance.now();
        let lastClockTime = performance.now();
        let running = false;

        // ── Sizing ───────────────────────────────────────────────────────
        function calcSize() {
            const rect = container.getBoundingClientRect();
            canvasW = Math.max(1, Math.floor(rect.width));
            canvasH = Math.max(1, Math.floor(rect.height));
            canvas.width = Math.floor(canvasW * pixelRatio);
            canvas.height = Math.floor(canvasH * pixelRatio);
            simW = Math.max(1, Math.round(simOpts.resolution * canvasW));
            simH = Math.max(1, Math.round(simOpts.resolution * canvasH));
            cellScaleX = 1.0 / simW;
            cellScaleY = 1.0 / simH;
        }

        function createFBOs() {
            vel0 = createFBO(gl, simW, simH);
            vel1 = createFBO(gl, simW, simH);
            velVisc0 = createFBO(gl, simW, simH);
            velVisc1 = createFBO(gl, simW, simH);
            divFbo = createFBO(gl, simW, simH);
            pres0 = createFBO(gl, simW, simH);
            pres1 = createFBO(gl, simW, simH);
        }

        function resizeFBOs() {
            [vel0, vel1, velVisc0, velVisc1, divFbo, pres0, pres1].forEach(fbo => resizeFBO(gl, fbo, simW, simH));
        }

        function resize() {
            const oldRes = simOpts.resolution;
            calcSize();
            const newSimW = Math.max(1, Math.round(simOpts.resolution * canvasW));
            const newSimH = Math.max(1, Math.round(simOpts.resolution * canvasH));
            if (newSimW !== simW || newSimH !== simH || !vel0) {
                simW = newSimW;
                simH = newSimH;
                cellScaleX = 1.0 / simW;
                cellScaleY = 1.0 / simH;
                if (vel0) resizeFBOs();
            }
        }

        // ── Mouse Event Handlers ─────────────────────────────────────────
        function isPointInside(cx, cy) {
            const rect = container.getBoundingClientRect();
            return cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom;
        }

        function setCoords(x, y) {
            const rect = container.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;
            const nx = (x - rect.left) / rect.width;
            const ny = (y - rect.top) / rect.height;
            mouse.coords[0] = nx * 2 - 1;
            mouse.coords[1] = -(ny * 2 - 1);
            mouse.mouseMoved = true;
            if (mouse.timer) clearTimeout(mouse.timer);
            mouse.timer = setTimeout(() => { mouse.mouseMoved = false; }, 100);
        }

        function setNormalized(nx, ny) {
            mouse.coords[0] = nx;
            mouse.coords[1] = ny;
            mouse.mouseMoved = true;
        }

        function onInteract() {
            lastUserInteraction = performance.now();
            if (auto.active) {
                auto.active = false;
                mouse.isAutoActive = false;
            }
        }

        function onMouseMove(event) {
            if (!isPointInside(event.clientX, event.clientY)) {
                mouse.isHoverInside = false;
                return;
            }
            mouse.isHoverInside = true;
            onInteract();
            if (mouse.isAutoActive && !mouse.hasUserControl && !mouse.takeoverActive) {
                const rect = container.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0) return;
                const nx = (event.clientX - rect.left) / rect.width;
                const ny = (event.clientY - rect.top) / rect.height;
                mouse.takeoverFrom[0] = mouse.coords[0];
                mouse.takeoverFrom[1] = mouse.coords[1];
                mouse.takeoverTo[0] = nx * 2 - 1;
                mouse.takeoverTo[1] = -(ny * 2 - 1);
                mouse.takeoverStartTime = performance.now();
                mouse.takeoverActive = true;
                mouse.hasUserControl = true;
                mouse.isAutoActive = false;
                return;
            }
            setCoords(event.clientX, event.clientY);
            mouse.hasUserControl = true;
        }

        function onTouchStart(event) {
            if (event.touches.length !== 1) return;
            const t = event.touches[0];
            if (!isPointInside(t.clientX, t.clientY)) return;
            mouse.isHoverInside = true;
            onInteract();
            setCoords(t.clientX, t.clientY);
            mouse.hasUserControl = true;
        }

        function onTouchMove(event) {
            if (event.touches.length !== 1) return;
            const t = event.touches[0];
            if (!isPointInside(t.clientX, t.clientY)) return;
            onInteract();
            setCoords(t.clientX, t.clientY);
        }

        function onTouchEnd() { mouse.isHoverInside = false; }
        function onDocLeave() { mouse.isHoverInside = false; }

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: true });
        window.addEventListener('touchend', onTouchEnd);
        document.addEventListener('mouseleave', onDocLeave);

        function updateMouse() {
            if (mouse.takeoverActive) {
                const t = (performance.now() - mouse.takeoverStartTime) / (mouse.takeoverDuration * 1000);
                if (t >= 1) {
                    mouse.takeoverActive = false;
                    mouse.coords[0] = mouse.takeoverTo[0];
                    mouse.coords[1] = mouse.takeoverTo[1];
                    mouse.coordsOld[0] = mouse.coords[0];
                    mouse.coordsOld[1] = mouse.coords[1];
                    mouse.diff[0] = 0; mouse.diff[1] = 0;
                } else {
                    const k = t * t * (3 - 2 * t);
                    mouse.coords[0] = mouse.takeoverFrom[0] + (mouse.takeoverTo[0] - mouse.takeoverFrom[0]) * k;
                    mouse.coords[1] = mouse.takeoverFrom[1] + (mouse.takeoverTo[1] - mouse.takeoverFrom[1]) * k;
                }
            }
            mouse.diff[0] = mouse.coords[0] - mouse.coordsOld[0];
            mouse.diff[1] = mouse.coords[1] - mouse.coordsOld[1];
            mouse.coordsOld[0] = mouse.coords[0];
            mouse.coordsOld[1] = mouse.coords[1];
            if (mouse.coordsOld[0] === 0 && mouse.coordsOld[1] === 0) { mouse.diff[0] = 0; mouse.diff[1] = 0; }
            if (mouse.isAutoActive && !mouse.takeoverActive) {
                mouse.diff[0] *= mouse.autoIntensity;
                mouse.diff[1] *= mouse.autoIntensity;
            }
        }

        // ── Auto Driver ──────────────────────────────────────────────────
        function pickNewAutoTarget() {
            auto.target[0] = (Math.random() * 2 - 1) * (1 - auto.margin);
            auto.target[1] = (Math.random() * 2 - 1) * (1 - auto.margin);
        }

        function updateAutoDriver() {
            if (!auto.enabled) return;
            const now = performance.now();
            const idle = now - lastUserInteraction;
            if (idle < auto.resumeDelay) {
                if (auto.active) { auto.active = false; mouse.isAutoActive = false; }
                return;
            }
            if (!auto.active) {
                auto.active = true;
                auto.current[0] = mouse.coords[0];
                auto.current[1] = mouse.coords[1];
                auto.lastTime = now;
                auto.activationTime = now;
            }
            mouse.isAutoActive = true;
            let dtSec = (now - auto.lastTime) / 1000;
            auto.lastTime = now;
            if (dtSec > 0.2) dtSec = 0.016;
            const dx = auto.target[0] - auto.current[0];
            const dy = auto.target[1] - auto.current[1];
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 0.01) { pickNewAutoTarget(); return; }
            const nx = dx / dist, ny = dy / dist;
            let ramp = 1;
            if (auto.rampDurationMs > 0) {
                const t = Math.min(1, (now - auto.activationTime) / auto.rampDurationMs);
                ramp = t * t * (3 - 2 * t);
            }
            const step = auto.speed * dtSec * ramp;
            const move = Math.min(step, dist);
            auto.current[0] += nx * move;
            auto.current[1] += ny * move;
            setNormalized(auto.current[0], auto.current[1]);
        }

        // ── Render Helpers ───────────────────────────────────────────────
        function bindQuad(prog) {
            const loc = gl.getAttribLocation(prog, 'a_position');
            gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
            gl.enableVertexAttribArray(loc);
            gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        }

        function drawQuad() {
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }

        function renderToFBO(fbo) {
            if (fbo) {
                gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.framebuffer);
                gl.viewport(0, 0, fbo.width, fbo.height);
            } else {
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.viewport(0, 0, canvas.width, canvas.height);
            }
        }

        function setTex(prog, name, tex, unit) {
            gl.activeTexture(gl.TEXTURE0 + unit);
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.uniform1i(gl.getUniformLocation(prog, name), unit);
        }

        // ── Simulation Step ──────────────────────────────────────────────
        function simulate() {
            const bSpace = simOpts.isBounce ? 0 : 1;
            const bsX = bSpace * cellScaleX;
            const bsY = bSpace * cellScaleY;

            // 1. Advection
            gl.useProgram(progAdvection);
            bindQuad(progAdvection);
            gl.uniform2f(gl.getUniformLocation(progAdvection, 'u_boundarySpace'), bsX, bsY);
            gl.uniform2f(gl.getUniformLocation(progAdvection, 'u_px'), cellScaleX, cellScaleY);
            gl.uniform2f(gl.getUniformLocation(progAdvection, 'u_fboSize'), simW, simH);
            gl.uniform1f(gl.getUniformLocation(progAdvection, 'u_dt'), simOpts.dt);
            gl.uniform1i(gl.getUniformLocation(progAdvection, 'u_isBFECC'), simOpts.BFECC ? 1 : 0);
            setTex(progAdvection, 'u_velocity', vel0.texture, 0);
            renderToFBO(vel1);
            drawQuad();

            // Boundary lines (if bounce)
            if (simOpts.isBounce) {
                gl.useProgram(progBoundary);
                const bLoc = gl.getAttribLocation(progBoundary, 'a_position');
                gl.bindBuffer(gl.ARRAY_BUFFER, boundaryBuf);
                gl.enableVertexAttribArray(bLoc);
                gl.vertexAttribPointer(bLoc, 2, gl.FLOAT, false, 0, 0);
                gl.uniform2f(gl.getUniformLocation(progBoundary, 'u_px'), cellScaleX, cellScaleY);
                gl.uniform2f(gl.getUniformLocation(progBoundary, 'u_boundarySpace'), bsX, bsY);
                gl.uniform2f(gl.getUniformLocation(progBoundary, 'u_fboSize'), simW, simH);
                gl.uniform1f(gl.getUniformLocation(progBoundary, 'u_dt'), simOpts.dt);
                gl.uniform1i(gl.getUniformLocation(progBoundary, 'u_isBFECC'), simOpts.BFECC ? 1 : 0);
                setTex(progBoundary, 'u_velocity', vel0.texture, 0);
                // Still rendering to vel1
                gl.drawArrays(gl.LINES, 0, 8);
            }

            // 2. External Force (mouse)
            gl.useProgram(progExternalForce);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE);

            const posLoc = gl.getAttribLocation(progExternalForce, 'a_position');
            const uvLoc = gl.getAttribLocation(progExternalForce, 'a_uv');
            gl.bindBuffer(gl.ARRAY_BUFFER, mousePosBuf);
            gl.enableVertexAttribArray(posLoc);
            gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, mouseUVBuf);
            gl.enableVertexAttribArray(uvLoc);
            gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

            const forceX = (mouse.diff[0] / 2) * simOpts.mouse_force;
            const forceY = (mouse.diff[1] / 2) * simOpts.mouse_force;
            const csx = simOpts.cursor_size * cellScaleX;
            const csy = simOpts.cursor_size * cellScaleY;
            const centerX = Math.min(Math.max(mouse.coords[0], -1 + csx + cellScaleX*2), 1 - csx - cellScaleX*2);
            const centerY = Math.min(Math.max(mouse.coords[1], -1 + csy + cellScaleY*2), 1 - csy - cellScaleY*2);

            gl.uniform2f(gl.getUniformLocation(progExternalForce, 'u_force'), forceX, forceY);
            gl.uniform2f(gl.getUniformLocation(progExternalForce, 'u_center'), centerX, centerY);
            gl.uniform2f(gl.getUniformLocation(progExternalForce, 'u_scale'), simOpts.cursor_size, simOpts.cursor_size);
            gl.uniform2f(gl.getUniformLocation(progExternalForce, 'u_px'), cellScaleX, cellScaleY);

            renderToFBO(vel1);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            gl.disable(gl.BLEND);

            // 3. Viscous diffusion (if enabled)
            let velResult = vel1;
            if (simOpts.isViscous) {
                gl.useProgram(progViscous);
                bindQuad(progViscous);
                gl.uniform2f(gl.getUniformLocation(progViscous, 'u_boundarySpace'), bsX, bsY);
                gl.uniform2f(gl.getUniformLocation(progViscous, 'u_px'), cellScaleX, cellScaleY);
                gl.uniform1f(gl.getUniformLocation(progViscous, 'u_v'), simOpts.viscous);
                gl.uniform1f(gl.getUniformLocation(progViscous, 'u_dt'), simOpts.dt);
                setTex(progViscous, 'u_velocity', vel1.texture, 0);

                let fboIn, fboOut;
                for (let i = 0; i < simOpts.iterations_viscous; i++) {
                    fboIn = i % 2 === 0 ? velVisc0 : velVisc1;
                    fboOut = i % 2 === 0 ? velVisc1 : velVisc0;
                    setTex(progViscous, 'u_velocity_new', fboIn.texture, 1);
                    renderToFBO(fboOut);
                    drawQuad();
                }
                velResult = fboOut;
            }

            // 4. Divergence
            gl.useProgram(progDivergence);
            bindQuad(progDivergence);
            gl.uniform2f(gl.getUniformLocation(progDivergence, 'u_boundarySpace'), bsX, bsY);
            gl.uniform2f(gl.getUniformLocation(progDivergence, 'u_px'), cellScaleX, cellScaleY);
            gl.uniform1f(gl.getUniformLocation(progDivergence, 'u_dt'), simOpts.dt);
            setTex(progDivergence, 'u_velocity', velResult.texture, 0);
            renderToFBO(divFbo);
            drawQuad();

            // 5. Poisson (pressure solve)
            gl.useProgram(progPoisson);
            bindQuad(progPoisson);
            gl.uniform2f(gl.getUniformLocation(progPoisson, 'u_boundarySpace'), bsX, bsY);
            gl.uniform2f(gl.getUniformLocation(progPoisson, 'u_px'), cellScaleX, cellScaleY);
            setTex(progPoisson, 'u_divergence', divFbo.texture, 1);

            let presResult;
            for (let i = 0; i < simOpts.iterations_poisson; i++) {
                const pIn = i % 2 === 0 ? pres0 : pres1;
                const pOut = i % 2 === 0 ? pres1 : pres0;
                setTex(progPoisson, 'u_pressure', pIn.texture, 0);
                renderToFBO(pOut);
                drawQuad();
                presResult = pOut;
            }

            // 6. Pressure gradient subtraction
            gl.useProgram(progPressure);
            bindQuad(progPressure);
            gl.uniform2f(gl.getUniformLocation(progPressure, 'u_boundarySpace'), bsX, bsY);
            gl.uniform2f(gl.getUniformLocation(progPressure, 'u_px'), cellScaleX, cellScaleY);
            gl.uniform1f(gl.getUniformLocation(progPressure, 'u_dt'), simOpts.dt);
            setTex(progPressure, 'u_velocity', velResult.texture, 0);
            setTex(progPressure, 'u_pressure', presResult.texture, 1);
            renderToFBO(vel0);
            drawQuad();
        }

        // ── Color Output ─────────────────────────────────────────────────
        function renderOutput() {
            gl.useProgram(progColor);
            bindQuad(progColor);
            setTex(progColor, 'u_velocity', vel0.texture, 0);
            setTex(progColor, 'u_palette', palTex, 1);
            gl.uniform4f(gl.getUniformLocation(progColor, 'u_bgColor'), 0, 0, 0, 0);
            renderToFBO(null);
            drawQuad();
        }

        // ── Init & Loop ──────────────────────────────────────────────────
        calcSize();
        createFBOs();

        function loop() {
            if (!running) return;
            updateAutoDriver();
            updateMouse();
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            simulate();
            renderOutput();
            rafRef.current = requestAnimationFrame(loop);
        }

        function start() {
            if (running) return;
            running = true;
            lastClockTime = performance.now();
            loop();
        }

        function pause() {
            running = false;
            if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
        }

        function doResize() {
            const oldW = simW, oldH = simH;
            calcSize();
            simW = Math.max(1, Math.round(simOpts.resolution * canvasW));
            simH = Math.max(1, Math.round(simOpts.resolution * canvasH));
            cellScaleX = 1.0 / simW;
            cellScaleY = 1.0 / simH;
            if (simW !== oldW || simH !== oldH) resizeFBOs();
        }

        // Store manager for external updates
        const manager = {
            start, pause, doResize,
            simOpts, mouse, auto,
            dispose() {
                pause();
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('touchstart', onTouchStart);
                window.removeEventListener('touchmove', onTouchMove);
                window.removeEventListener('touchend', onTouchEnd);
                document.removeEventListener('mouseleave', onDocLeave);
                document.removeEventListener('visibilitychange', onVisibility);

                // Dispose FBOs
                [vel0, vel1, velVisc0, velVisc1, divFbo, pres0, pres1].forEach(fbo => {
                    if (fbo) {
                        gl.deleteTexture(fbo.texture);
                        gl.deleteFramebuffer(fbo.framebuffer);
                    }
                });
                // Dispose programs
                [progAdvection, progBoundary, progExternalForce, progDivergence,
                 progPoisson, progPressure, progViscous, progColor].forEach(p => { if (p) gl.deleteProgram(p); });
                // Dispose buffers
                [quadBuf, mousePosBuf, mouseUVBuf, boundaryBuf].forEach(b => { if (b) gl.deleteBuffer(b); });
                gl.deleteTexture(palTex);
                // Remove canvas
                if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
                // Lose context
                const ext = gl.getExtension('WEBGL_lose_context');
                if (ext) ext.loseContext();
            }
        };
        webglRef.current = manager;

        // Visibility change
        function onVisibility() {
            if (document.hidden) pause();
            else if (isVisibleRef.current) start();
        }
        document.addEventListener('visibilitychange', onVisibility);

        // IntersectionObserver
        const io = new IntersectionObserver(entries => {
            const e = entries[0];
            const vis = e.isIntersecting && e.intersectionRatio > 0;
            isVisibleRef.current = vis;
            if (vis && !document.hidden) start(); else pause();
        }, { threshold: [0, 0.01, 0.1] });
        io.observe(container);
        intersectionObserverRef.current = io;

        // ResizeObserver
        const ro = new ResizeObserver(() => {
            if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
            resizeRafRef.current = requestAnimationFrame(() => {
                if (!webglRef.current) return;
                doResize();
            });
        });
        ro.observe(container);
        resizeObserverRef.current = ro;

        }; // end of initWebGL

        // Defer WebGL init so we don't block the main thread during hydration/FCP
        if ('requestIdleCallback' in window) {
            rIC = requestIdleCallback(initWebGL, { timeout: 1000 });
        } else {
            tID = setTimeout(initWebGL, 100);
        }

        // ── Cleanup ──────────────────────────────────────────────────────
        return () => {
            isCancelled = true;
            if (rIC) cancelIdleCallback(rIC);
            if (tID) clearTimeout(tID);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
            try { resizeObserverRef.current?.disconnect(); } catch { void 0; }
            try { intersectionObserverRef.current?.disconnect(); } catch { void 0; }
            if (webglRef.current) webglRef.current.dispose();
            webglRef.current = null;
        };
    }, [

        BFECC, cursorSize, dt, isBounce, isViscous, iterationsPoisson,
        iterationsViscous, mouseForce, resolution, viscous, colors,
        autoDemo, autoSpeed, autoIntensity, takeoverDuration,
        autoResumeDelay, autoRampDuration
    ]);

    // Prop updates without full remount
    useEffect(() => {
        const mgr = webglRef.current;
        if (!mgr) return;
        const prevRes = mgr.simOpts.resolution;
        Object.assign(mgr.simOpts, {
            mouse_force: mouseForce,
            cursor_size: cursorSize,
            isViscous, viscous,
            iterations_viscous: iterationsViscous,
            iterations_poisson: iterationsPoisson,
            dt, BFECC, resolution, isBounce,
        });
        mgr.auto.enabled = autoDemo;
        mgr.auto.speed = autoSpeed;
        mgr.auto.resumeDelay = autoResumeDelay;
        mgr.auto.rampDurationMs = autoRampDuration * 1000;
        mgr.mouse.autoIntensity = autoIntensity;
        mgr.mouse.takeoverDuration = takeoverDuration;
        if (resolution !== prevRes) mgr.doResize();
    }, [
        mouseForce, cursorSize, isViscous, viscous, iterationsViscous,
        iterationsPoisson, dt, BFECC, resolution, isBounce,
        autoDemo, autoSpeed, autoIntensity, takeoverDuration,
        autoResumeDelay, autoRampDuration
    ]);

    return (
        <div
            ref={mountRef}
            className={`w-full h-full relative overflow-hidden pointer-events-none touch-none ${className || ''}`}
            style={style}
        />
    );
}
