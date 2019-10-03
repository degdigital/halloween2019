import firebase from '../config/firebase.js';

const db = firebase.database();
const dbRef = db.ref();

const engagePlayerInBattle = async (opponentId, playerId, isEngaging = true) => {
    const battleId = dbRef.child('battles').push().key;
    await dbRef.update({
        [`players/${opponentId}/isBattling`]: isEngaging,
        [`players/${playerId}/isBattling`]: isEngaging,
        [`battleInvites/${opponentId}`]: true,
        [`battles/${battleId}`]: {
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
            isPending: true,
            isCompleted: false
        }
    });
    return Promise.resolve(battleId);
};

const makeMove = (battleId, playerId, moveId) => db.ref(`battles/${battleId}/moves`).update({
    [playerId]: moveId
});

export {
    engagePlayerInBattle,
    makeMove
};