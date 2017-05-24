import { randomBetween } from '../utils/MathUtils';
import Room from './Room';

function createSmallRoom(x, y) {
    let width = Math.floor(randomBetween(5,10));
    let height = Math.floor(randomBetween(5,10));
    return new Room(width, height, x, y);
}

function createMediumRoom(x, y) {
    let width = Math.floor(randomBetween(8, 13));
    let height = Math.floor(randomBetween(8, 13));
    return new Room(width, height, x, y);
}

function createLargeRoom(x, y) {
    let width = Math.floor(randomBetween(11, 16));
    let height = Math.floor(randomBetween(11, 16));
    return new Room(width, height, x, y);
}

export function createRandomRoom(x, y) {
    let possibilities = {
        0: createSmallRoom,
        1: createMediumRoom,
        2: createLargeRoom
    };
    let sel = Math.floor(randomBetween(0, 3));
    return possibilities[sel](x, y);
}

export default { createRandomRoom };
