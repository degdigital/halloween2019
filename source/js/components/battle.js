import React from 'react';
import firebase from '../config/firebase.js';
import { useObject } from 'react-firebase-hooks/database';
import { convertObjectToArray } from '../utils/objectUtils.js';
import { makeMove } from '../services/battleService.js';
import battleMoves from '../config/battleMoves';

const Battle = ({user, location}) => {

    const [playersSnapshot] = useObject(firebase.database().ref('players'));
    const [battlesSnapshot] = useObject(firebase.database().ref('battles'));
    const players = playersSnapshot ? convertObjectToArray(playersSnapshot.val()) : null;
    const battles = battlesSnapshot ? convertObjectToArray(battlesSnapshot.val()) : null;
    const currentBattle = battles ? battles.find(battle => Object.keys(battle.players).includes(user.uid)) : null;
    const opponentId = currentBattle ? Object.keys(currentBattle.players).find(id => id !== user.uid) : null;
    const currentPlayer = players ? players.find(({id}) => id === user.uid) : null;
    const opponent = players ? players.find(({id}) => id === opponentId) : null;
    const currentMove = currentPlayer && currentBattle && ['string', 'boolean'].includes(typeof currentBattle.moves[currentPlayer.id]) ? currentBattle.moves[currentPlayer.id] : null;
    const opponentMove = opponent && currentBattle && ['string', 'boolean'].includes(typeof currentBattle.moves[opponent.id]) ? currentBattle.moves[opponent.id] : null;

    const handleMoveClick = async moveId => await makeMove(currentBattle.id, currentPlayer.id, moveId);

    return (
        <section>
            <h1>Battle</h1>
            {location && location.state && location.state.hasBeenChallenged === true ? (<h2>You have been challenged!</h2>) : null}
            <h2>Choose your move:</h2>
            {currentPlayer ? battleMoves[currentPlayer.currentTeam].map(({type, label}) =>
                <button
                    key={type}
                    disabled={currentMove}
                    onClick={() => handleMoveClick(type)}>{label} ({type})
                </button>
            ) : null}
            {currentMove ? <p>You have chosen: {currentMove}</p> : null}
            {opponentMove ? <p>Your opponent has made their move.</p> : null}
            {currentBattle && currentBattle.winner === 'tie' ? (<p>It's a tie!</p>) : null}
            {currentBattle && currentPlayer && currentBattle.winner === currentPlayer.id ? (<p>You win!</p>) : null}
            {currentBattle && opponentId && currentBattle.winner === opponentId ? (<p>{opponent.displayName} wins!</p>) : null}
        </section>
    );
};

export default Battle;