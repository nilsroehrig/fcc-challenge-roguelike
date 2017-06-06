import React from 'react';
import PropTypes from 'prop-types';

import Field from '../../game/map/fields/Field';

import Cell from '../cell/Cell';

import './Row.css';

export default function Row(props) {
    console.log('row rendered');
    const cells = props.cells.map(cell => <Cell field={cell} key={cell.getId()} />);
    return (
        <div className="Row">{cells}</div>
    );
}

Row.propTypes = {
    cells: PropTypes.arrayOf(PropTypes.instanceOf(Field)).isRequired
};
