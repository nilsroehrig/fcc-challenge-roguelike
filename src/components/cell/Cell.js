import React from 'react';
import FieldTypes from '../../game/FieldTypes';
import './Cell.css';

export function Cell(props) {
    props.game.dispatch('cellHasType', { x: props.x, y: props.y, type: props.type });
    return (
        <div className={'Cell Cell--' + FieldTypes.TypesByCode[props.type]}></div>
    );
}

export default Cell;
