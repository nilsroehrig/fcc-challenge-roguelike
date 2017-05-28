import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import DungeonGenerator from './game/DungeonGenerator';


const initialState = {
    dungeon: DungeonGenerator();
}

ReactDOM.render(<App />, document.getElementById('root'));
