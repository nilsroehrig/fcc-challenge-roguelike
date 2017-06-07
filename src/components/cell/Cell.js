import React from 'react';
import PropTypes from 'prop-types';

import { TypesByCode } from '../../game/map/fields/FieldTypes';
import Field from '../../game/map/fields/Field';

import './Cell.css';

function CellContent(props) {
    return <div className="Cell__content" style={props.style} />;
}

function buildStyle(img) {
    if (img) {
        return { backgroundImage: `url("${img}")` };
    }
    return img;
}

export default function Cell(props) {
    const style = buildStyle(props.field.getImage());
    const type = TypesByCode[props.field.getType()];
    return (
        <div className={`Cell Cell--${type}`}>
            <CellContent style={style} />
        </div>
    );
}

Cell.propTypes = {
    field: PropTypes.instanceOf(Field).isRequired
};
