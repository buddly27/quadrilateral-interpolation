import React from "react";
import vertexShader from "./shader/vertex.glsl";
import fragmentShader from "./shader/fragment.glsl";
import "./style.css";


export default function Canvas(props) {
    const canvas = React.useRef(null);
    const [state, setState] = React.useState({
        gl: null,
        program: null,
        locations: {
            position: null,
            colors: null,
            weights: null
        },
        buffers: {
            position: null
        }
    });

    const {weights} = props;
    const {gl, program, locations, buffers} = state;

    // Initialize GL context.
    const onInitiate = React.useCallback(() => {
        const state = initialize(canvas);
        setState(prevState => ({...prevState, ...state}));

    }, [canvas]);

    // Render scene.
    const onRender = React.useCallback(() => {
        if (!program)
            return;

        render(gl, program, locations, buffers, weights);

    }, [gl, program, locations, buffers, weights]);

    // Handle resizing event.
    React.useEffect(() => {
        window.addEventListener("resize", onRender);
        return () => window.removeEventListener("resize", onRender);
    }, [onRender]);

    // Handle state initialization.
    React.useEffect(() => onInitiate(), [canvas, onInitiate]);

    // Handle rendering.
    React.useEffect(() => onRender(), [gl, onRender]);

    return <canvas ref={canvas} className="Canvas" tabIndex="0" />
}


const initialize = (canvas) => {
    const gl = canvas.current.getContext("webgl");

    // Initiate shader program.
    const program = createProgram(gl, vertexShader, fragmentShader);

    // Initiate buffers.
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0]),
        gl.STATIC_DRAW
    );

    return {
        gl: gl,
        program: program,
        locations: {
            position: gl.getAttribLocation(program, "position"),
            colors: gl.getUniformLocation(program, "colors"),
            weights: gl.getUniformLocation(program, "weights")
        },
        buffers: {
            position: positionBuffer,
        }
    };
};


const createProgram = (gl, vsSource, fsSource) => {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log(
            "Unable to initialize the shader program: "
            + gl.getProgramInfoLog(shaderProgram)
        );
        return null;
    }

    return shaderProgram;
};


const loadShader = (gl, type, source) => {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(
            "An error occurred compiling the shaders: "
            + gl.getShaderInfoLog(shader)
        );
        gl.deleteShader(shader);
        return null;
    }

    return shader;
};


const render = (gl, program, locations, buffers, weights) => {
    resize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set vertex position.
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(locations.position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(locations.position);

    gl.useProgram(program);

    // Set uniforms
    gl.uniform4fv(locations.colors, [
        1.0, 1.0, 1.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
    ]);
    gl.uniform1fv(locations.weights, [
        weights.white,
        weights.red,
        weights.green,
        weights.blue,
    ]);

    // Draw elements.
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};


const resize = (canvas) => {
    const dpr = window.devicePixelRatio || 1;
    const width = Math.floor(canvas.clientWidth * dpr);
    const height = Math.floor(canvas.clientHeight * dpr);

    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
    }
};
