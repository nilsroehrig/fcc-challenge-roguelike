import React, {Component} from 'react';
import './App.css';
import Board from './components/board/Board';
import DungeonGenerator from './game/DungeonGenerator';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dungeon: DungeonGenerator()
        };
    }
    render() {
        return (
            <div className="App">
                <h1>dzc roguelike</h1>
                <Board dungeon={this.state.dungeon}/>
            </div>
        );
    }
}

export default App;
