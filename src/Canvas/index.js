import React from "react";
import vertexShader from "./shader/vertex.glsl";
import fragmentShader from "./shader/fragment.glsl";
import "./style.css";


export default function Canvas(props) {
    const canvas = React.useRef(null);

    const {weights} = props;

    const [state, setState] = React.useState({
        gl: null,
        program: null,
        attribLocations: {
            vertexPosition: null,
            vertexColor: null,
        },
        buffers: {
            position: null,
            color: null,
        }
    });

    const {gl, program, attribLocations, buffers} = state;

    // Initialize GL context.
    const onInitiate = React.useCallback(() => {
        const state = initialize(canvas);
        setState(prevState => ({...prevState, ...state}));

    }, [canvas]);

    // Render scene.
    const onRender = React.useCallback(() => {
        if (!program)
            return;

        render(gl, program, attribLocations, buffers);

    }, [gl, program, attribLocations, buffers]);

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
        new Float32Array([
            -1.0, 1.0,
            1.0, 1.0,
            -1.0, -1.0,
            1.0, -1.0,
        ]),
        gl.STATIC_DRAW
    );

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            1.0, 1.0, 1.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
        ]),
        gl.STATIC_DRAW
    );

    return {
        gl: gl,
        program: program,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(program, "vertexPosition"),
            vertexColor:  gl.getAttribLocation(program, "vertexColor")
        },
        buffers: {
            position: positionBuffer,
            color: colorBuffer
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


const render = (gl, program, attribLocations, buffers) => {
    resize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const {vertexPosition, vertexColor} = attribLocations;
    const {position, color} = buffers;

    // Set vertex position.
    gl.bindBuffer(gl.ARRAY_BUFFER, position);
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);

    // Set color.
    gl.bindBuffer(gl.ARRAY_BUFFER, color);
    gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexColor);

    gl.useProgram(program);

    // Draw elements.
    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
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
