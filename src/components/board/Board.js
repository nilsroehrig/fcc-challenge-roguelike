import React from 'react';
import PropTypes from 'prop-types';

import DungeonMap from '../../game/map/DungeonMap';

import Row from '../row/Row';

import './Board.css';

function getBoardStyle(dimensions, cellSize) {
    const { width, height } = dimensions;
    return {
        width: width * cellSize,
        height: height * cellSize
    };
}

export default function Board(props) {
    const rows = props.map.getState().mapData
                    .map(row => <Row cells={row} cellSize={props.cellSize} />);
    const boardStyle = getBoardStyle(props.map.getDimensions(), props.cellSize);
    return (
        <div className="Board" style={boardStyle}>
            {rows}
        </div>
    );
}

Board.propTypes = {
    map: PropTypes.instanceOf(DungeonMap).isRequired,
    cellSize: PropTypes.number.isRequired
};
