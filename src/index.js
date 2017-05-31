import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {createStore, connect, Provider} from 'redux';
import {createInitialState, getReducer} from './game/StateManager';


const initialState = createInitialState;
const store = createStore(getReducer(initialState), initialState);

// ReactDOM.render(<App game={initialState} />, document.getElementById('root'));
