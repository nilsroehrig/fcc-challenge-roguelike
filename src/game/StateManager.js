import getWeapon from './Weapons';
import FieldTypes from './FieldTypes';
import DungeonGenerator from './DungeonGenerator';
import EnemyGenerator from './EnemyGenerator';
import { randomIntBetween } from '../utils/MathUtils';

function createEnemies(flatMap, level) {
    const enemyFields = flatMap.filter(field =>
        field.type === FieldTypes.Types.enemy || field.type === FieldTypes.Types.boss);
    return enemyFields.map((enemyField) => {
        const { x, y } = enemyField;
        return EnemyGenerator.generate(x, y, level, enemyField.type === FieldTypes.Types.boss);
    });
}

function createNewLevel(level = undefined) {
    const dungeon = DungeonGenerator.generate(level);
    const flatMap = dungeon.map.reduce((acc, row) => {
        acc.push(...row);
        return acc;
    }, []);

    const { x, y } = flatMap.filter(item => item.type === FieldTypes.Types.player)[0];
    const enemies = createEnemies(flatMap, level || 1);
    enemies.forEach((enemy) => {
        const { position } = enemy;
        dungeon.map[position.y][position.x].img = enemy.img;
    });

    return { dungeon, enemies, position: { x, y } };
}

export function createInitialState() {
    const level = createNewLevel();
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
            position: level.position,
            exp: 0
        }
    };
}

function copyMap(map) {
    return map.map(row => row.map(field => Object.assign({}, field)));
}

function removeFromMap(field, map) {
    return map.slice().map((row) => {
        const idx = row.findIndex(f => f.x === field.x && f.y === field.y);
        if (idx === -1) {
            return row;
        }
        const newRow = row.slice();
        newRow[idx] = Object.assign({}, newRow[idx], { type: FieldTypes.Types.earth, img: null });
        return newRow;
    });
}

function killEnemy(field, state) {
    const filteredEnemies = state.enemies.filter((enemy) => {
        const { x, y } = enemy.position;
        return (field.x !== x || field.y !== y);
    });
    const newMap = removeFromMap(field, state.dungeon.map);
    return Object.assign({}, state, {
        enemies: filteredEnemies,
        dungeon: Object.assign({}, state.dungeon, {
            map: newMap
        })
    });
}

function levelUp(player) {
    const newPlayer = Object.assign({}, player);
    newPlayer.level += 1;
    newPlayer.attack += randomIntBetween(8, 12) * newPlayer.level;
    return newPlayer;
}

function getEnemy(field, state) {
    const { x, y } = field;
    return state.enemies.filter(enemy =>
        enemy.position.x === x && enemy.position.y === y
    )[0];
}

function updateEnemy(newEnemy, state) {
    const enemies = state.enemies.slice();
    const idx = enemies.findIndex(enemy => enemy.id === newEnemy.id);
    enemies[idx] = newEnemy;
    return Object.assign({}, state, { enemies });
}

function moveToField(field, state) {
    const pX = state.player.position.x;
    const pY = state.player.position.y;
    const fX = field.x;
    const fY = field.y;

    const mapCopy = copyMap(state.dungeon.map);

    mapCopy[pY][pX] = Object.assign({}, mapCopy[pY][pX], { type: FieldTypes.Types.earth });
    mapCopy[fY][fX] = Object.assign({}, mapCopy[fY][fX], { type: FieldTypes.Types.player });

    return Object.assign({}, state, {
        player: Object.assign({}, state.player, { position: { x: fX, y: fY } }),
        dungeon: Object.assign({}, state.dungeon, { map: mapCopy })
    });
}

function calculateCritical(attack, chance) {
    return (randomIntBetween(0, 100) < chance)
        ? attack * 0.5
        : 0;
}

function gameOver(state) {
    return Object.assign({}, state, { gameOver: true });
}

function fight(field, state) {
    let player = Object.assign({}, state.player);
    let newState = {};
    const enemy = Object.assign({}, getEnemy(field, state));
    const attackPower = player.attack + player.weapon.attack;

    player.health -= Math.floor(
        enemy.attack + calculateCritical(enemy.attack, enemy.critChance)
    );
    enemy.health -= Math.floor(
        attackPower + calculateCritical(attackPower, player.weapon.critChance)
    );

    if (player.health <= 0) {
        return gameOver(state);
    }

    if (enemy.health <= 0) {
        player.exp = Math.floor(player.exp + enemy.exp);
        if (player.exp > (player.level * 1000)) {
            player = levelUp(player);
        }
        newState = moveToField(field, killEnemy(field, Object.assign({}, state, { player })));
        if (enemy.boss) {
            newState.winner = true;
            return gameOver(newState);
        }
    } else {
        newState = updateEnemy(enemy, Object.assign({}, state, { player }));
    }

    return Object.assign({}, state, newState);
}

function pickUpHealth(field, state) {
    const amount = state.dungeon.level * 30;
    const player = Object.assign({}, state.player);
    const map = removeFromMap(field, state.dungeon.map);
    const dungeon = Object.assign({}, state.dungeon, { map });
    player.health += amount;
    return moveToField(field, Object.assign({}, state, { player, dungeon }));
}

function pickUpWeapon(field, state) {
    const player = Object.assign({}, state.player);
    const map = removeFromMap(field, state.dungeon.map);
    const dungeon = Object.assign({}, state.dungeon, { map });
    player.weapon = getWeapon(dungeon.level);
    return moveToField(field, Object.assign({}, state, { player, dungeon }));
}

function enterNextLevel(state) {
    const { dungeon, enemies, position } = createNewLevel(state.dungeon.level + 1);
    const player = Object.assign({}, state.player, { position });
    return Object.assign({}, state, {
        dungeon,
        enemies,
        player
    });
}

function takeAction(position, state) {
    const field = Object.assign({}, state.dungeon.map[position.y][position.x]);
    const types = FieldTypes.Types;

    switch (field.type) {
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

function moveUp(state) {
    const nextField = {
        x: state.player.position.x,
        y: state.player.position.y - 1
    };

    return takeAction(nextField, state);
}

function moveRight(state) {
    const nextField = {
        x: state.player.position.x + 1,
        y: state.player.position.y
    };

    return takeAction(nextField, state);
}

function moveDown(state) {
    const nextField = {
        x: state.player.position.x,
        y: state.player.position.y + 1
    };

    return takeAction(nextField, state);
}

function moveLeft(state) {
    const nextField = {
        x: state.player.position.x - 1,
        y: state.player.position.y
    };

    return takeAction(nextField, state);
}

export function getReducer(initialState) {
    return function reducer(state, action) {
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
