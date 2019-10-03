import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import firebase from '../config/firebase.js';
import { useObject, useObjectVal } from 'react-firebase-hooks/database';
import { convertObjectToArray } from '../utils/objectUtils.js';
import { joinGame } from '../services/gameService.js';
import PlayerList from './playerList.js';

const PlayerMap = ({history, user}) => {

    const [snapshot, loading, error] = useObject(firebase.database().ref('players').orderByChild('isPlaying').equalTo(true));
    const [hasBeenChallenged] = useObjectVal(firebase.database().ref(`battleInvites/${user.uid}`));
    const [gameIsAwaitingPlayers] = useObjectVal(firebase.database().ref(`gameIsAwaitingPlayers`));
    const [isJoining, setIsJoining] = useState(false);
    const players = snapshot ? convertObjectToArray(snapshot.val()) : null;
    const currentPlayer = players ? players.find(({id}) => id === user.uid) : null;
    const handleJoinClick = async () => {
        setIsJoining(true);
        await joinGame(user.uid);
        setIsJoining(false);
    };

    if (gameIsAwaitingPlayers) {
        if (currentPlayer && currentPlayer.isPlaying === true) {
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

    if (hasBeenChallenged) {
        return <Redirect to={{
            pathname: '/battle',
            state: {
                hasBeenChallenged: true
            }
        }} />
    }

    return (
        <section>
            <h1>Player Map</h1>
            {error && <strong>Error: {error}</strong>}
            {loading && <span>Loading...</span>}
            {snapshot && 
                <PlayerList 
                    history={history} 
                    currentPlayer={currentPlayer}
                    players={players} 
                />
            }
        </section>
    );
};

export default PlayerMap;