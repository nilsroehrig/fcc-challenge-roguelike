import React from 'react';
import PropTypes from 'prop-types';
import FieldTypes from '../../game/FieldTypes';
import './Cell.css';

export default function Cell(props) {
    return (
        <div className={`Cell Cell--${FieldTypes.TypesByCode[props.type]}`} />
    );
}

Cell.propTypes = {
    type: PropTypes.string
};

Cell.defaultProps = {
    type: FieldTypes.Types.earth
};
