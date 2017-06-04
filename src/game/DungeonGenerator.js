import FieldTypes from './map/fields/FieldTypes';
import { shuffle, shuffleImmutable } from '../utils/ArrayUtils';
import { createRandomRoom } from './RoomGenerator';
import { randomIntBetween } from '../utils/MathUtils';

import Field from './map/fields/Field';
import DungeonMap from './map/DungeonMap';

function cloneMap(map) {
    return map.map(row => row.map(field => Object.assign({}, field)));
}

function initMap(width, height) {
    const map = [];
    for (let h = 0; h < height; h++) {
        map[h] = [];
        for (let w = 0; w < width; w++) {
            map[h][w] = new Field({ type: FieldTypes.Types.rock, x: w, y: h });
        }
    }
    return map;
}

function outOfMapBounds(room, map) {
    const pos = room.getPosition();
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

    const pos = room.getPosition();

    const newMap = cloneMap(map);
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
    const { direction, x, y } = randomWall;

    if (direction === 'top') {
        return {
            x,
            y: Math.ceil(y - 1 - (height / 2)),
        };
    } else if (direction === 'bottom') {
        return {
            x,
            y: Math.floor(y + 1 + (height / 2)),
        };
    } else if (direction === 'left') {
        return {
            x: Math.ceil(x - 1 - (width / 2)),
            y
        };
    } else if (direction === 'right') {
        return {
            x: Math.floor(x + 1 + (width / 2)),
            y
        };
    }

    return { x, y };
}

function buildNextRoom(startingRoom, map) {
    const shuffledWalls = shuffle(['top', 'bottom', 'left', 'right']);
    let newMap = cloneMap(map);
    for (let i = 0; i < shuffledWalls.length; i++) {
        const randomWall = startingRoom.getRandomWall(shuffledWalls[i]);
        const nextRoom = createRandomRoom();
        try {
            const newPos = findNextPosition(nextRoom.width, nextRoom.height, randomWall);
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
    return map.reduce((acc, row) =>
        acc.concat(row.filter(cell => cell.type === FieldTypes.Types.earth)),
    []);
}

function hasOnlyFreeNeighbours(x, y, map) {
    let passed = true;

    for (let h = y - 1; h <= y + 1; h++) {
        for (let w = x - 1; w <= x + 1; w++) {
            if (!(w === x && y === h)) {
                passed = passed && (map[h][w].type === FieldTypes.Types.earth);
            }
        }
    }
    return passed;
}

function getFreeFieldsWithFreeNeighbors(map) {
    return getFreeFields(map).filter(field => hasOnlyFreeNeighbours(field.x, field.y, map));
}

function getRandomFreeFields(map, amount) {
    const shuffledFields = shuffle(shuffleImmutable(getFreeFieldsWithFreeNeighbors(map)));
    return shuffledFields.slice(0, amount);
}

function spawnPlayer(map) {
    const freeField = getRandomFreeFields(map, 1)[0];
    freeField.type = FieldTypes.Types.player;
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
    const fields = getRandomFreeFields(map, number);
    const newMap = cloneMap(map);
    for (let i = 0; i < fields.length; i++) {
        const { x, y } = fields[i];
        newMap[y][x] = Object.assign({}, fields[i], { type: FieldTypes.Types.health });
    }
    return newMap;
}

function spawnEnemies(map, number) {
    const fields = getRandomFreeFields(map, number);
    const newMap = cloneMap(map);
    for (let i = 0; i < fields.length; i++) {
        const { x, y } = fields[i];
        newMap[y][x] = Object.assign({}, fields[i], { type: FieldTypes.Types.enemy });
    }
    return newMap;
}

function generate(level = 1, width = 51, height = 35) {
    if (width < 14 || height < 14) {
        throw new Error('Width and height of the dungeon must at least be 14');
    }

    const mapWidth = width;
    const mapHeight = height;
    let map = new DungeonMap({ width, height });

    const x = Math.floor(mapWidth / 2);
    const y = Math.floor(mapHeight / 2);

    const newRoom = createRandomRoom(x, y);

    map = buildNextRoom(newRoom, placeRoom(newRoom, map));
    map = spawnPlayer(map);
    if (level === 5) {
        map = spawnBoss(map);
    } else {
        map = spawnExit(map);
    }
    map = spawnWeapon(map);
    map = spawnHealth(map, randomIntBetween(5, 10));
    map = spawnEnemies(map, randomIntBetween(5, 10));

    return { map, level };
}

export default { generate };
