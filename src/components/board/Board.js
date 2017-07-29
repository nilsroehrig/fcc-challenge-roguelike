import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DungeonMap from '../../game/map/DungeonMap';

import Row from '../row/Row';

import './Board.css';

export default class Board extends Component {
    constructor() {
        super();
        this.containerElement = null;
    }

    componentDidMount() {
        this.mapPlayerPositionToScrollPosition();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.player !== this.props.player) {
            this.mapPlayerPositionToScrollPosition();
        }
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

        this.containerElement.scrollTop = (height + ((y) * cellSize)) - (this.containerElement.clientHeight / 2);
        this.containerElement.scrollLeft = (width + ((x) * cellSize)) - (this.containerElement.clientWidth / 2);
    }

    buildContainerStyle() {
        return {
            backgroundSize: this.props.cellSize
        };
    }

    buildBoardStyle() {
        const { width, height } = this.getBoardWidthInPx();
        return {
            padding: `${height}px ${width}px`,
            width,
            height
        };
    }

    renderRows() {
        const { width, height } = this.getBoardWidthInPx();
        return this.props.map.getState().mapData
            .map(row => (
                <Row
                    cells={row}
                    cellSize={this.props.cellSize}
                    cellPaddingLeft={width}
                    cellPaddingTop={height}
                />));
    }

    render() {
        const rows = this.renderRows();
        return (
            /* eslint-disable no-return-assign */
            <div className="Board__container" style={this.buildContainerStyle()} ref={boardElement => this.containerElement = boardElement}>
                <div className="Board__content" style={this.buildBoardStyle()}>
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
