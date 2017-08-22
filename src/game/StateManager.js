// @flow
import getWeapon from './Weapons';
import { Types } from './map/fields/FieldTypes';
import DungeonGenerator from './DungeonGenerator';
import EnemyGenerator from './EnemyGenerator';
import { randomIntBetween, randomBetween } from '../utils/MathUtils';

import Field from './map/fields/Field';

import type { Point } from '../types/BasicTypes';

function createEnemies(flatMap: Array<Field>, level: number): Array<Object> {
    const enemyFields = flatMap.filter(field =>
        field.getType() === Types.enemy || field.getType() === Types.boss);
    return enemyFields.map((enemyField) => {
        const { x, y } = enemyField.getPosition();
        return EnemyGenerator.generate(x, y, level, enemyField.getType() === Types.boss);
    });
}

function createNewLevel(level: number): Object {
    const dungeon = DungeonGenerator.generate(level);
    const { map } = dungeon;
    const flatMap = map.getFlatMap();
    const { x, y } = flatMap.filter(field => field.isOccupiedBy(Types.player))[0].getPosition();
    const enemies = createEnemies(flatMap, level || 1);
    const enemyFields = enemies.map(enemy =>
        map.getField(enemy.position.x, enemy.position.y).setImage(enemy.img)
    );
    dungeon.map = map.setFields(enemyFields);
    return { dungeon, enemies, playerPosition: { x, y } };
}

export function createInitialState(): Object {
    const level = createNewLevel(1);
    return {
        dungeon: level.dungeon,
        enemies: level.enemies,
        gameOver: false,
        winner: false,
        player: {
            health: 100,
            attack: 10,
            weapon: getWeapon(0),
            level: 1,
            position: level.playerPosition,
            exp: 0
        }
    };
}

function killEnemy(field: Field, state: Object): Object {
    const enemies = state.enemies.filter((enemy) => {
        const ep = enemy.position;
        const fp = field.getPosition();
        return (fp.x !== ep.x || fp.y !== ep.y);
    });
    const dungeon = Object.assign({}, state.dungeon, {
        map: state.dungeon.map.setField(field.setType(Types.earth).setImage(null))
    });
    return Object.assign({}, state, { enemies, dungeon });
}

function levelUp(player: Object): Object {
    const level = player.level + 1;
    return Object.assign({}, player, {
        level,
        attack: (player.attack + randomIntBetween(8, 12)) * level
    });
}

function getEnemy(field: Field, state: Object): Object {
    const { x, y } = field.getPosition();
    return state.enemies.filter(enemy =>
        enemy.position.x === x && enemy.position.y === y
    )[0];
}

function updateEnemy(newEnemy: Object, state: Object): Object {
    const enemies = state.enemies.slice();
    const idx = enemies.findIndex(enemy => enemy.id === newEnemy.id);
    enemies[idx] = newEnemy;
    return Object.assign({}, state, { enemies });
}

function moveToField(field: Field, state: Object): Object {
    const pX = state.player.position.x;
    const pY = state.player.position.y;
    const fX = field.getPosition().x;
    const fY = field.getPosition().y;

    const map = state.dungeon.map.setFields([
        field.setType(Types.player),
        state.dungeon.map.getField(pX, pY).setType(Types.earth)
    ]);

    return Object.assign({}, state, {
        player: Object.assign({}, state.player, { position: { x: fX, y: fY } }),
        dungeon: Object.assign({}, state.dungeon, { map })
    });
}

function gameOver(state: Object): Object {
    return Object.assign({}, state, { gameOver: true });
}

function calculateCritical(attack: number, chance: number): number {
    return (randomIntBetween(0, 100) < chance)
        ? attack * 0.5
        : 0;
}

function randomFactor(attack: number): number {
    return attack * randomBetween(0.9, 1.1);
}

