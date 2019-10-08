import React from 'react';
// import firebase from '../config/firebase.js';
// import { useObject } from 'react-firebase-hooks/database';
// import { convertObjectToArray } from '../utils/objectUtils.js';
import { makeMove } from '../services';
import battleMoves from '../config/battleMoves';

const Battle = ({battle, player, opponent}) => {
    
    console.log(opponent);

    const playerMove = battle.moves[player.id];
    const opponentMove = battle.moves[opponent.id];

    const handleMoveClick = async moveId => await makeMove(battle.id, player.id, moveId);

    return (
        <section>
            <h1>Battle</h1>
            <h2>Choose your move:</h2>
            {battleMoves[player.team].map(({type, label}) =>
                <button
                    key={type}
                    onClick={() => handleMoveClick(type)}>{label} ({type})
                </button>
            )}
            {playerMove ? <p>You have chosen: {playerMove}</p> : null}
            {opponentMove ? <p>Your opponent has made their move.</p> : null}
        </section>
    );
};

export default Battle;