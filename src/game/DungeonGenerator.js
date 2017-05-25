import FieldTypes from './FieldTypes';
import { shuffle } from '../utils/ArrayUtils';
import { createRandomRoom } from './RoomGenerator';
import { randomIntBetween } from '../utils/MathUtils';

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
    } else if (direction === 'bottom') {
        return {
            x: x,
            y: Math.floor(y + 1 + (height / 2)),
        }
    } else if (direction === 'left') {
        return {
            x: Math.ceil(x - 1 - (width / 2)),
            y: y
        }
    } else if (direction === 'right') {
        return {
            x: Math.floor(x + 1 + (width / 2)),
            y: y
        }
    }
}

function buildNextRoom(startingRoom, map) {
    let shuffledWalls = shuffle(['top', 'bottom', 'left', 'right']);
    let newMap = map.map(row => row.slice());
    for (let i = 0; i < shuffledWalls.length; i++) {
        let randomWall = startingRoom.getRandomWall(shuffledWalls[i]);
        let nextRoom = createRandomRoom();
        try {
            let newPos = findNextPosition(nextRoom.width, nextRoom.height, randomWall);
            nextRoom.setX(newPos.x);
            nextRoom.setY(newPos.y);
            newMap = placeRoom(nextRoom, newMap);
            newMap[randomWall.y][randomWall.x] = FieldTypes.Types.earth;
        } catch (e) {
            continue;
        }

        newMap = buildNextRoom(nextRoom, newMap);
    }

    return newMap;
}

function getFreeFields(map) {
    let freeFields = [];
    map.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === FieldTypes.Types.earth) freeFields.push({x, y});
        });
    });
    return freeFields;
}

function setRandomFreeFields(map, number, type) {
    let newMap = map.map(row => row.slice());
    let freeFields = shuffle(getFreeFields(newMap));
    let max = (freeFields.length > number) ? number : freeFields.length;
    for (let i = 0; i < max; i++) {
        newMap[freeFields[i].y][freeFields[i].x] = type;
    }
    return newMap;
}

function spawnPlayer(map) {
    return setRandomFreeFields(map, 1, FieldTypes.Types.player);
}

function spawnBoss(map) {
    return setRandomFreeFields(map, 1, FieldTypes.Types.boss);
}

function spawnExit(map) {
    return setRandomFreeFields(map, 1, FieldTypes.Types.exit);
}

function spawnWeapon(map) {
    return setRandomFreeFields(map, 1, FieldTypes.Types.weapon);
}

function spawnHealth(map, number) {
    return setRandomFreeFields(map, number, FieldTypes.Types.health);
}

function spawnEnemies(map, number) {
    return setRandomFreeFields(map, number, FieldTypes.Types.enemy);
}

function DungeonGenerator(width = 91, height = 55, level = 1) {
    if (width < 14 || height < 14) {
        throw new Error('Width and height of the dungeon must at least be 14');
    }

    const mapWidth = width;
    const mapHeight = height;
    let map = initMap(mapWidth, mapHeight);

    let x = Math.floor(mapWidth / 2);
    let y = Math.floor(mapHeight / 2);

    let newRoom = createRandomRoom(x, y);

    map = buildNextRoom(newRoom, placeRoom(newRoom, map));
    map = spawnPlayer(map);
    if (level === 5) {
        map = spawnBoss(map);
    }
    map = spawnExit(map);
    map = spawnWeapon(map);
    map = spawnHealth(map, randomIntBetween(5, 10));
    map = spawnEnemies(map, randomIntBetween(5, 10));

    return { map, level };
}

export default DungeonGenerator;
