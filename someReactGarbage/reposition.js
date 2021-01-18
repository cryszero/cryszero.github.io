const availableGlobalPositions = {
    top: 'top',
    bottom: 'bottom',
    left: 'left',
    right: 'right'
};

const availableAlignPositions = {
    start: 'start',
    middle: 'middle',
    end: 'end'
};

// globalFlipPairs и alignFlipPairs описывают противоположные стороны, для того, чтобы блок переворачивался, если не влазит во viewport
const globalFlipPairs = {
    [availableGlobalPositions.top]: availableGlobalPositions.bottom,
    [availableGlobalPositions.bottom]: availableGlobalPositions.top,
    [availableGlobalPositions.left]: availableGlobalPositions.right,
    [availableGlobalPositions.right]: availableGlobalPositions.left,
};

const alignFlipPairs = {
    [availableAlignPositions.start]: availableAlignPositions.end,
    [availableAlignPositions.end]: availableAlignPositions.start,
};

/*
    repositionContext - элемент, относительно которого будет расположен фиксированный блок

    blockToReposition - фиксированный блок, который надо расположить
*/

export default ({ repositionContext, blockToReposition, options = {}, isCursorContext = false }) => {
    if (!blockToReposition || !repositionContext) {
        return;
    }

    const { top, bottom, left, right } = availableGlobalPositions;
    const { start, middle, end } = availableAlignPositions;

    /*
        globalPosition - указание на то, где по умолчанию должен быть блок по отношению к блоку repositionContext (top/bottom/left/right)

        alignPosition - указание на то, как фиксированный блок будет выравнен по отношению к repositionContext (start/middle/end). В зависимости от установки globalPosition, он меняет свою систему координат по аналогии с флексами.

        combinedPosition - короткая запись предыдущих двух значений globalPosition и alignPosition, разделённая "-"
    */
    let {
        globalPosition = bottom,
        alignPosition = start,
        combinedPosition = `${globalPosition}-${alignPosition}`
    } = options;

    /*
        margin - отступ сверху/снизу/слева/справа от блока repositionContext, в зависимости от заданного globalPosition

        globalPositionFlipOptions и alignPositionFlipOptions - массивы, в которых можно переопределить стандартные опции разворота фиксированного блока, при расчёте значений опции берутся по очереди и будет выбран первый подходящий вариант.
    */
    const {
        margin = 0,
        globalPositionFlipOptions = [globalFlipPairs[globalPosition]],
        alignPositionFlipOptions = [alignFlipPairs[alignPosition]],
    } = options;

    [globalPosition, alignPosition] = combinedPosition.split('-');

    const defaultCursorSize = 16;
    const contextRectData = isCursorContext ?
        {
            top: repositionContext.clientY,
            bottom: repositionContext.clientY + defaultCursorSize,
            left: repositionContext.clientX,
            right: repositionContext.clientX + defaultCursorSize,
            height: defaultCursorSize,
            width: defaultCursorSize
        }:
        repositionContext.getBoundingClientRect();
    const blockRectData = blockToReposition.getBoundingClientRect();

    const getYCoordinates = ({ globalPosition, margin }) => {
        let y = 0;

        switch(globalPosition) {
            case bottom:
                y = contextRectData.bottom + margin;
                break;
            case top:
                y = contextRectData.top - blockRectData.height - margin;
                break;
            case right:
            case left:
                if (alignPosition === start) {
                    y = contextRectData.top;
                } else if (alignPosition === middle) {
                    y = contextRectData.top + (contextRectData.height / 2) - (blockRectData.height / 2);
                } else {
                    y = contextRectData.bottom;
                }
                break;
            default:
                y = contextRectData.bottom + margin;
                break;
        }
        return y;
    };

    const getXCoordinates = ({ globalPosition, alignPosition, margin }) => {
        let x = 0;

        if (globalPosition === left) {
            x = contextRectData.left - blockRectData.width - margin;
        } else if (globalPosition === right) {
            x = contextRectData.right + margin;
        } else {
            switch (alignPosition) {
                case start:
                    x = contextRectData.left;
                    break;
                case middle:
                    x = contextRectData.left - (blockRectData.width / 2) + (contextRectData.width / 2);
                    break;
                case end:
                    x = contextRectData.right - (blockRectData.width);
                    break;
                default:
                    x = contextRectData.left;
                    break;
            }
        }

        return x;
    };

    const getPreferredPosition = ({
        globalPosition,
        alignPosition,
        margin,
        shouldCheckX = true,
        shouldCheckY = true
    }) => {
        const result = {};
        if (shouldCheckX) {
            const x = getXCoordinates({ globalPosition, alignPosition, margin });

            result.x = x;
            result.isXPositionOkay = x >= 0 && x + blockRectData.width <= window.innerWidth;
        }

        if (shouldCheckY) {
            const y = getYCoordinates({ globalPosition, margin });

            result.y = y;
            result.isYPositionOkay = y >= 0 && y + blockRectData.height <= window.innerHeight;
        }

        return result;
    };

    let preferredPosition = getPreferredPosition({ globalPosition, alignPosition, margin });
    const isGlobalPositionException = globalPosition === left || globalPosition === right;

    if (!preferredPosition.isYPositionOkay || (isGlobalPositionException && !preferredPosition.isXPositionOkay)) {
        for (let i = 0; i < globalPositionFlipOptions.length; i++) {
            const newPreferredPosition = getPreferredPosition({
                globalPosition: globalPositionFlipOptions[i],
                alignPosition,
                margin,
                shouldCheckX: isGlobalPositionException
            });

            if (newPreferredPosition.isYPositionOkay) {
                preferredPosition = {
                    ...preferredPosition,
                    ...newPreferredPosition
                };
                break;
            }
        }
    }

    if (!preferredPosition.isXPositionOkay) {
        for (let i = 0; i < alignPositionFlipOptions.length; i++) {
            const newPreferredPosition = getPreferredPosition({
                globalPosition,
                alignPosition: alignPositionFlipOptions[i],
                margin,
                shouldCheckY: false
            });

            if (newPreferredPosition.isXPositionOkay) {
                preferredPosition = {
                    ...preferredPosition,
                    ...newPreferredPosition
                };
                break;
            }
        }
    }

    blockToReposition.style.top = `${preferredPosition.y}px`;
    blockToReposition.style.left = `${preferredPosition.x}px`;

    return preferredPosition;
};
