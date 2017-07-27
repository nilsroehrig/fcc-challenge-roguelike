import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DungeonMap from '../../game/map/DungeonMap';

import Row from '../row/Row';

import './Board.css';

export default class Board extends Component {
    constructor() {
        super();
        this.containerElement = null;
        this.boardElement = null;
    }

    componentDidMount() {
        this.mapPlayerPositionToScrollPosition();
    }

    componentDidUpdate() {
        this.mapPlayerPositionToScrollPosition();
    }

    getBoardWidthInPx() {
        const { width, height } = this.props.map.getDimensions();
        const cellSize = this.props.cellSize;
        return {
            width: width * cellSize,
            height: height * cellSize
        };
    }

    mapPlayerPositionToScrollPosition() {
        const { x, y } = this.props.player.position;
        const cellSize = this.props.cellSize;
        const { width, height } = this.getBoardWidthInPx();
        const containerRect = this.containerElement.getBoundingClientRect();

        const scrollTop = height - (cellSize * y) - (cellSize / 2) - (containerRect.height / 2);
        const scrollLeft = width - (cellSize * x) - (cellSize / 2) - (containerRect.width / 2);

        this.containerElement.scrollTop = scrollTop + (height / 2);
        this.containerElement.scrollLeft = scrollLeft + (width / 2);
    }

    buildContainerStyle() {
        return {
            backgroundSize: this.props.cellSize
        };
    }

    buildBoardStyle() {
        const { width, height } = this.getBoardWidthInPx();
        return { margin: `${height / 2}px ${width / 2}px`, width, height };
    }

    renderRows() {
        return this.props.map.getState().mapData
            .map(row => <Row cells={row} cellSize={this.props.cellSize} />);
    }

    render() {
        const rows = this.renderRows();
        return (
            /* eslint-disable no-return-assign */
            <div className="Board__container" style={this.buildContainerStyle()} ref={boardElement => this.containerElement = boardElement}>
                <div className="Board__content" style={this.buildBoardStyle()} ref={boardElement => this.boardElement = boardElement}>
            {/* eslint-enable */}
                    {rows}
                </div>
            </div>
        );
    }
}

Board.propTypes = {
    map: PropTypes.instanceOf(DungeonMap).isRequired,
    player: PropTypes.shape().isRequired,
    cellSize: PropTypes.number.isRequired
};
