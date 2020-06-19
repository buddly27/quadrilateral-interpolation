import React from "react";
import * as utility from "./utility";
import "./style.css";


export default function Canvas(props) {

    const size = utility.computeWindowSize();
    const canvas = React.useRef(null);

    const [state, setState] = React.useState({
        scale: 50,
        width: size.width,
        height: size.height,
        origin: {
            x: Math.round(size.width / 3.0),
            y: Math.round(size.height / 2.0),
        },
        pointer: {
            x: 0,
            y: 0
        },
        pressed: null,
        pressedDelta: null,
    });

    const {
        scale,
        width,
        height,
        origin,
        pointer,
        pressed,
        pressedDelta
    } = state;

    // Update 'pressed' and 'pressedDelta' when mouse is pressed on canvas.
    const onMouseDown = React.useCallback((event) => {
        const {clientX, clientY} = event;
        const client = utility.computeCoordinates(clientX, clientY);

        let pressed = null;

        setState(
            prevState => ({
                ...prevState,
                pressed: pressed,
                pressedDelta: {
                    x: origin.x - client.x,
                    y: origin.y - client.y
                },
            })
        );

    }, [origin]);

    // Release 'pressed' and 'pressedDelta' when mouse is up.
    const onMouseUp = React.useCallback(() => {
        setState(
            prevState => ({
                ...prevState,
                pressed: null,
                pressedDelta: null
            })
        );

    }, []);

    // Update state when mouse is pressed and move on the canvas.
    const onMouseMove = React.useCallback((event) => {
        const {clientX, clientY} = event;
        const {offsetTop, offsetLeft} = canvas.current;

        const client = utility.computeCoordinates(clientX, clientY);
        const offset = utility.computeCoordinates(offsetLeft, offsetTop);

        const newState = {
            pointer: {
                x: client.x - offset.x,
                y: client.y - offset.y
            }
        };

        if (pressedDelta && !pressed) {
            newState.origin = {
                x: client.x + pressedDelta.x,
                y: client.y + pressedDelta.y,
            };
        }

        setState(prevState => ({...prevState, ...newState}));

    }, [canvas, pressed, pressedDelta]);

    // Update state when window is resized.
    const onResize = React.useCallback(() => {
        const newSize = utility.computeWindowSize();

        setState(prevState => {
            return {
                ...prevState,
                width: newSize.width,
                height: newSize.height
            };
        });

    }, []);

    // Update state when zooming on window.
    const onZoom = React.useCallback((event) => {
        const {wheelDelta, detail} = event;
        const delta = Math.max(Math.min(wheelDelta || -detail, 10), -10);

        setState(prevState => {
            return {
                ...prevState,
                scale: Math.max(Math.min(scale + delta), 5)
            };
        });

        event.preventDefault();

    }, [scale]);

    // Listen to 'resize' event.
    React.useEffect(() => {
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [onResize]);

    // Listen to 'wheel' event.
    React.useEffect(() => {
        window.addEventListener("wheel", onZoom, {passive: false});
        return () => window.removeEventListener("wheel", onZoom);
    }, [onZoom]);

    // Draw polygons when component is setup.
    React.useEffect(() => {
        const {width, height} = canvas.current;
        const gl = canvas.current.getContext("webgl");

        const programInfo = utility.createProgramInfo(gl);
        const buffers = utility.initBuffers(gl);
        utility.drawScene(gl, programInfo, buffers);

    }, [canvas, origin, pointer, scale]);

    return (
        <canvas
            ref={canvas}
            className="Canvas"
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onTouchStart={onMouseDown}
            onTouchEnd={onMouseUp}
            onTouchMove={onMouseMove}
            width={width}
            height={height}
            tabIndex="0"
        />
    )
}

