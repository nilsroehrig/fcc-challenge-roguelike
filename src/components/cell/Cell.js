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

function buildCellStyle(position, cellSize, paddingLeft, paddingTop) {
    const { x, y } = position;
    return {
        left: (x * cellSize) + paddingLeft,
        top: (y * cellSize) + paddingTop,
        height: cellSize,
        width: cellSize
    };
}

export default function Cell(props) {
    const contentStyle = buildContentStyle(props.field.getImage());
    const cellStyle = buildCellStyle(
        props.field.getPosition(),
        props.cellSize,
        props.cellPaddingLeft,
        props.cellPaddingTop);
    const typeName = TypesByCode[props.field.getType()];
    return (
        <div className={`Cell Cell--${typeName}`} style={cellStyle}>
            <div className="Cell__content" style={contentStyle} />
        </div>
    );
}

Cell.propTypes = {
    field: PropTypes.instanceOf(Field).isRequired,
    cellSize: PropTypes.number,
    cellPaddingTop: PropTypes.number.isRequired,
    cellPaddingLeft: PropTypes.number.isRequired
};

Cell.defaultProps = {
    cellSize: 40
};
