import React, { useState } from 'react';
import PlayerInfoBubble from './playerInfoBubble.js';

const PlayerList = ({history, player, players}) => {

    const [showingId, setShowingId] = useState(null);

    const handleShowClick = (idToShow = null) => {
        setShowingId(showingId !== idToShow ? idToShow : null);
    };

    const filterDeadAndInactivePlayers = players => players.filter(player => player.lives > 0 && player.isPlaying === true);

    const shouldBeDisabled = (opponentId, opponentTeam, isBattling) => {
        return !player || 
            opponentId === player.id || 
            isBattling === true || 
            player.team === opponentTeam || 
            player.lives <= 0;
    };

    return players ? (
        <ul>
            {filterDeadAndInactivePlayers(players).map(({id, displayName, team, isBattling, lives}) => {
                const isYou = player.id === id;
                const isShowing = showingId === id;
                return (
                    <li key={id}>
                        {displayName}{isYou ? ' (You)' : null} <button type="button" onClick={() => handleShowClick(id)}>{isShowing ? 'Hide' : 'Show'} Info</button>
                        <PlayerInfoBubble 
                            isYou={isYou}
                            history={history}
                            displayName={displayName}
                            isBattling={isBattling}
                            team={team}
                            lives={lives}
                            player={player}
                            id={id}
                            isShowing={isShowing} 
                            isDisabled={shouldBeDisabled(id, team, isBattling)}
                        /><br /><br />
                    </li>
                )
            })}
        </ul>
    ) : 'No players found.';
};

export default PlayerList;