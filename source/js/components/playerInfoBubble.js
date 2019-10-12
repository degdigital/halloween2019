import React from 'react';
import { engagePlayerInBattle } from '../services/battleService.js';

const PlayerInfoBubble = ({ history, isYou, player, isShowing, isDisabled, isBattling, id, lives, team }) => {

    const handleButtonClick = async () => {
        await engagePlayerInBattle(id, player.id);
        history.push(`/battle`);
    };
    return (
        <div className={isShowing ? '' : 'is-vishidden'}>
            <h2>Player Info</h2>
            <ul>
                <li>Team: {team}</li>
                <li>Lives remaining: {lives}</li>
                <li>In a battle: {isBattling ? 'yes' : 'no'}</li>
            </ul>
            {isYou ? null : <button 
                type="button" 
                disabled={isDisabled}
                onClick={handleButtonClick}>Battle this person!</button>
            }
        </div>
    )

};

export default PlayerInfoBubble;