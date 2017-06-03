import { randomBetween } from '../utils/MathUtils';
import Room from './Room';

function createSmallRoom(x, y) {
    const width = Math.floor(randomBetween(3, 7));
    const height = Math.floor(randomBetween(3, 7));
    return new Room(width, height, x, y);
}

function createMediumRoom(x, y) {
    const width = Math.floor(randomBetween(7, 9));
    const height = Math.floor(randomBetween(7, 9));
    return new Room(width, height, x, y);
}

function createLargeRoom(x, y) {
    const width = Math.floor(randomBetween(9, 13));
    const height = Math.floor(randomBetween(9, 13));
    return new Room(width, height, x, y);
}

export function createRandomRoom(x, y) {
    const possibilities = {
        0: createSmallRoom,
        1: createMediumRoom,
        2: createLargeRoom
    };
    const sel = Math.floor(randomBetween(0, 3));
    const room = possibilities[sel](x, y);
    room.setWidth(room.width % 2 === 0 ? room.width + 1 : room.width);
    room.setHeight(room.height % 2 === 0 ? room.height + 1 : room.height);
    return room;
}

export default { createRandomRoom };
