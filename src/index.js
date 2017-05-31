import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {createStore, connect, Provider} from 'redux';
import {createInitialState, getReducer} from './game/StateManager';


const initialState = createInitialState();
const store = createStore(getReducer(initialState));

ReactDOM.render(<App appState={store.getState()} />, document.getElementById('root'));
