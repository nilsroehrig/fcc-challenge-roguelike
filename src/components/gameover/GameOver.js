/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import './GameOver.css';

export default function GameOver(props) {
    const classNames = ['GameOver'];
    if (props.isHidden) {
        classNames.push('GameOver--hidden');
    }
    return (
        <div className={classNames.join(' ')}>
            <div className="GameOver__message">
                <h2 className="GameOver__title">Game Over</h2>
                <p className="GameOver__text">You lost! Wanna try again?</p>
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
            </div>
        </div>
    );
}

GameOver.propTypes = {
    store: PropTypes.object.isRequired,
    isHidden: PropTypes.bool.isRequired
};
