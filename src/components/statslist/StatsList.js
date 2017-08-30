import React from 'react';
import PropTypes from 'prop-types';

import './StatsList.css';

export default function StatsList(props) {
    return (
        <ul className="StatsList">
            <li className="StatsList__item">
                <span className="StatsList__attribute-name">Health:</span>
                <strong>{props.health}</strong>
            </li>
            <li className="StatsList__item" title={`(base: ${props.attack}; weapon: ${props.weapon.attack})`}>
                <span className="StatsList__attribute-name">Attack:</span>
                <strong className="StatsList__attribute-value">{props.attack + props.weapon.attack}</strong>
            </li>
            <li className="StatsList__item" title={`(attack: ${props.weapon.attack}; crit chance: ${props.weapon.critChance}%)`}>
                <span className="StatsList__attribute-name">Weapon:</span>
                <strong className="StatsList__attribute-value">{props.weapon.name}</strong>
            </li>
            <li className="StatsList__item">
                <span className="StatsList__attribute-name">Experience:</span>
                <strong className="StatsList__attribute-value">{props.exp}</strong></li>
            <li className="StatsList__item">
                <span className="StatsList__attribute-name">Level:</span>
                <strong className="StatsList__attribute-value">{props.level}</strong>
            </li>
            <li className="StatsList__item">
                <span className="StatsList__attribute-name">Dungeon:</span>
                <strong className="StatsList__attribute-value">{props.dungeonLevel}</strong>
            </li>
        </ul>
    );
}

StatsList.propTypes = {
    health: PropTypes.number.isRequired,
    attack: PropTypes.number.isRequired,
    dungeonLevel: PropTypes.number.isRequired,
    weapon: PropTypes.shape({
        attack: PropTypes.number,
        critChance: PropTypes.number,
        name: PropTypes.string
    }).isRequired
};
