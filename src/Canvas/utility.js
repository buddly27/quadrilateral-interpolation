import vertexShader from "./shader/vertex.glsl"
import fragmentShader from "./shader/fragment.glsl"


export const computeWindowSize = () => {
    const {innerWidth, innerHeight} = window;
    const coord = computeCoordinates(innerWidth, innerHeight);

    return {
        width: coord.x,
        height: coord.y,
    }
};


export const computeCoordinates = (x, y) => {
    return {
        x: computePosition(x),
        y: computePosition(y),
    }
};


export const computePosition = (x) => {
    const {devicePixelRatio} = window;
    const dpr = devicePixelRatio || 1;
    return x * dpr;
};


export const createProgramInfo = (gl) => {
    const shaderProgram = initShaderProgram(gl, vertexShader, fragmentShader);

    return {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(
                shaderProgram, "aVertexPosition"
            ),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(
                shaderProgram, "uProjectionMatrix"
            ),
            modelViewMatrix: gl.getUniformLocation(
                shaderProgram, "uModelViewMatrix"
            ),
        },
    }
};


export const initShaderProgram = (gl, vsSource, fsSource) => {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log(
            "Unable to initialize the shader program: "
            + gl.getProgramInfoLog(shaderProgram)
        );
        return null;
    }

    return shaderProgram;
};


export const loadShader = (gl, type, source) => {
    const shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
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


export const initBuffers = (gl) => {
    // Create a buffer for the square's positions.
    const positionBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now create an array of positions for the square.
    const positions = [
        -1.0, 1.0,
        1.0, 1.0,
        -1.0, -1.0,
        1.0, -1.0,
    ];

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW
    );

    return {position: positionBuffer};
};
