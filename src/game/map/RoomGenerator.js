// @flow
import { randomBetween } from '../../utils/MathUtils';

import type { Rect } from '../../types/BasicTypes';

function createSmallRect(): Rect {
    const width = Math.floor(randomBetween(3, 7));
    const height = Math.floor(randomBetween(3, 7));
    return { width, height };
}

function createMediumRect(): Rect {
    const width = Math.floor(randomBetween(7, 9));
    const height = Math.floor(randomBetween(7, 9));
    return { width, height };
}

function createLargeRect(): Rect {
    const width = Math.floor(randomBetween(9, 13));
    const height = Math.floor(randomBetween(9, 13));
    return { width, height };

}

export function createRandomRoomDimensions(): Rect {
    const possibilities = [createSmallRect, createMediumRect, createLargeRect];
    return Object.freeze(possibilities[Math.floor(randomBetween(0, 3))]());
}

export default { createRandomRoomDimensions };
