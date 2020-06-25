precision highp float;

varying highp vec4 p;

uniform vec4 colors[4];
uniform float weights[4];


/*
 * Resolve polynomial equation in the form of: (a * x^2) + (b * x) + c = 0
 */
float resolve(float a, float b, float c) {
    float u1, u2;

    // Check for unique solutions
    if (abs(a) < 1.e-14) {
        u1 = -c/b;
        u2 = u1;
    }
    // Check for non complex solutions
    else if (b*b - 4.0 * a * c > 0.0) {
        u1 = (-b + sqrt(b*b - 4.0 * a * c)) / (2.0 * a);
        u2 = (-b - sqrt(b*b - 4.0 * a * c)) / (2.0 * a);
    }
    // Complex solution.
    else {
        u1 = -1000.0;
        u2 = u1;
    }

    // Return solution if it exists.
    if (u1 >= 0.0 && u1 <= 1.0) {
        return u1;
    }

    if (u2 >= 0.0 && u2 <= 1.0) {
        return u2;
    }

    // Otherwise return small enough value.
    return -10000.0;
}


/*
 * Compute pixel color from interpolation of four vertices.
 *
 * The interpolated vertex position is calculated from:
 *   P = α1v1 + α2v2 + α3v3 + α4v4
 *   (where α1 + α2 + α3 + α4 = 1)
 *
 * To compute "αi" coefficients, rewrite equation as:
 *   P = (1 − λ)(1 − µ)v1 + λ(1 − µ)v2 + λµv3 + (1 − λ)µv4
 *
 * Where:
 *   α1 = (1 − λ)(1 − µ)
 *   α2 = λ(1 − µ)
 *   α3 = λµ
 *   α4 = (1 − λ)µ
 *
 * Then rewrite equation as:
 *   a + bλ + cµ + dµλ = 0
 *
 * Where:
 *   a = (v1 - p)
 *   b = (v2 - v1)
 *   c = (v4 - v1)
 *   d = (v1 - v2 + v3 - v4)
 *
 * Make cross product for both sides of equation by (a + cµ):
 *   (a + cµ) x (a + bλ + cµ + dµλ) = 0
 *   (a + cµ) x (a + cµ) + (a + cµ) x (bλ + dµλ) = 0
 *   (a + cµ) x λ(b + dµ) = 0
 *   λ((a + cµ) x (b + dµ)) = 0
 *   (a + cµ) x (b + dµ) = 0
 *   (c x d)µ^2 + (c x b + a x d)µ + (a x b) = 0
 *
 * Similarly, make cross product for both sides of equation by (a + bλ):
 *   (a + bλ) x (a + bλ + cµ + dµλ) = 0
 *   (a + bλ) x (a + bλ) + (a + bλ) x (cµ + dµλ) = 0
 *   (a + bλ) x µ(c + dλ) = 0
 *   µ((a + bλ) x (c + dλ)) = 0
 *   (a + bλ) x (c + dλ) = 0
 *   (b x d)λ^2 + (b x c + a x d)λ + (a x c) = 0
 *
 * Solving these two equations give µ and λ values, which give "αi" coefficients
 * values that can then be applied to the colors.
 *
 */
void main() {
    // Vertices to interpolate position p from.
    vec2 v1 = vec2(-1.0, -1.0);
    vec2 v2 = vec2(1.0, -1.0);
    vec2 v3 = vec2(1.0, 1.0);
    vec2 v4 = vec2(-1.0, 1.0);

    // Compute first coefficients.
    vec2 a = v1 - p.xy;
    vec2 b = v2 - v1;
    vec2 c = v4 - v1;
    vec2 d = v1 - v2 + v3 - v4;

    // Initiate 3D vectors to resolve equations.
    vec3 A, B, C;

    // Resolve: (c x d)µ^2 + (c x b + a x d)µ + (a x b) = 0
    A = cross(vec3(c, 0), vec3(d, 0));
    B = cross(vec3(c, 0), vec3(b, 0)) + cross(vec3(a, 0), vec3(d, 0));
    C = cross(vec3(a, 0), vec3(b, 0));

    // Only third component of vectors is needed to compute "µ"
    float mu = resolve(A.z, B.z, C.z);

    // Resolve: (b x d)λ^2 + (b x c + a x d)λ + (a x c) = 0
    A = cross(vec3(b, 0), vec3(d, 0));
    B = cross(vec3(b, 0), vec3(c, 0)) + cross(vec3(a, 0), vec3(d, 0));
    C = cross(vec3(a, 0), vec3(c, 0));

    // Only third component of vectors is needed to compute "λ"
    float lambda = resolve(A.z, B.z, C.z);

    // Compute barycentric coordinates.
    vec4 alpha = vec4(
        (1.0 - lambda) * (1.0 - mu),
        lambda * (1.0 - mu),
        mu * lambda,
        (1.0 - lambda) * mu
    );

    // Adjust alpha from weights
    alpha *= vec4(weights[0], weights[1], weights[2], weights[3]);
    alpha /= alpha[0] + alpha[1] + alpha[2] + alpha[3];


    // Interpolate color using barycentric coordinates.
    vec4 color = (
        alpha[0] * colors[0]
        + alpha[1] * colors[1]
        + alpha[2] * colors[2]
        + alpha[3] * colors[3]
    );

    gl_FragColor = color;
}
