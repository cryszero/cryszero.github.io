import React, {
    useState,
    useEffect,
    useRef,
    MouseEvent
} from 'react';


interface CanvasProps {
    className: string,
    height: number,
    width: number
};

const DrawingCanvas = (props: CanvasProps) => {
    const [canvasState, setCanvasState] = useState({
        lastCoords: [0, 0],
        isLMBOn: false
    });
    const canvas = useRef<HTMLCanvasElement>(null);

    const getContext = () => {
        const canvasElement = canvas.current;

        return canvasElement ? canvasElement.getContext('2d') : null;
    };

    const getPosition = (): ClientRect => {
        if (!canvas.current) {
            return new ClientRect;
        }

        return canvas.current.getBoundingClientRect();
    };

    useEffect(() => {
        const context = getContext();

        if (!context) {
            return;
        }

        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.lineWidth = 5;
    }, [canvas.current]);
    
    const handleMouseDown = (event: MouseEvent) => {
        const { left, top} = getPosition();
        setCanvasState({
            ...canvasState,
            lastCoords: [event.clientX - left, event.clientY - top],
            isLMBOn: true
        });
    };

    const handleMouseUp = () => {
        setCanvasState({
            ...canvasState,
            isLMBOn: false
        });
    }

    const handleMouseMove = (event: MouseEvent) => {
        const context = getContext();

        if (!context || !canvasState.isLMBOn) {
            return;
        }

        const { left, top } = getPosition();
        const [x, y] = [event.clientX - left, event.clientY - top];
        context.beginPath();
        context.moveTo(canvasState.lastCoords[0], canvasState.lastCoords[1]);
        context.lineTo(x, y);
        context.stroke();

        setCanvasState({
            ...canvasState,
            lastCoords: [x, y]
        });
    };

    const {
        className,
        height,
        width,
    } = props;
    return (
        <canvas
            ref={canvas}
            className={className}
            height={height}
            width={width}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        />
    );
};


export default DrawingCanvas;