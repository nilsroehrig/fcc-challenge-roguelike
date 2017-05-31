import FieldTypes from './FieldTypes';
import { shuffle, shuffleImmutable } from '../utils/ArrayUtils';
import { createRandomRoom } from './RoomGenerator';
import { randomIntBetween } from '../utils/MathUtils';

function cloneMap(map) {
    return map.map(row => row.map(field => Object.assign({}, field)));
}

function initMap(width, height) {
    const map = [];
    for (let h = 0; h < height; h++) {
        map[h] = [];
        for (let w = 0; w < width; w++) {
            map[h][w] = {type: FieldTypes.Types.rock, x: w, y: h};
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

    let newMap = cloneMap(map);
    for (let h = pos.top; h <= pos.bottom; h++) {
        for (let w = pos.left; w <= pos.right; w++) {
            if (newMap[h][w].type !== FieldTypes.Types.rock) {
                throw new Error('Space already occupied.');
            }
            newMap[h][w].type = FieldTypes.Types.earth;
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
    let newMap = cloneMap(map);
    for (let i = 0; i < shuffledWalls.length; i++) {
        let randomWall = startingRoom.getRandomWall(shuffledWalls[i]);
        let nextRoom = createRandomRoom();
        try {
            let newPos = findNextPosition(nextRoom.width, nextRoom.height, randomWall);
            nextRoom.setX(newPos.x);
            nextRoom.setY(newPos.y);
            newMap = placeRoom(nextRoom, newMap);
            newMap[randomWall.y][randomWall.x].type = FieldTypes.Types.earth;
        } catch (e) {
            continue;
        }

        newMap = buildNextRoom(nextRoom, newMap);
    }

    return newMap;
}

function getFreeFields(map) {
    return map.reduce((acc, row) => {
        return acc.concat(row.filter(cell => cell.type === FieldTypes.Types.earth));
    }, []);
}

function hasOnlyFreeNeighbours(x, y, map) {
    let passed = true;

    for (let h = y - 1; h <= y + 1; h++) {
        for (let w = x - 1; w <= x + 1; w++) {
            if (w === x && y === h) continue;
            passed = passed && (map[h][w].type === FieldTypes.Types.earth);
        }
    }
    return passed;
}

function getFreeFieldsWithFreeNeighbors(map) {
    return getFreeFields(map).filter(field => hasOnlyFreeNeighbours(field.x, field.y, map));
}

function getRandomFreeFields(map, amount) {
    let shuffledFields = shuffleImmutable(getFreeFieldsWithFreeNeighbors(map));
    return shuffledFields.slice(0, amount);
}

function spawnPlayer(map) {
    let freeFields = getRandomFreeFields(map, 1)[0].type = FieldTypes.Types.player;
    return map;
}

function spawnBoss(map) {
    getRandomFreeFields(map, 1)[0].type = FieldTypes.Types.boss;
    return map;
}

function spawnExit(map) {
    getRandomFreeFields(map, 1)[0].type = FieldTypes.Types.exit;
    return map;
}

function spawnWeapon(map) {
    getRandomFreeFields(map, 1)[0].type = FieldTypes.Types.weapon;
    return map;
}

function spawnHealth(map, number) {
    getRandomFreeFields(map, number).forEach(field => field.type = FieldTypes.Types.health);
    return map;
}

function spawnEnemies(map, number) {
    getRandomFreeFields(map, number).forEach(field => field.type = FieldTypes.Types.enemy);
    return map;
}

function DungeonGenerator(width = 81, height = 51, level = 1) {
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
