import React from 'react';
import Row from '../row/Row';
import './Board.css';

function Board(props) {
    let rows = props.dungeon.map.map(row => <Row cells={row} />);
    return (
        <div className="Board">
            {rows}
        </div>
    );
}

export default Board;
