import React, { useRef, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import debounce from '../../helpers/debounce';
import formClassName from '../../helpers/formClassName';

import './bar-chart.scss';


const BarChart = (props) => {
    const canvas = useRef();
    const [proportions, setProportions] = useState({ width: 0, height: 0 });
    const [bars, setBars] = useState([]);

    useEffect(() => {
        const resizeHandler = debounce(() => {
            fixProportions();
        }, 100);

        fixProportions();

        window.addEventListener('resize', resizeHandler);

        return () => window.removeEventListener('resize', resizeHandler);
    }, []);

    useEffect(() => {
        requestAnimationFrame(() => updateCanvas());
    }, [props.datasets]);

    useEffect(() => {
        fixScale();

        requestAnimationFrame(() => updateCanvas());
    }, [proportions]);

    const getContext = () => canvas.current.getContext('2d');

    const fixScale = () => getContext().scale(window.devicePixelRatio, window.devicePixelRatio);

    const fixProportions = () => {
        const dpr = window.devicePixelRatio ?? 1;
        const { width, height } = canvas.current.getBoundingClientRect();

        const [fixedWidth, fixedHeight] = [width * dpr, height * dpr];

        if (proportions.canvasWidth !== fixedWidth || proportions.canvasHeight !== fixedHeight) {
            setProportions({
                ...proportions,
                canvasWidth: fixedWidth,
                canvasHeight: fixedHeight
            });
        }
    };

    const getCanvasProportions = () => {
        const { width, height } = canvas.current.getBoundingClientRect();

        return {
            canvasWidth: Math.floor(width),
            canvasHeight: Math.floor(height)
        };
    };

    const getFixedOddCoordinate = (number) => {
        // Так как линии вертикали у нас шириной в 1px, необходимо прибавлять 0.5px к нижнему округлению, чтобы линию не размазало, т.к. иначе канвас начинает отрисовывать её между двух пикселей
        if (getContext().lineWidth === 1) {
            return Math.floor(number) + 0.5;
        }

        return Math.floor(number);
    };

    const getChartDrawParams = () => {
        const { datasets, margin, defaultTickRatio } = props;
        const { canvasWidth, canvasHeight } = getCanvasProportions();

        const defaultColor = '#424242';

        const maxBarLength = Math.max(...datasets.map((dataset) =>
            dataset.data ?
                (defaultTickRatio * Math.ceil(dataset.data.reduce((acc, item) => acc + item.value, 0) / defaultTickRatio)) :
                0
        ), defaultTickRatio);
        const ticksRowHeight = canvasHeight / 10;
        let tickSize = maxBarLength / 5; //на графике 5 отрезков
        const scaleIndex = (canvasWidth - margin * 2) / maxBarLength;

        const bottomGridMargin = ticksRowHeight / 5;
        const lineHeight = canvasHeight - ticksRowHeight;

        return {
            defaultColor,
            scaleIndex,
            tickSize,
            ticksRowHeight,
            bottomGridMargin,
            lineHeight
        };
    };

    const drawGrid = ({ scaleIndex, lineHeight, ticksRowHeight, tickSize }) => {
        const { margin } = props;
        const { canvasWidth } = getCanvasProportions();
        const ctx = getContext();

        const [prevStrokeStyle, prevTextAlign, prevFont] = [ctx.strokeStyle, ctx.textAlign, ctx.font];
        const scaledTickSize = tickSize * scaleIndex;
        const lineToY = lineHeight + ticksRowHeight / 5;
        const fontSize = ticksRowHeight / 3;

        ctx.lineWidth = 1;
        ctx.font = `normal ${fontSize}px Open Sans`;
        ctx.fillStyle = '#808080';
        ctx.strokeStyle = '#e6e6e6';
        ctx.textAlign = 'center';
        ctx.beginPath();

        //горизонтальная верхняя ось
        ctx.moveTo(margin, 0);
        ctx.lineTo(canvasWidth - margin, 0);

        //горизонтальная нижняя ось
        ctx.moveTo(margin, getFixedOddCoordinate(lineHeight));
        ctx.lineTo(canvasWidth - margin, getFixedOddCoordinate(lineHeight));

        //чёрточка над ноликом
        ctx.moveTo(getFixedOddCoordinate(margin), getFixedOddCoordinate(lineHeight));
        ctx.lineTo(getFixedOddCoordinate(margin), getFixedOddCoordinate(lineToY));

        ctx.fillText(0, margin, lineToY + fontSize); //рисуем нолик

        ctx.stroke();
        ctx.closePath();

        let prevTickX = getFixedOddCoordinate(margin + scaledTickSize);

        Array(5).fill(null).forEach((_, index) => {
            ctx.beginPath();

            //вертикальная черта
            if (index !== 4) {
                ctx.moveTo(prevTickX, 0);
                ctx.lineTo(prevTickX, getFixedOddCoordinate(lineToY));
            } else {
                ctx.moveTo(prevTickX, getFixedOddCoordinate(lineHeight));
                ctx.lineTo(prevTickX, getFixedOddCoordinate(lineToY));
            }

            //цифра под нижней осью
            ctx.fillText((index + 1) * tickSize, prevTickX, lineToY + fontSize);

            ctx.stroke();
            ctx.closePath();

            prevTickX += Math.floor(scaledTickSize);
        });

        [ctx.strokeStyle, ctx.textAlign, ctx.font] = [prevStrokeStyle, prevTextAlign, prevFont];
    };

    const drawLabeledBars = ({ scaleIndex, ticksRowHeight, bottomGridMargin }) => {
        const { datasets, defaultColorPallette, margin } = props;
        const { canvasWidth, canvasHeight } = getCanvasProportions();
        const ctx = getContext();
        const prevFillStyle = ctx.fillStyle;

        const rowHeight = (canvasHeight - ticksRowHeight - bottomGridMargin) / datasets.length;
        const barHeight = rowHeight / 2;
        const fontSize = barHeight / 3;
        let prevY = barHeight;
        const newBars = [];

        ctx.font = `normal ${barHeight / 3}px Open Sans`;
        datasets.forEach((dataset, datasetId) => {
            let prevX = margin;

            if (!dataset.data) {
                return;
            }

            const labelText = typeof dataset.label === 'function' ?
                dataset.label(dataset):
                dataset.label ?? '';

            //отрисовываем поле label из dataset через одну строку, начиная с первой barHeight * (datasetId * 2 + 1)
            //по оси y label имеет отступ от полоски графика на высоту самого себя
            ctx.fillText(labelText, margin, barHeight * (datasetId * 2 + 1) - fontSize, canvasWidth);

            dataset.data.forEach((item, itemId) => {
                const bar = new Path2D();
                const { color = defaultColorPallette[itemId], value } = item;

                if (!value) {
                    return;
                }

                ctx.fillStyle = color;

                bar.rect(Math.floor(prevX), Math.floor(prevY), Math.floor(value * scaleIndex), Math.floor(barHeight));

                ctx.fill(bar);

                prevX += Math.floor(value * scaleIndex);

                ctx.fillStyle = prevFillStyle;

                newBars.push({
                    path: bar,
                    params: {
                        ...item,
                        color
                    }
                });
            });

            prevY += barHeight * 2;
        });

        return newBars;
    };

    const updateCanvas = () => {
        setBars(draw());
    };

    const draw = () => {
        const { canvasWidth, canvasHeight } = getCanvasProportions();

        if (canvasWidth === 0 || canvasHeight === 0) {
            return;
        }

        const {
            defaultColor,
            scaleIndex,
            tickSize,
            ticksRowHeight,
            bottomGridMargin,
            lineHeight
        } = getChartDrawParams();

        const ctx = getContext();

        ctx.strokeStyle = defaultColor;
        ctx.fillStyle = defaultColor;
        ctx.textAlign = 'left';

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        drawGrid({ scaleIndex, lineHeight, ticksRowHeight, tickSize });
        const newBars = drawLabeledBars({ scaleIndex, ticksRowHeight, bottomGridMargin });

        return newBars;
    };

    const drawInfoBlock = ({ barInfo, position: { x, y } }) => {
        const { infoBlockLabel } = props;
        const ctx = getContext();
        const { canvasWidth } = getCanvasProportions();
        const {
            defaultColor,
            ticksRowHeight
        } = getChartDrawParams();

        const [prevFillStyle, prevFont] = [ctx.fillStyle, ctx.font];

        requestAnimationFrame(() => {
            draw();

            let infoBlockText = '';

            if (barInfo.label) {
                infoBlockText = typeof barInfo.label === 'function' ?
                    barInfo.label(barInfo):
                    barInfo.label;
            } else {
                infoBlockText = typeof infoBlockLabel === 'function' ?
                    infoBlockLabel(barInfo):
                    infoBlockLabel;
            }

            const fontSize = ticksRowHeight / 3;
            const radius = fontSize / 2;
            const rectPadding = ticksRowHeight / 8;

            ctx.font = `normal ${fontSize}px Open Sans`;

            const textWidth = ctx.measureText(infoBlockText).width;
            const [rectWidth, rectHeight]  = [textWidth + rectPadding * 3 + radius * 2, fontSize + rectPadding * 2];
            let startX = x - rectPadding - radius;
            const startY = y + rectPadding * 2;

            if (startX < 0) {
                startX = 0;
            } else if (startX + rectWidth > canvasWidth) {
                startX = canvasWidth - rectWidth;
            }

            ctx.fillStyle = defaultColor;

            ctx.beginPath();

            ctx.fillRect(startX, startY, rectWidth, rectHeight);

            ctx.fillStyle = barInfo.color;
            ctx.arc(startX + rectPadding + radius, startY + rectPadding + radius, radius, 0, Math.PI * 2, false);
            ctx.fill();

            ctx.fillStyle = '#fff';

            ctx.fillText(infoBlockText, startX + radius * 2 + rectPadding * 2, startY + rectPadding + fontSize * 0.85);

            ctx.closePath();

            ctx.fillStyle = prevFillStyle;
            ctx.font = prevFont;
        });
    };

    const clearInfoBlock = () => {
        draw();
    };

    const handleMouseMove = (event) => {
        const ctx = getContext();

        const x = event.clientX - canvas.current.getBoundingClientRect().left;
        const y = event.clientY - canvas.current.getBoundingClientRect().top;
        const [scaledX, scaledY] = [x * window.devicePixelRatio, y * window.devicePixelRatio];

        const targetedBar = bars.find((bar) => ctx.isPointInPath(bar.path, scaledX, scaledY));

        if (!targetedBar) {
            return clearInfoBlock();
        }

        drawInfoBlock({ barInfo: targetedBar.params, position: { x, y } });
    };

    return (
        <div
            className={formClassName({ className: 'bar-chart', parentClassName: props.className })}
        >
            <canvas
                ref={canvas}
                className="bar-chart__canvas"
                width={proportions.canvasWidth}
                height={proportions.canvasHeight}
                onMouseMove={handleMouseMove}
                onMouseOut={clearInfoBlock}
            />
        </div>
    );
};

BarChart.propTypes = {
    className: PropTypes.string,
    datasets: PropTypes.arrayOf(
        PropTypes.shape({
            data: PropTypes.arrayOf(
                PropTypes.shape({
                    value: PropTypes.number.isRequired,
                    label: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
                    color: PropTypes.string
                })
            ),
            label: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
        })
    ),
    width: PropTypes.number,
    height: PropTypes.number,
    margin: PropTypes.number,
    defaultTickRatio: PropTypes.number,
    defaultColorPallette: PropTypes.arrayOf(PropTypes.string),
    infoBlockLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
};

BarChart.defaultProps = {
    className: '',
    datasets: [],
    width: 300,
    height: 150,
    margin: 16,
    defaultTickRatio: 50,
    defaultColorPallette: ['#ff7b60', '#ffba81', '#c8ec93'],
    infoBlockLabel: (bar) => bar.value
};

export default BarChart;