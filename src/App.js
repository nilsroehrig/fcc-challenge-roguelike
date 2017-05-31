import React, {Component} from 'react';
import './App.css';
import Board from './components/board/Board';

export default class App extends Component {
    constructor() {
        super();
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleKeyPress(event) {
        switch(event.keyCode) {
            /*
            left arrow 	37
            up arrow 	38
            right arrow 	39
            down arrow 	40
            */
            case 37:
                event.preventDefault();
                this.props.store.dispatch({type: 'MOVE_LEFT'});
                break;
            case 38:
                event.preventDefault();
                this.props.store.dispatch({type: 'MOVE_UP'});
                break;
            case 39:
                event.preventDefault();
                this.props.store.dispatch({type: 'MOVE_RIGHT'});
                break;
            case 40:
                event.preventDefault();
                this.props.store.dispatch({type: 'MOVE_DOWN'});
                break;
        }
    }

    componentDidMount() {
        document.addEventListener('keypress', this.handleKeyPress);
    }

    componentWillUnmount() {
        document.removeEventListener('keypress', this.handleKeyPress);
    }

    render() {
        let player = this.props.appState.player;
        let dungeon = this.props.appState.dungeon;
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
}
