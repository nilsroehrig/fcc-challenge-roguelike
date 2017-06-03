import React from 'react';
import PropTypes from 'prop-types';
import FieldTypes from '../../game/FieldTypes';
import './Cell.css';

export default function Cell(props) {
    const style = (props.img) ? {
        backgroundImage: `url(${props.img})`,
        borderRadius: 0
    } : null;
    return (
        <div className={`Cell Cell--${FieldTypes.TypesByCode[props.type]}`} style={style} />
    );
}

Cell.propTypes = {
    type: PropTypes.string
};

Cell.defaultProps = {
    type: FieldTypes.Types.earth
};
