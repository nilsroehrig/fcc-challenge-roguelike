// @flow
import { Types } from './map/fields/FieldTypes';
import { shuffle, shuffleImmutable } from '../utils/ArrayUtils';
import { createRandomRoomDimensions } from './map/RoomGenerator';
import { oddify, randomIntBetween } from '../utils/MathUtils';

import DungeonMap from './map/DungeonMap';
import Room from './map/Room';
import Field from './map/fields/Field';

function placeRoom(room: Room, map: DungeonMap): DungeonMap {
    const { left, top, right, bottom } = room.getEdges();
    const coordinatePairs = [
        { x: left, y: top },
        { x: left, y: bottom },
        { x: right, y: top },
        { x: right, y: bottom }
    ];
    if (coordinatePairs.some(c => map.coordinatesOutOfBounds(c))) {
        return map;
    }
    const fieldCache = [];
    for (let h = top; h <= bottom; h++) {
        for (let w = left; w <= right; w++) {
            const field = map.getField(w, h);
            if (!field.isOccupiedBy(Types.rock)) {
                return map;
            }
            fieldCache.push(field.setType(Types.earth));
        }
    }

    return map.setFields(fieldCache);
}

function findNextPosition(width, height, randomWall) {
    const { direction } = randomWall;
    const { x, y } = randomWall.position;

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

function buildNextRoom(startingRoom: Room, map: DungeonMap): DungeonMap {
    const shuffledWalls = shuffle(['top', 'bottom', 'left', 'right']);
    let newMap = map;

    for (let i = 0; i < shuffledWalls.length; i++) {
        const mapInLoop = newMap;
        const randomWallField = startingRoom.getRandomWallField(shuffledWalls[i]);
        const nextDimensions = createRandomRoomDimensions();
        const nextPosition = findNextPosition(
            nextDimensions.width,
            nextDimensions.height,
            randomWallField
        );

        const nextRoom = new Room({ ...nextDimensions, ...nextPosition });
        newMap = placeRoom(nextRoom, newMap);
        if (newMap !== mapInLoop) {
            const { x, y } = randomWallField.position;
            const tunnel = newMap.getField(x, y).setType(Types.earth);
            newMap = newMap.setField(tunnel);
            newMap = buildNextRoom(nextRoom, newMap);
        }
    }
    return newMap;
}

function hasOnlyFreeNeighbours(field: Field, map: DungeonMap): boolean {
    let passed = true;
    const { x, y } = field.getPosition();

    for (let h = y - 1; h <= y + 1; h++) {
        for (let w = x - 1; w <= x + 1; w++) {
            if (!(w === x && y === h)) {
                const f = map.getField(w, h);
                if (f === null) {
                    passed = false;
                } else {
                    passed = passed && (map.getField(w, h).getType() === Types.earth);
                }
            }
        }
    }
    return passed;
}

function getFreeFieldsWithFreeNeighbors(map: DungeonMap): Array<Field> {
    return map.getFreeFields().filter(field => hasOnlyFreeNeighbours(field, map));
}

function getRandomFreeFields(map: DungeonMap, amount: number): Array<Field> {
    const shuffledFields = shuffle(shuffleImmutable(map.getFreeFields()));
    return shuffledFields.slice(0, amount);
}

function spawnPlayer(map: DungeonMap): DungeonMap {
    const freeField = getRandomFreeFields(map, 1)[0];
    return map.setField(freeField.setType(Types.player));
}

function spawnBoss(map: DungeonMap): DungeonMap {
    const freeField = getRandomFreeFields(map, 1)[0];
    return map.setField(freeField.setType(Types.boss));
}

function spawnExit(map) {
    const freeField = shuffle(getFreeFieldsWithFreeNeighbors(map))[0];
    return map.setField(freeField.setType(Types.exit));
}

function spawnWeapon(map) {
    const freeField = getRandomFreeFields(map, 1)[0];
    return map.setField(freeField.setType(Types.weapon));
}

function spawnHealth(map, number) {
    let fields = getRandomFreeFields(map, number);
    fields = fields.map(field => field.setType(Types.health));
    return map.setFields(fields);
}

function spawnEnemies(map, number) {
    let fields = getRandomFreeFields(map, number);
    fields = fields.map(field => field.setType(Types.enemy));
    return map.setFields(fields);
}

function generate(level: number = 1, w: number = 50, h: number = 25) {
    const width = oddify(w);
    const height = oddify(h);

    let map = new DungeonMap({ width, height });

    const x = Math.ceil(width / 2);
    const y = Math.ceil(height / 2);

    const initialRoom = new Room({ ...createRandomRoomDimensions(), x, y });
    map = buildNextRoom(initialRoom, placeRoom(initialRoom, map));

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
