/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './App.css';
import Board from './components/board/Board';
import GameOver from './components/gameover/GameOver';
import StatsList from './components/statslist/StatsList';

export default class App extends Component {
    constructor() {
        super();
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }

    dispatchAction(action) {
        if (this.props.appState.gameOver) {
            return;
        }
        this.props.store.dispatch(action);
    }

    getBackgroundSizeStyle() {
        return {
            backgroundSize: this.props.cellSize
        };
    }

    handleKeyPress(event) {
        window.requestAnimationFrame(() => {
            switch (event.keyCode) {
                case 37:
                    event.preventDefault();
                    this.dispatchAction({ type: 'MOVE_LEFT' });
                    break;
                case 38:
                    event.preventDefault();
                    this.dispatchAction({ type: 'MOVE_UP' });
                    break;
                case 39:
                    event.preventDefault();
                    this.dispatchAction({ type: 'MOVE_RIGHT' });
                    break;
                case 40:
                    event.preventDefault();
                    this.dispatchAction({ type: 'MOVE_DOWN' });
                    break;
                default:
                    break;
            }
        });
    }

    renderGameOver() {
        return (this.props.appState.gameOver)
            ? (
                <GameOver
                    isWon={this.props.appState.winner}
                    store={this.props.store}
                />
            )
            : null;
    }

    render() {
        const player = this.props.appState.player;
        const dungeon = this.props.appState.dungeon;
        return (
            <div className="App">
                <header className="App__header">
                    <h1 className="App__headline">DZC Roguelike</h1>
                    <StatsList {...player} dungeonLevel={dungeon.level} />
                </header>
                <div className="App__board-container" style={this.getBackgroundSizeStyle()}>
                    <Board {...dungeon} cellSize={this.props.cellSize} />
                </div>
                {this.renderGameOver()}
                <footer className="App__footer">
                    <p>Hero, Sword, Potion, Stairs icons are <a href="http://www.freepik.com">designed by Freepik</a></p>
                </footer>
            </div>
        );
    }
}

App.propTypes = {
    store: PropTypes.object.isRequired,
    appState: PropTypes.object.isRequired,
    cellSize: PropTypes.number
};

App.defaultProps = {
    cellSize: 40
};
