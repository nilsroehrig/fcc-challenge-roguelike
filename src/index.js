import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

import 'normalize.css';
import './index.css';
import App from './App';
import { createInitialState, getReducer } from './game/StateManager';


const initialState = createInitialState();
const store = createStore(getReducer(initialState));

const render = function render() {
    ReactDOM.render(<App store={store} appState={store.getState()} />, document.getElementById('root'));
};

store.subscribe(render);
render();
