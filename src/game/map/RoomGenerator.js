// @flow
import { randomBetween } from '../../utils/MathUtils';
import type { Rect } from '../../types/BasicTypes';

export function createRandomRoomDimensions(): Rect {
    return Object.freeze({
        width: Math.floor(randomBetween(3, 16)),
        height: Math.floor(randomBetween(3, 16))
    });
}

export default { createRandomRoomDimensions };
