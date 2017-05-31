import React from 'react';
import FieldTypes from '../../game/FieldTypes';
import './Cell.css';

export function Cell(props) {
    return (
        <div className={'Cell Cell--' + FieldTypes.TypesByCode[props.type]}></div>
    );
}

export default Cell;
