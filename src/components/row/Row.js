import React from 'react';
import Cell from '../cell/Cell';

import './Row.css';

function Row(props) {
    let cells = props.cells.map((cell, index) => <Cell {...cell} />);
    return (
        <div className="Row">{cells}</div>
    )
}

export default Row;
