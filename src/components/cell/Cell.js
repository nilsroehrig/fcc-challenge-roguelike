import React from 'react';
import PropTypes from 'prop-types';

import { TypesByCode } from '../../game/map/fields/FieldTypes';
import Field from '../../game/map/fields/Field';

import './Cell.css';

export default function Cell(props) {
    const style = (props.field.getImage())
        ? { backgroundImage: `url("${props.field.getImage()}")` }
        : null;
    const type = TypesByCode[props.field.getType()];
    return (
        <div className={`Cell Cell--${type}`}>
            <div className="Cell__content" style={style} />
        </div>
    );
}

Cell.propTypes = {
    field: PropTypes.instanceOf(Field).isRequired
};
