import React, { useState } from 'react';
import firebase from '../config/firebase.js';
import gameConfig from '../config/gameConfig.js';

const db = firebase.database();
const messages = {
    startNewGame: `Are you sure you want to start a new game? This will reset a game already in progress.`,
    newGameStarted: `New game started`,
    disableGame: `Are you sure you want to [disableState] the game?`,
    gameDisabled: `Game disabled.`,
    gameEnabled: `Game enabled.`,
    resetPlayers: `Are you sure you want to reset players? This will set all players to inactive.`,
    playersReset: `Players reset.`
};

const Admin = () => {

    const [message, setMessageState] = useState(null);
    const [actionIsInProgress, setActionIsInProgress] = useState(false);

    const setMessage = msg => {
        setMessageState(msg);
        setTimeout(() => setMessageState(null), 3000);
    };

    const assignToTeam = () => {
        const num = Math.random();
        return num <= .2 ? 'zombie' : 'survivor';
    };

    const enableGame = async (shouldEnable = true) => {
        if (window.confirm(messages.disableGame.replace('[disableState]', shouldEnable ? 'enable' : 'disable'))) {
            setActionIsInProgress(true);
            await db.ref().update({
                gameIsActive: shouldEnable
            });
            setMessage(shouldEnable ? messages.gameEnabled : messages.gameDisabled);
            setActionIsInProgress(false);
        }
    };

    const openGameAccess = async (shouldEnable = true) => { 
        if (window.confirm(messages.disableGame.replace('[disableState]', shouldEnable ? 'enable' : 'disable'))) {
            setActionIsInProgress(true);
            await db.ref().update({
                gameIsAwaitingPlayers: shouldEnable
            });
            setMessage(shouldEnable ? messages.gameEnabled : messages.gameDisabled);
            setActionIsInProgress(false);
        }
    };

    const startGame = async () => { 
        if (window.confirm(messages.startNewGame)) {
            setActionIsInProgress(true);
            const updates = {
                ['/battleInvites']: null,
                ['/battles']: null,
                ['/gameIsAwaitingPlayers']: false
            };
            const playersSnapshot = await db.ref('players').once('value');
            playersSnapshot.forEach(playerSnapshot => {
                const team = assignToTeam();
                updates[`/players/${playerSnapshot.key}`] = {
                    ...playerSnapshot.val(),
                    isBattling: false,
                    lives: gameConfig.lives[team],
                    team
                };
            });
            await db.ref().update(updates);
            await db.ref('gameIsActive').set(true);
            setMessage(messages.newGameStarted);
            setActionIsInProgress(false);
        }
    };

    const resetPlayers = async () => {
        if (window.confirm(messages.resetPlayers)) {
            setActionIsInProgress(true);
            const updates = {};
            const playersSnapshot = await db.ref('players').once('value');
            playersSnapshot.forEach(playerSnapshot => {
                updates[`/players/${playerSnapshot.key}`] = {
                    ...playerSnapshot.val(),
                    isPlaying: false,
                    isBattling: false,
                    lives: null,
                    team: null
                };
            });
            await db.ref().update(updates);
            setMessage(messages.playersReset);
            setActionIsInProgress(false);
        }
    };

    return (
        <div>
            <h1>Admin</h1>
            <button type="button" onClick={() => enableGame(true)} disabled={actionIsInProgress}>Enable Game</button><br />
            <button type="button" onClick={() => enableGame(false)} disabled={actionIsInProgress}>Disable Game</button><br /><br />

            <button type="button" onClick={() => openGameAccess(true)} disabled={actionIsInProgress}>Open Game to Player Opt-Ins</button><br />
            <button type="button" onClick={() => openGameAccess(false)} disabled={actionIsInProgress}>Close Game to Player Opt-Ins</button><br />
            <button type="button" onClick={resetPlayers} disabled={actionIsInProgress}>Reset Players</button><br /><br />
            
            <button type="button" onClick={startGame} disabled={actionIsInProgress}>Start New Game</button><br />
            {message && <p>{message}</p>}
        </div>
    )

};

export default Admin;