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

function outOfMapBounds(room, map) {
    let pos = room.getPosition();
    return (
        pos.top < 0 || pos.top >= map.length ||
        pos.bottom < 0 || pos.bottom >= map.length ||
        pos.left < 0 || pos.left >= map[0].length ||
        pos.right < 0 || pos.right >= map[0].length
    );
}

function placeRoom(room, map) {
    if (outOfMapBounds(room, map)) {
        throw new Error('Room is out of map bounds.');
    }

    let pos = room.getPosition();

    let newMap = map.map(row => row.slice());
    for (let h = pos.top; h <= pos.bottom; h++) {
        for (let w = pos.left; w <= pos.right; w++) {
            if (newMap[h][w] !== FieldTypes.Types.rock) {
                console.log(w, h, FieldTypes.TypesByCode[newMap[h][w]]);
                throw new Error('Space already occupied.');
            }
            newMap[h][w] = FieldTypes.Types.earth;
        }
    }

    return newMap;
}

function pickRandomWall(fromPos, wall) {
    let x, y;
    switch(wall) {
        case 'top':
        case 'bottom':
        x = Math.floor(randomBetween(fromPos.left + 1, fromPos.right - 1));
        y = fromPos[wall];
        break;

        case 'right':
        case 'left':
        x = fromPos[wall];
        y = Math.floor(randomBetween(fromPos.top + 1, fromPos.bottom - 1));
        break;

        default:
        throw new Error('A wrong type of wall was provided.');
    }
    return {x, y};
}

function findNextPosition(nextRoom, wallPosition, wallDirection) {
    if (wallDirection === 'left') {
        return {
            y: wallPosition.y,
            x: wallPosition.x - 1 - Math.ceil(nextRoom.width / 2)
        }
    }
    if (wallDirection === 'right') {
        return {
            y: wallPosition.y,
            x: wallPosition.x + 1 + Math.floor(nextRoom.width / 2)
        }
    }
    if (wallDirection === 'top') {
        return {
            y: wallPosition.y - 1 - Math.ceil(nextRoom.height / 2),
            x: wallPosition.x
        }
    }
    if (wallDirection === 'bottom') {
        return {
            y: wallPosition.y + 1 + Math.floor(nextRoom.height / 2),
            x: wallPosition.x
        }
    }
}

function buildNextRoom(startingRoom, map, depth) {
    if (depth > 1) return;
    let pos = startingRoom.getPosition();
    let shuffledWalls = shuffle(['top', 'right', 'bottom', 'left']);
    let newMap = map.splice();
    for (let i = 0; i < shuffledWalls.length; i++) {
        let wallField = pickRandomWall(pos, shuffledWalls[i]);
        let nextRoom = createRandomRoom();
        try {
            let newPos = findNextPosition(nextRoom, wallField, shuffledWalls[i]);
            nextRoom.setX(newPos.x);
            nextRoom.setY(newPos.y);
            newMap = placeRoom(nextRoom, map);
            buildNextRoom(nextRoom, map, depth + 1);
        } catch (e) {
            console.log(e.message, shuffledWalls[i]);
            console.log(startingRoom.getPosition(), startingRoom.width, startingRoom.height);
            console.log(nextRoom.getPosition(), nextRoom.width, nextRoom.height);
            continue;
        }
    }
}

function DungeonGenerator(width = 160, height = 90, level = 1) {
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

    let x = Math.floor(mapWidth / 2);
    let y = Math.floor(mapHeight / 2);

    let newRoom = createRandomRoom(x, y);
    map = placeRoom(newRoom, map);

    buildNextRoom(newRoom, map, 0);


    return { map, level };
    // return { map, level, enemies, weapons, exit, boss };
}

export default DungeonGenerator;
