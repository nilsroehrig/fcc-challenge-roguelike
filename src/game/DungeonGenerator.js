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
        pos.top < 1 || pos.top >= map.length - 1 ||
        pos.bottom < 1 || pos.bottom >= map.length - 1 ||
        pos.left < 1 || pos.left >= map[0].length - 1 ||
        pos.right < 1 || pos.right >= map[0].length - 1
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
                throw new Error('Space already occupied.');
            }
            newMap[h][w] = FieldTypes.Types.earth;
        }
    }

    return newMap;
}

function findNextPosition(width, height, randomWall) {
    let { direction, x, y } = randomWall;

    if (direction === 'top') {
        return {
            x: x,
            y: Math.ceil(y - 1 - (height / 2)),
        }
    }

    if (direction === 'bottom') {
        return {
            x: x,
            y: Math.floor(y + 1 + height / 2),
        }
    }

    if (direction === 'left') {
        return {
            x: Math.ceil(x - 1 - (width / 2)),
            y: y
        }
    }

    if (direction === 'right') {
        return {
            x: Math.floor(x + 1 + (width / 2)),
            y: y
        }
    }
}

function buildNextRoom(startingRoom, map, depth) {
    let pos = startingRoom.getPosition();
    // let shuffledWalls = shuffle(['top', 'bottom', 'left', 'right']);
    let shuffledWalls = shuffle(['bottom', 'right']);
    let newMap = map.map(row => row.slice());
    for (let i = 0; i < shuffledWalls.length; i++) {
        let randomWall = startingRoom.getRandomWall(shuffledWalls[i]);
        let nextRoom = createRandomRoom();
        try {
            let newPos = findNextPosition(nextRoom.width, nextRoom.height, randomWall);
            nextRoom.setX(newPos.x);
            nextRoom.setY(newPos.y);
            newMap = placeRoom(nextRoom, newMap);
            newMap[randomWall.y][randomWall.x] = FieldTypes.Types.enemy;
        } catch (e) {
            continue;
        }

        newMap = buildNextRoom(nextRoom, newMap, depth + 1);
    }

    return newMap;
}

function DungeonGenerator(width = 101, height = 61, level = 1) {
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
    let map = initMap(mapWidth, mapHeight);
    let rooms = [];

    let x = Math.floor(mapWidth / 2);
    let y = Math.floor(mapHeight / 2);

    let newRoom = createRandomRoom(x, y);
    map = placeRoom(newRoom, map);

    map = buildNextRoom(newRoom, map, 0);


    return { map, level };
    // return { map, level, enemies, weapons, exit, boss };
}

export default DungeonGenerator;
