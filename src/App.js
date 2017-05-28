import React, {Component} from 'react';
import './App.css';
import Board from './components/board/Board';

class App extends Component {
    render() {
        return (
            <div className="App">
                <h1>dzc roguelike</h1>
                <Board dungeon={this.props.game.dungeon}/>
            </div>
        );
    }
}

export default App;
