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


export const createShape = (origin, scale, vertices) => {
    const shape = new Path2D();

    shape.moveTo(
        origin.x + scale * vertices[0][0],
        origin.y + scale * vertices[0][1] * -1
    );

    vertices.slice(1).forEach((vertex) => {
        shape.lineTo(
            origin.x + scale * vertex[0],
            origin.y + scale * vertex[1] * -1
        );
    });

    shape.closePath();
    return shape;
};


export const drawGrid = (context, origin, width, height, scale) => {
    context.setLineDash([]);

    context.lineWidth = 1;
    context.strokeStyle = "#e9e9e9";
    context.globalAlpha = 1;

    // Draw grid lines along X axis.
    for (let index = 0; ; index += 1) {
        const y = origin.y + (scale * index);
        if (y > Math.floor(height))
            break;

        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
    }

    for (let index = 1; ; index += 1) {
        const y = origin.y - (scale * index);
        if (y < 0)
            break;

        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
    }

    // Draw grid lines along Y axis.
    for (let index = 0; ; index += 1) {
        const x = origin.x + (scale * index);
        if (x > Math.floor(width))
            break;

        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
    }

    for (let index = 1; ; index += 1) {
        const x = origin.x - (scale * index);
        if (x < 0)
            break;

        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
    }

    // Draw origin lines
    context.lineWidth = 2;
    context.strokeStyle = "#000";

    context.beginPath();
    context.moveTo(0, origin.y);
    context.lineTo(width, origin.y);
    context.stroke();

    context.beginPath();
    context.moveTo(origin.x, 0);
    context.lineTo(origin.x, height);
    context.stroke();

    // Draw numbers.
    context.font = "25px Sans-serif";
    context.lineWidth = 3;
    context.strokeStyle = "#FFF";
    context.fillStyle = "#000";
    context.textAlign = "center";
    context.textBaseline = "middle";

    // Ticks numbers along the X axis.
    for (let index = 1; ; index += 1) {
        const x = origin.x + (scale * index);
        if (x > Math.floor(width))
            break;

        context.strokeText(`${index}`, x, origin.y + 30);
        context.fillText(`${index}`, x, origin.y + 30);
    }

    for (let index = 1; ; index += 1) {
        const x = origin.x - (scale * index);
        if (x < 0)
            break;

        context.strokeText(`${-index}`, x, origin.y + 30);
        context.fillText(`${-index}`, x, origin.y + 30);
    }

    // Ticks numbers along the Y axis.
    for (let index = 1; ; index += 1) {
        const y = origin.y + (scale * index);
        if (y > Math.floor(height))
            break;

        context.strokeText(`${-index}`, origin.x - 25, y);
        context.fillText(`${-index}`, origin.x - 25, y);
    }

    for (let index = 1; ; index += 1) {
        const y = origin.y - (scale * index);
        if (y < 0)
            break;

        context.strokeText(`${index}`, origin.x - 25, y);
        context.fillText(`${index}`, origin.x - 25, y);

    }
};
