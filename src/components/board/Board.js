import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import Row from '../row/Row';

import './Board.css';

export default function Board(props) {
    const rows = props.map.map(row => <Row cells={row} key={uuid()} />);
    return (
        <div className="Board">
            {rows}
        </div>
    );
}

Board.propTypes = {
    map: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        type: PropTypes.number.isRequired,
        img: PropTypes.string
    }))).isRequired
};
