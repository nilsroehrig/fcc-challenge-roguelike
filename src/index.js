import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import DungeonGenerator from './game/DungeonGenerator';
import {getWeapon} from './game/Weapons.js';
import {createStore, connect, Provider} from 'redux';
import FieldTypes from './game/FieldTypes';

function createInitialState() {
    let dungeon = DungeonGenerator();
    let flatMap = dungeon.map.reduce((acc, row, y) => {
        row.forEach((type, x) => acc.push({x, y, type}));
        return acc;
    });
    let playerPosition = flatMap.filter(item => item.type === FieldTypes.player)[0];
    let weapon = getWeapon(0);

    return {
        dungeon: DungeonGenerator(),
        player: {
            health: 100,
            attack: 7,
            weapon: getWeapon(0),
            level: 1,
            position: playerPosition
        }
    };
}

function takeAction(field, state) {
    // determine action based on field type
    return state;
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

    return state;
};

const store = createStore(initialState, reducer);

ReactDOM.render(<App />, document.getElementById('root'));
