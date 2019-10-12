import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { joinGame } from '../services';
import PlayerList from './playerList.js';
import TeamStandings from './teamStandings.js';

const GameLanding = ({
    history,
    player, 
    players, 
    battle,
    gameIsAwaitingPlayers
}) => {
    const [isJoining, setIsJoining] = useState(false);
    
    const handleJoinClick = async () => {
        setIsJoining(true);
        await joinGame(player.id);
        setIsJoining(false);
    };

    if (gameIsAwaitingPlayers) {
        if (player.isPlaying === true) {
            return (
                <p>You're in! The game will start shortly. Please wait here.</p>
            )
        }
        return (
            <div>
                <p>A game is about to start. Would you like to play?</p>
                <button 
                    type="button"
                    onClick={handleJoinClick}
                    disabled={isJoining}
                >Hell yes!</button>
            </div>
        )
        
    }

    if (battle) {
        return <Redirect to={{
            pathname: '/battle'
        }} />
    }

    return (
        <section>
            <h1>Player Map</h1><br />
            <TeamStandings players={players} />
            {player.lives <= 0 ? (
                <h2>You are dead. Watch the game, but no more playing!</h2>
            ) : null}
            <PlayerList 
                history={history} 
                player={player}
                players={players} 
            />
        </section>
    );
};

export default GameLanding;