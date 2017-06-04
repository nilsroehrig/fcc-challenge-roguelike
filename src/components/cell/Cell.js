import React from 'react';
import PropTypes from 'prop-types';
import FieldTypes from '../../game/map/fields/FieldTypes';
import './Cell.css';

export default function Cell(props) {
    const style = (props.img)
        ? { backgroundImage: `url("${props.img}")` }
        : null;
    const type = FieldTypes.TypesByCode[props.type];
    return (
        <div className={`Cell Cell--${type}`}>
            <div className="Cell__content" style={style} />
        </div>
    );
}

Cell.propTypes = {
    type: PropTypes.number,
    img: PropTypes.string
};

Cell.defaultProps = {
    type: FieldTypes.Types.earth,
    img: null
};
