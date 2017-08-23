import React from 'react';
import PropTypes from 'prop-types';

import { TypesByCode } from '../../game/map/fields/FieldTypes';
import Field from '../../game/map/fields/Field';
import { distance } from '../../utils/MathUtils';

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

    const d = distance(props.playerPosition, props.field.getPosition());

    const classNames = ['Cell', `Cell--${typeName}`];

    if (d > 5) {
        return null;
    }

    return (
        <div className={classNames.join(' ')} style={cellStyle}>
            <div className="Cell__content" style={contentStyle} />
        </div>
    );
}

Cell.propTypes = {
    field: PropTypes.instanceOf(Field).isRequired,
    cellSize: PropTypes.number,
    cellPaddingTop: PropTypes.number.isRequired,
    cellPaddingLeft: PropTypes.number.isRequired,
    playerPosition: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    }).isRequired
};

Cell.defaultProps = {
    cellSize: 40
};
