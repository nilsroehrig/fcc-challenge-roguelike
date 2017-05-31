import React, {Component} from 'react';
import './App.css';
import Board from './components/board/Board';

export default function App(props) {
    let player = props.appState.player;
    let dungeon = props.appState.dungeon;
    return (
        <div className="App">
            <h1>dzc roguelike</h1>
            <ul>
                <li>Health: <strong>{player.health}</strong></li>
                <li>Attack: <strong>{player.attack + player.weapon.attack}</strong><br /><small>(base: {player.attack}; weapon:{player.weapon.attack})</small></li>
                <li>Weapon: {player.weapon.name}</li>
                <li>Experience: <strong>{player.exp}</strong></li>
                <li>Level: <strong>{player.level}</strong></li>
            </ul>
            <Board dungeon={dungeon}/>
        </div>
    );
}
