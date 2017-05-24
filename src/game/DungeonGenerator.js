import FieldTypes from './FieldTypes';
import { randomBetween } from '../utils/Random';

function initMap(width, height) {
    const map = [];
    for (let h = 0; h < height; h++) {
        map[h] = [];
        for (let w = 0; w < width; w++) {
            map[h][w] = FieldTypes.Types.rock;
        }
    }
    return map;
}

function createRoom(x, y, width, height) {
    let halfWidth = width / 2;
    let halfHeight = height / 2;
    let widthIsWhole = true;
    let heightIsWhole = true;

    if (halfWidth % 1 !== 0) widthIsWhole = false;
    if (halfHeight % 1 !== 0) heightIsWhole = false;

    let top = y - ((heightIsWhole) ? Math.floor(halfHeight - 1) : Math.floor(halfHeight));
    let bottom = y + Math.floor(halfHeight);

    let left = x - ((widthIsWhole) ? Math.floor(halfWidth - 1) : Math.floor(halfWidth));
    let right = x + Math.floor(halfWidth);

    return {top, left, bottom, right};
}

function createSmallRoom(x, y) {
    let width = Math.floor(randomBetween(3,6));
    let height = Math.floor(randomBetween(3,6));
    return createRoom(x, y, width, height);
}

function createMediumRoom(x, y) {
    let width = Math.floor(randomBetween(6, 9));
    let height = Math.floor(randomBetween(6, 9));
    return createRoom(x, y, width, height);
}

function createLargeRoom(x, y) {
    let width = Math.floor(randomBetween(9, 12));
    let height = Math.floor(randomBetween(9, 12));
    return createRoom(x, y, width, height);
}

function createRandomRoom(x, y) {
    let possibilities = {
        0: createSmallRoom,
        1: createMediumRoom,
        2: createLargeRoom
    };
    let sel = Math.floor(randomBetween(0, 3));
    return possibilities[sel](x, y);
}

function outOfMapBounds(room, map) {
    return (
        room.top < 0 || room.top >= map.length ||
        room.bottom < 0 || room.bottom >= map.length ||
        room.left < 0 || room.left >= map.length ||
        room.right < 0 || room.right >= map.length
    );
}

function placeRoom(room, map) {
    if (outOfMapBounds(room, map)) {
        throw new Error('Room is out of map bounds.');
    }

    let newMap = map.map(row => row.slice());
    for (let h = room.top; h <= room.bottom; h++) {
        for (let w = room.left; w <= room.right; w++) {
            if (newMap[h][w] !== FieldTypes.Types.rock) throw new Error('Space already occupied.');
            newMap[h][w] = FieldTypes.Types.earth;
        }
    }

    return newMap;
}

function DungeonGenerator(width = 160, height = 90, level = 1) {
    //  1. Fill the whole map with solid earth
    //  2. Dig out a single room in the centre of the map
    //  3. Pick a wall of any room
    //  4. Decide upon a new feature to build
    //  5. See if there is room to add the new feature through the chosen wall
    //  6. If yes, continue. If no, go back to step 3
    //  7. Add the feature through the chosen wall
    //  8. Go back to step 3, until the dungeon is complete
    //  9. Add the up and down staircases at random points in map
    // 10. Finally, sprinkle some monsters and items liberally over dungeon

    if (width < 14 || height < 14) {
        throw new Error('Width and height of the dungeon must at least be 14');
    }

    const mapWidth = width;
    const mapHeight = height;
    console.log('types', FieldTypes);
    let map = initMap(mapWidth, mapHeight);
    let rooms = [];

    const center = {
        x: Math.floor(mapWidth / 2),
        y: Math.floor(mapHeight / 2)
    };

    let newRoom = createRandomRoom(center.x, center.y);
    map = placeRoom(newRoom, map);
    return { map, level };

    // return { map, level, enemies, weapons, exit, boss };
}

export default DungeonGenerator;
