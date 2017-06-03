import { getWeapon } from './Weapons';
import FieldTypes from './FieldTypes';
import DungeonGenerator from './DungeonGenerator';
import EnemyGenerator from './EnemyGenerator';
import { randomIntBetween } from '../utils/MathUtils';

function createEnemies(flatMap, level) {
    const enemyFields = flatMap.filter(field => field.type === FieldTypes.Types.enemy);
    return enemyFields.map((enemyField) => {
        const { x, y } = enemyField;
        return EnemyGenerator.generate(x, y, level);
    });
}

export function createInitialState() {
    const dungeon = DungeonGenerator.generate();
    const flatMap = dungeon.map.reduce((acc, row) => {
        acc.push(...row);
        return acc;
    }, []);

    const { x, y } = flatMap.filter(item => item.type === FieldTypes.Types.player)[0];

    return {
        dungeon,
        enemies: createEnemies(flatMap, 1),
        player: {
            health: 100,
            attack: 7,
            weapon: getWeapon(0),
            level: 1,
            position: { x, y },
            exp: 0
        }
    };
}

function copyMap(map) {
    return map.map(row => row.map(field => Object.assign({}, field)));
}

function removeFromMap(field, map) {
    return map.slice().map((row) => {
        const idx = row.indexOf(field);
        if (idx === -1) {
            return row;
        }

        const newRow = row.slice();
        newRow[idx] = Object.assign({}, newRow[idx], { type: FieldTypes.Types.earth });
        return newRow;
    });
}

function levelUp(player) {
    const newPlayer = Object.assign({}, player);
    newPlayer.level += 1;
    newPlayer.attack += randomIntBetween(8, 12) * newPlayer.level;
    return newPlayer;
}

function fight(fieldWithEnemy, state) {
    let player = Object.assign({}, state.player);
    let enemy = Object.assign({}, (fieldWithEnemy.enemy)
        ? fieldWithEnemy.enemy
        : EnemyGenerator(state.dungeonLevel)
    );
    let newMap = state.dungeon.map;

    player.health -= enemy.attack;
    enemy.health -= player.attack + player.weapon.attack;

    if (enemy.health < 0) {
        player.exp += enemy.exp;
        player.position.x = fieldWithEnemy.x;
        player.position.y = fieldWithEnemy.y;
        newMap = removeFromMap(fieldWithEnemy, state.dungeon.map);
        enemy = null;
    } else {
        newMap[fieldWithEnemy.y][fieldWithEnemy.x] = enemy;
    }

    if (player.exp > (player.level * 1000)) {
        player = levelUp(player);
    }
    return Object.assign({}, state, player, {
        dungeon: Object.assign({}, state.dungeon, { map: newMap })
    });
}

function moveToField(field, state) {
    let pX = state.player.position.x;
    let pY = state.player.position.y;
    let fX = field.x;
    let fY = field.y;

    let mapCopy = copyMap(state.dungeon.map);

    mapCopy[pY][pX] = Object.assign({}, mapCopy[pY][pX], {type: FieldTypes.Types.earth});
    mapCopy[fY][fX] = Object.assign({}, mapCopy[fY][fX], {type: FieldTypes.Types.player});

    return Object.assign({}, state, {
        player: Object.assign({}, state.player, {position: {x: fX, y: fY}}),
        dungeon: Object.assign({}, state.dungeon, {map: mapCopy})
    });
}

function takeAction(position, state) {
    let field = state.dungeon.map[position.y][position.x];

    switch(field.type) {
        case FieldTypes.Types.rock:
            return state;
        case FieldTypes.Types.earth:
            return moveToField(field, state);

        case FieldTypes.Types.enemy:
            return fight(field, state);
    }
}

function moveUp(state) {
    let newField = {
        x: state.player.position.x,
        y: state.player.position.y - 1
    };

    return takeAction(newField, state);
}

function moveRight(state) {
    let newField = {
        x: state.player.position.x + 1,
        y: state.player.position.y
    };

    return takeAction(newField, state);
}

function moveDown(state) {
    let newField = {
        x: state.player.position.x,
        y: state.player.position.y + 1
    };

    return takeAction(newField, state);
}

function moveLeft(state) {
    let newField = {
        x: state.player.position.x - 1,
        y: state.player.position.y
    };

    return takeAction(newField, state);
}

export function getReducer(initialState) {
    return function(state, action) {
        if (state === undefined) {
            return initialState;
        }

        switch(action.type) {
            case 'MOVE_LEFT':
                return moveLeft(state);
            case 'MOVE_RIGHT':
                return moveRight(state);
            case 'MOVE_UP':
                return moveUp(state);
            case 'MOVE_DOWN':
                return moveDown(state);
            default:
                return state;
        }

    };
}

export default {createInitialState, getReducer};
