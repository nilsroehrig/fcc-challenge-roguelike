import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import DungeonGenerator from './game/DungeonGenerator';
import EnemyGenerator from './game/EnemyGenerator';
import {getWeapon} from './game/Weapons.js';
import {createStore, connect, Provider} from 'redux';
import FieldTypes from './game/FieldTypes';
import {randomIntBetween} from './utils/MathUtils';

function createInitialState() {
    let dungeon = DungeonGenerator();
    let flatMap = dungeon.map.reduce((acc, row) => {
        acc.push.apply(acc, row);
        return acc;
    }, []);

    let {x, y} = flatMap.filter(item => item.type === FieldTypes.Types.player)[0];

    let weapon = getWeapon(0);

    return {
        dungeon: DungeonGenerator(),
        player: {
            health: 100,
            attack: 7,
            weapon: getWeapon(0),
            level: 1,
            position: {x, y},
            exp: 0
        }
    };
}

function removeFromMap(field, map) {
    return map.slice().map(row => {
        let idx = row.indexOf(field);
        if (idx === -1) {
            return row;
        }

        let newRow = row.slice();
        newRow[idx] = Object.assign({}, newRow[idx], {type: FieldTypes.Types.earth});
    });
}

function levelUp(player) {
    let newPlayer = Object.assign({}, player);
    newPlayer.level += 1;
    newPlayer.attack += randomIntBetween(8, 12) * newPlayer.level;
    return newPlayer;
}

function fight(state, fieldWithEnemy) {
    let player = Object.assign({}, state.player);
    let enemy = Object.assign({}, (fieldWithEnemy.enemy) ? fieldWithEnemy.enemy: EnemyGenerator(state.dungeonLevel));
    let newMap = state.dungeon.map;

    player.health -= enemy.attack;
    enemy.health -= player.attack + player.weapon.attack;

    if (enemy.health < 0) {
        player.exp += enemy.exp;
        player.position.x = fieldWithEnemy.x;
        player.position.y = fieldWithEnemy.y;
        newMap = removeFromMap(fieldWithEnemy, state.dungeon.map);
        enemy = null;
    }

    if (player.exp > (player.level * 1000)) {
        player = levelUp(player);
    }

    return Object.assign({}, state, player, {dungeon: Object.assign({}, state.dungeon, {map: newMap})});
}

function takeAction(position, state) {
    let field = state.map[position.y][position.x];
    let newState;

    switch(field.type) {
        case FieldTypes.rock:
            newState = state;
            break;

        case FieldTypes.earth:
            newState = Object.assign(state, {playerPosition:{x: field.x, y: field.y}});
            break;

        case FieldTypes.enemy:
            newState = fight(state, field);
            break;
    }

    return newState;
}

function moveUp(state) {
    let newField = {
        x: state.playerPosition.x,
        y: state.playerPosition.y - 1
    };

    return takeAction(newField, state);
}

function moveRight(state) {
    let newField = {
        x: state.playerPosition.x + 1,
        y: state.playerPosition.y
    };

    return takeAction(newField, state);
}

function moveDown(state) {
    let newField = {
        x: state.playerPosition.x,
        y: state.playerPosition.y + 1
    };

    return takeAction(newField, state);
}

function moveLeft(state) {
    let newField = {
        x: state.playerPosition.x - 1,
        y: state.playerPosition.y
    };

    return takeAction(newField, state);
}
const initialState = createInitialState();

let reducer = function(state, action) {
    if (state === undefined) {
        return initialState;
    }

    let newState = state;

    switch(action) {
        case 'MOVE_LEFT':
        newState = moveLeft(state);
        break;
        case 'MOVE_RIGHT':
        newState = moveRight(state);
        break;
        case 'MOVE_UP':
        newState = moveUp(state);
        break;
        case 'MOVE_DOWN':
        newState = moveDown(state);
        break;


    }

    return newState;
};

const store = createStore(reducer, initialState);

// ReactDOM.render(<App game={initialState} />, document.getElementById('root'));
