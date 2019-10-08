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
        [`battleInvites/${opponentId}`]: battleId,
        [`battleInvites/${playerId}`]: battleId,
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
            isCompleted: false
        }
    });
    return Promise.resolve(battleId);
};

const getBattleInvolvingPlayer = (battles = null, battleInvites = null, playerId = null) => {
    if (!battles || !battleInvites || !playerId) {
        return null;
    }
    return battles[battleInvites[playerId]] || null;
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
    
    return dbRef.update({
        [`/battleInvites/${initiatorId}`]: null,
        [`/battleInvites/${opponent.id}`]: null,
        [`/battles/${battleId}/isCompleted`]: true,
        [`/battles/${battleId}/winner`]: initiatorId,
        [`/battles/${battleId}/completionTime`]: Date.now(),
        [`/players/${initiatorId}/isBattling`]: false,
        [`/players/${opponent.id}/isBattling`]: false,
        [`/players/${opponent.id}/lives`]: opponentRemainingLives,
        [`/players/${opponent.id}/team`]: opponentTeam
    });
};

const makeMove = (battleId, playerId, moveId) => db.ref(`battles/${battleId}/moves`).update({
    [playerId]: moveId
});

export {
    engagePlayerInBattle,
    getBattleInvolvingPlayer,
    joinBattle,
    getOpponentObject,
    abortBattle,
    makeMove
};