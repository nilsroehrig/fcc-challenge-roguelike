import React from 'react';
import PropTypes from 'prop-types';

import { TypesByCode } from '../../game/map/fields/FieldTypes';
import Field from '../../game/map/fields/Field';

import './Cell.css';

function buildContentStyle(img) {
    if (img) {
        return { backgroundImage: `url("${img}")` };
    }
    return img;
}

function buildCellStyle(position, cellSize) {
    const { x, y } = position;
    return {
        left: x * cellSize,
        top: y * cellSize,
        height: cellSize,
        width: cellSize
    };
}

export default function Cell(props) {
    const contentStyle = buildContentStyle(props.field.getImage());
    const cellStyle = buildCellStyle(props.field.getPosition(), props.cellSize);
    const type = TypesByCode[props.field.getType()];
    return (
        <div className={`Cell Cell--${type}`} style={cellStyle}>
            <div className="Cell__content" style={contentStyle} />
        </div>
    );
}

Cell.propTypes = {
    field: PropTypes.instanceOf(Field).isRequired,
    cellSize: PropTypes.number
};

Cell.defaultProps = {
    cellSize: 40
};
