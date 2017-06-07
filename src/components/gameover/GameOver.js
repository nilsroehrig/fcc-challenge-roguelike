/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import './GameOver.css';

export default function GameOver(props) {
    const classNames = ['GameOver'];
    const message = (props.isWon)
        ? 'You have won! Wanna rock again?'
        : 'You have lost! Wanna try again?';
    const headline = (props.isWon)
        ? 'Congratulations!'
        : 'Game Over';
    return (
        <div className={classNames.join(' ')}>
            <div className="GameOver__message">
                <h2 className="GameOver__title">{headline}</h2>
                <p className="GameOver__text">{message}</p>
                <p className="GameOver__buttons">
                    <button
                        className="GameOver__restart"
                        onClick={
                            () => {
                                props.store.dispatch({ type: 'RESTART' });
                            }
                        }
                    >Restart</button>
                </p>
                <p><a href="http://www.theuselessweb.com/">Nah, something else...</a></p>
            </div>
        </div>
    );
}

GameOver.propTypes = {
    store: PropTypes.object.isRequired,
    isWon: PropTypes.bool.isRequired
};
