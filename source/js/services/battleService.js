import firebase from '../config/firebase.js';
import gameConfig from '../config/gameConfig.js';

const db = firebase.database();
const dbRef = db.ref();

const engagePlayerInBattle = async (opponentId, playerId, isEngaging = true) => {
    const battleId = dbRef.child('battles').push().key;
    const now = Date.now();
    await dbRef.update({
        [`players/${opponentId}/isBattling`]: isEngaging,
        [`players/${playerId}/isBattling`]: isEngaging,
        [`battles/${battleId}`]: {
            id: battleId,
            battleInitiationTime: now,
            battleWaitExpirationTime: now + gameConfig.battleWaitTime,
            initiator: playerId,
            winner: false,
            players: {
                [opponentId]: true,
                [playerId]: true
            },
            moves: {
                [opponentId]: false,
                [playerId]: false
            },
            isCompleted: false,
            isShowingResults: false
        }
    });
    return Promise.resolve(battleId);
};

const getBattleInvolvingPlayer = (battles = null, playerId = null) => {
    if (!battles || !playerId) {
        return null;
    }
    const battleId = Object.keys(battles).find(key => {
        const battle = battles[key];
        return battle.isCompleted === false || (battle.isCompleted === true && battle.isShowingResults === true) && Object.keys(battle.players).includes(playerId);
    });
    return battleId ? battles[battleId] : null;
};

const joinBattle = async (battleId, playerId, shouldJoin = true) => 
    db.ref(`/battles/${battleId}/joins`).update({
        [`${playerId}`]: shouldJoin
    });

const getOpponentObject = (battle, players, playerId) => {
    const opponentId = Object.keys(battle.players).find(key => key !== playerId);
    return players.find(player => player.id === opponentId);
};

const abortBattle = async ({battleId = null, initiatorId = null, opponent = null}) => {
    if (!battleId || !initiatorId || !opponent) {
        return Promise.reject();
    }

    let opponentRemainingLives = opponent.lives -1;
    let opponentTeam = opponent.team;
    if (opponentRemainingLives === 0 && opponent.team === 'survivor') {
        opponentRemainingLives = gameConfig.lives.convertedZombie;
        opponentTeam = 'zombie';
    }
    if (opponentRemainingLives === 0 && opponent.team === 'zombie') {
        opponentTeam = 'dead';
    }
    
    return dbRef.update({
        [`/battles/${battleId}/isCompleted`]: true,
        [`/battles/${battleId}/winner`]: initiatorId,
        [`/battles/${battleId}/completionTime`]: Date.now(),
        [`/battles/${battleId}/isShowingResults`]: false,
        [`/players/${initiatorId}/isBattling`]: false,
        [`/players/${opponent.id}/isBattling`]: false,
        [`/players/${opponent.id}/lives`]: opponentRemainingLives,
        [`/players/${opponent.id}/team`]: opponentTeam
    });
};

const makeMove = (battleId, playerId, moveId) => db.ref(`battles/${battleId}/moves`).update({
    [playerId]: moveId
});

const endBattleResults = battleId => dbRef.update({
    [`/battles/${battleId}/isShowingResults`]: false
});

export {
    engagePlayerInBattle,
    getBattleInvolvingPlayer,
    joinBattle,
    getOpponentObject,
    abortBattle,
    endBattleResults,
    makeMove
};