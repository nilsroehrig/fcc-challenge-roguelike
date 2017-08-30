import React from 'react';
import PropTypes from 'prop-types';

import Field from '../../game/map/fields/Field';

import Cell from '../cell/Cell';

import './Row.css';

export default function Row(props) {
    const cells = props.cells
        .map(cell => (
            <Cell
                field={cell}
                key={cell.getId()}
                cellSize={props.cellSize}
                cellPaddingTop={props.cellPaddingTop}
                cellPaddingLeft={props.cellPaddingLeft}
                playerPosition={props.playerPosition}
            />));
    return (
        <div className="Row">{cells}</div>
    );
}

Row.propTypes = {
    cells: PropTypes.arrayOf(PropTypes.instanceOf(Field)).isRequired,
    cellSize: PropTypes.number.isRequired,
    cellPaddingTop: PropTypes.number,
    cellPaddingLeft: PropTypes.number,
    playerPosition: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    }).isRequired
};

Row.defaultProps = {
    cellPaddingLeft: 0,
    cellPaddingTop: 0
};
