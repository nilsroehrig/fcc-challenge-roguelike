import React from 'react';
import PropTypes from 'prop-types';

import './StatsList.css';

export default function StatsList(props) {
    return (
        <ul className="StatsList">
            <li className="StatsList__item">
                Health: <strong>{props.health}</strong>
            </li>
            <li className="StatsList__item" title={`(base: ${props.attack}; weapon: ${props.weapon.attack})`}>
                Attack: <strong>{props.attack + props.weapon.attack}</strong><br />
            </li>
            <li className="StatsList__item" title={`(attack: ${props.weapon.attack}; crit chance: ${props.weapon.critChance}%)`}>
                Weapon: <strong>{props.weapon.name}</strong>
            </li>
            <li className="StatsList__item">
                Experience: <strong>{props.exp}</strong></li>
            <li className="StatsList__item">
                Level: <strong>{props.level}</strong>
            </li>
            <li className="StateList__item">
                Dungeon: <strong>{props.dungeonLevel}</strong>
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
