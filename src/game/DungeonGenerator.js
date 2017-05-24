import FieldTypes from './FieldTypes';
import { randomBetween } from '../utils/MathUtils';
import { shuffle } from '../utils/ArrayUtils';
import { createRandomRoom } from './RoomGenerator';

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

function findPosition(x, y) {
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
}

function outOfMapBounds(room, map) {
    return (
        room.top < 0 || room.top >= map.length ||
        room.bottom < 0 || room.bottom >= map.length ||
        room.left < 0 || room.left >= map.length ||
        room.right < 0 || room.right >= map.length
    );
}

function placeRoom(x, y, room, map) {
    if (outOfMapBounds(room, map)) {
        throw new Error('Room is out of map bounds.');
    }

    let position = findPosition(x, y, room);

    let newMap = map.map(row => row.slice());
    for (let h = room.top; h <= room.bottom; h++) {
        for (let w = room.left; w <= room.right; w++) {
            if (newMap[h][w] !== FieldTypes.Types.rock) throw new Error('Space already occupied.');
            newMap[h][w] = FieldTypes.Types.earth;
        }
    }

    return newMap;
}

placeRandomAdjacentRoom(room) {

}

function buildRooms(rooms) {
    let newRooms = rooms.slice();
    let furtherRoomsPossible = true;

    while (furtherRoomsPossible) {
        let len = newRooms.length;

        for (let l = 0; l < len; l++) {
            let room = newRooms[l];
            let nextRoom = placeRandomAdjacentRoom(room);
            if (!nextRoom) continue;

        }

        newRooms = shuffle(newRooms);
        if (len === newRooms.length) furtherRoomsPossible = false;
    }

    return newRooms;
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

    // 1. fill map
    // 2. center room
    // 3. shuffle walls of room
    // 4. pick wall
    // 5. create new room
    // 6. see if fits
    // 7. if not fit, back to 4, if fits continue
    // 8. place new room,
    // 9. continue at 3 with this room

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

    let newRoom = createRandomRoom();
    map = placeRoom(newRoom, map);
    rooms.push(newRoom);

    rooms = buildRooms(rooms);

    return { map, level };
    // return { map, level, enemies, weapons, exit, boss };
}

export default DungeonGenerator;
