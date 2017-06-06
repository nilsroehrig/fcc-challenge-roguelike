import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import DungeonMap from '../../game/map/DungeonMap';

import Row from '../row/Row';

import './Board.css';

export default function Board(props) {
    const rows = props.map.getState().mapData.map(row => <Row cells={row} key={uuid.v4()} />);
    console.log('board rendered');
    return (
        <div className="Board">
            {rows}
        </div>
    );
}

Board.propTypes = {
    map: PropTypes.instanceOf(DungeonMap).isRequired
};
