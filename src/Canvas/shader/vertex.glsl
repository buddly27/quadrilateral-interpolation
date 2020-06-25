attribute vec4 position;

varying highp vec4 p;

void main() {
    gl_Position = position;
    p = position;
}
