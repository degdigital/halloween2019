import React from 'react';
import { engagePlayerInBattle } from '../services/battleService.js';

const PlayerList = ({history, player, players}) => {

    const handleButtonClick = async (id) => {
        await engagePlayerInBattle(id, player.id);
        history.push(`/battle`);
    };

    const filterDeadAndInactivePlayers = players => players.filter(player => player.lives > 0 && player.isPlaying === true);

    const isDisabled = (opponentId, opponentTeam, isBattling) => {
        return !player || 
            opponentId === player.id || 
            isBattling === true || 
            player.team === opponentTeam || 
            player.lives <= 0;
    };

    return players ? (
        <ul>
            {filterDeadAndInactivePlayers(players).map(({id, displayName, team, isBattling, lives}) => {
                return (
                    <li key={id}>
                        <button 
                            type="button" 
                            disabled={isDisabled(id, team, isBattling)}
                            onClick={() => handleButtonClick(id)}>{displayName}{player && player.id === id ? ' - You' : null} ({team}){isBattling ? ' - Battling' : ''}{lives ? ' - ' + lives + ' lives remaining' : null}
                        </button>
                    </li>
                )
            })}
        </ul>
    ) : 'No players found.';
};

export default PlayerList;