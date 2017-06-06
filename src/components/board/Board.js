import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import DungeonMap from '../../game/map/DungeonMap';

import Row from '../row/Row';

import './Board.css';

export default function Board(props) {
    const rows = props.map.getState().mapData.map(row => <Row cells={row} key={uuid.v4()} />);

    // const { map } = props;
    // let str = '';
    // map.getFlatMap().forEach((field, idx) => {
    //     str += field.getType().toString();
    //     str += ((idx + 1) % map.getState().width === 0) ? '\n' : '';
    // });
    // console.log(str);

    // let str = props.map.getState().mapData.reduce((a, r) => {
    //     return a + r.reduce((ac, f) => ac + f.getType().toString(), '') + '\n';
    // }, '');
    //
    // console.log(str);

    return (
        <div className="Board">
            {rows}
        </div>
    );
}

Board.propTypes = {
    map: PropTypes.instanceOf(DungeonMap).isRequired
};
