import { randomBetween } from '../utils/MathUtils';
import Room from './Room';

function createSmallRoom(x, y) {
    let width = Math.floor(randomBetween(5,11));
    let height = Math.floor(randomBetween(5,11));
    return new Room(width, height, x, y);
}

function createMediumRoom(x, y) {
    let width = Math.floor(randomBetween(9, 15));
    let height = Math.floor(randomBetween(9, 15));
    return new Room(width, height, x, y);
}

function createLargeRoom(x, y) {
    let width = Math.floor(randomBetween(13, 19));
    let height = Math.floor(randomBetween(13, 19));
    return new Room(width, height, x, y);
}

export function createRandomRoom(x, y) {
    let possibilities = {
        0: createSmallRoom,
        1: createMediumRoom,
        2: createLargeRoom
    };
    let sel = Math.floor(randomBetween(0, 3));
    let room = possibilities[sel](x, y);
    room.setWidth(room.width % 2 === 0 ? room.width + 1 : room.width);
    room.setHeight(room.height % 2 === 0 ? room.height + 1 : room.height);
    return room;
}

export default { createRandomRoom };
