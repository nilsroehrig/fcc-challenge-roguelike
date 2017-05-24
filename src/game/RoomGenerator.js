import { randomBetween } from '../utils/MathUtils';
import Room from './Room';

function createSmallRoom() {
    let width = Math.floor(randomBetween(3,6));
    let height = Math.floor(randomBetween(3,6));
    return new Room(width, height);
}

function createMediumRoom() {
    let width = Math.floor(randomBetween(6, 9));
    let height = Math.floor(randomBetween(6, 9));
    return new Room(width, height);
}

function createLargeRoom() {
    let width = Math.floor(randomBetween(9, 12));
    let height = Math.floor(randomBetween(9, 12));
    return new Room(width, height);
}

export function createRandomRoom() {
    let possibilities = {
        0: createSmallRoom,
        1: createMediumRoom,
        2: createLargeRoom
    };
    let sel = Math.floor(randomBetween(0, 3));
    return possibilities[sel]();
}

export default { createRandomRoom };