function fight(field: Field, state: Object): Object {
    let player = Object.assign({}, state.player);
    const enemy = Object.assign({}, getEnemy(field, state));
    const attackPower = player.attack + player.weapon.attack;
    const { x, y } = field.getPosition();
    let newState = {};

    player.health -= Math.floor(
        randomFactor(enemy.attack + calculateCritical(enemy.attack, enemy.critChance))
    );
    enemy.health -= Math.floor(
        randomFactor(attackPower + calculateCritical(attackPower, player.weapon.critChance))
    );

    if (player.health <= 0) {
        return gameOver(state);
    }

    if (enemy.health <= 0) {
        player.exp = Math.floor(player.exp + enemy.exp);
        if (player.exp > (player.level * 1000)) {
            player = levelUp(player);
        }
        newState = killEnemy(field, Object.assign({}, state, { player }));
        newState = moveToField(newState.dungeon.map.getField(x, y), newState);
        if (enemy.boss) {
            newState.winner = true;
            return gameOver(newState);
        }
    } else {
        newState = updateEnemy(enemy, Object.assign({}, state, { player }));
    }

    return Object.assign({}, state, newState);
}

function pickUpHealth(field: Field, state: Object): Object {
    return moveToField(field, Object.assign({}, state, {
        player: Object.assign({}, state.player, {
            health: state.player.health + (30 * state.dungeon.level)
        }),
        dungeon: Object.assign({}, state.dungeon, {
            map: state.dungeon.map.setField(field.setType(Types.earth))
        })
    }));
}

function pickUpWeapon(field: Field, state: Object): Object {
    return moveToField(field, Object.assign({}, state, {
        player: Object.assign({}, state.player, {
            weapon: getWeapon(state.dungeon.level)
        }),
        dungeon: Object.assign({}, state.dungeon, {
            map: state.dungeon.map.setField(field.setType(Types.earth))
        })
    }));
}

function enterNextLevel(state: Object): Object {
    const { dungeon, enemies, playerPosition } = createNewLevel(state.dungeon.level + 1);
    const player = Object.assign({}, state.player, { position: playerPosition });
    return Object.assign({}, state, {
        dungeon,
        enemies,
        player
    });
}

function takeAction(position: Point, state: Object) {
    const { x, y } = position;
    if (state.dungeon.map.coordinatesOutOfBounds({ x, y })) return state;
    const field = state.dungeon.map.getField(x, y);
    const types = Types;

    switch (field.getType()) {
        case types.rock:
            return state;

        case types.enemy:
        case types.boss:
            return fight(field, state);

        case types.health:
            return pickUpHealth(field, state);

        case types.weapon:
            return pickUpWeapon(field, state);

        case types.exit:
            return enterNextLevel(state);

        default:
            return moveToField(field, state);

    }
}

function moveUp(state: Object): Object {
    const nextField = {
        x: state.player.position.x,
        y: state.player.position.y - 1
    };

    return takeAction(nextField, state);
}

function moveRight(state: Object): Object {
    const nextField = {
        x: state.player.position.x + 1,
        y: state.player.position.y
    };

    return takeAction(nextField, state);
}

function moveDown(state: Object): Object {
    const nextField = {
        x: state.player.position.x,
        y: state.player.position.y + 1
    };

    return takeAction(nextField, state);
}

function moveLeft(state: Object): Object {
    const nextField = {
        x: state.player.position.x - 1,
        y: state.player.position.y
    };

    return takeAction(nextField, state);
}

export function getReducer(initialState: Object): Function {
    return function reducer(state: Object, action: Object) {
        if (state === undefined) {
            return initialState;
        }

        switch (action.type) {
            case 'MOVE_LEFT':
                return moveLeft(state);

            case 'MOVE_RIGHT':
                return moveRight(state);

            case 'MOVE_UP':
                return moveUp(state);

            case 'MOVE_DOWN':
                return moveDown(state);

            case 'RESTART':
                return createInitialState();

            default:
                return state;
        }
    };
}

export default { createInitialState, getReducer };
