import React from 'react';
import PropTypes from 'prop-types';
import Row from '../row/Row';

import './Board.css';

export default function Board(props) {
    const rows = props.map.map((row, index) => <Row cells={row} key={index} />);
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
