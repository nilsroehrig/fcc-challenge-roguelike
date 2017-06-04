// @flow
import { randomBetween } from '../../utils/MathUtils';
import Room from './Room';

function createSmallRoom(x: number, y: number): Room {
    const width = Math.floor(randomBetween(3, 7));
    const height = Math.floor(randomBetween(3, 7));
    return new Room({ width, height, x, y });
}

function createMediumRoom(x: number, y: number): Room {
    const width = Math.floor(randomBetween(7, 9));
    const height = Math.floor(randomBetween(7, 9));
    return new Room({ width, height, x, y });
}

function createLargeRoom(x: number, y: number): Room {
    const width = Math.floor(randomBetween(9, 13));
    const height = Math.floor(randomBetween(9, 13));
    return new Room({ width, height, x, y });
}

export function createRandomRoom(x: number, y: number): Room {
    const possibilities = [createSmallRoom, createMediumRoom, createLargeRoom];
    return possibilities[Math.floor(randomBetween(0, 3))](x, y);
}

export default { createRandomRoom };
