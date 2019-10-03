import React from 'react';
import { engagePlayerInBattle } from '../services/battleService.js';

const PlayerList = ({history, currentPlayer, players}) => {

    const handleButtonClick = async (id, currentPlayerId) => {
        await engagePlayerInBattle(id, currentPlayerId);
        history.push(`/battle`);
    };

    const isDisabled = (opponentId, opponentTeam, currentPlayer, isBattling) => {
        return !currentPlayer ||
            opponentId === currentPlayer.id || 
            isBattling === true || 
            currentPlayer.currentTeam === opponentTeam;
    };

    return players ? (
        <ul>
            {players.map(({id, displayName, currentTeam, isBattling}) => {
                return (
                    <li key={id}>
                        <button 
                            type="button" 
                            disabled={isDisabled(id, currentTeam, currentPlayer, isBattling)}
                            onClick={() => handleButtonClick(id, currentPlayer.id)}>{displayName}{currentPlayer && currentPlayer.id === id ? ' - You' : null} ({currentTeam}){isBattling ? ' - Battling' : ''}
                        </button>
                    </li>
                )
            })}
        </ul>
    ) : 'No players found.';
};

export default PlayerList;