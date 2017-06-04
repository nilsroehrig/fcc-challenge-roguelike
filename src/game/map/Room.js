// @flow
import { randomBetween, oddify } from '../../utils/MathUtils';

import type { Point, Rect } from '../../types/BasicTypes';
import type { Direction } from './Directions';

type RoomEdges = {
    top: number,
    bottom: number,
    left: number,
    right: number,
    position: Point
};

type RoomProperties = {
    width: number,
    height: number,
    x: number,
    y: number,
    position?: RoomEdges
};

type WallField = {
    position: Point,
    direction: Direction
};

function calculatePosition(dimensions: Rect, position: Point): RoomEdges {
    const { width, height } = dimensions;
    const { x, y } = position;
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    let widthIsWhole = true;
    let heightIsWhole = true;

    if (halfWidth % 1 !== 0) widthIsWhole = false;
    if (halfHeight % 1 !== 0) heightIsWhole = false;

    const top = y - ((heightIsWhole) ? Math.floor(halfHeight - 1) : Math.floor(halfHeight));
    const bottom = y + Math.floor(halfHeight);

    const left = x - ((widthIsWhole) ? Math.floor(halfWidth - 1) : Math.floor(halfWidth));
    const right = x + Math.floor(halfWidth);

    return Object.freeze({ top, bottom, left, right, position });
}

function findRandomWallField(direction: Direction, roomEdges: RoomEdges): WallField {
    let x = 0;
    let y = 0;

    switch (direction) {
        case 'top':
            x = Math.floor(randomBetween(roomEdges.left + 1, roomEdges.right - 1));
            y = roomEdges.top - 1;
            break;

        case 'right':
            x = roomEdges.right + 1;
            y = Math.floor(randomBetween(roomEdges.top + 1, roomEdges.bottom - 1));
            break;

        case 'bottom':
            x = Math.floor(randomBetween(roomEdges.left + 1, roomEdges.right - 1));
            y = roomEdges.bottom + 1;
            break;

        case 'left':
        default:
            x = roomEdges.left - 1;
            y = Math.floor(randomBetween(roomEdges.top + 1, roomEdges.bottom - 1));
            break;
    }
    return Object.freeze({ direction, position: Object.freeze({ x, y }) });
}

class Room {
    getEdges: Function;
    getRandomWallField: Function;
    constructor(args: RoomProperties) {
        const dimensions: Rect = Object.freeze({
            width: oddify(args.width),
            height: oddify(args.height)
        });
        const position = Object.freeze({ x: args.x, y: args.y });
        const roomEdges = args.position || calculatePosition(dimensions, position);

        function getPosition(): RoomEdges {
            return roomEdges;
        }

        function getRandomWallField(direction: Direction) {
            return findRandomWallField(direction, roomEdges);
        }

        this.getEdges = getPosition;
        this.getRandomWallField = getRandomWallField;
    }
}

export default Room;
