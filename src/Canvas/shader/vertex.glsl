attribute vec4 vertexPosition;
attribute vec4 vertexColor;

varying lowp vec4 color;

void main() {
    gl_Position = vertexPosition;
    color = vertexColor;
}
