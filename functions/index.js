const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
const db = admin.database();

const getWinner = (val1, val2, player1, player2) => {
    if (val1 == val2) {
        return 'tie';
    }
    if (val1 === 'rock') {
        return val2 === 'scissors' ? player1 : player2;
    }
    if (val1 === 'paper') {
        return val2 === 'rock' ? player1 : player2;
    }
    if (val1 === 'scissors') {
        return val2 === 'rock' ? player2 : player1;
    }
};

const getUpdatedLivesAndTeam = (players, playerId, winner) => {
    const {
        lives,
        team
    } = players[playerId];
    if (playerId === winner || winner === 'tie') {
        return {
            lives,
            team
        };
    }
    const newLifeCount = lives - 1;
    if (newLifeCount >= 1) {
        return {
            lives: newLifeCount,
            team: team
        };
    }
    return {
        lives: team === 'survivor' ? 2 : 0,
        team: team === 'survivor' ? 'zombie' : 'dead'
    }
};

exports.battleWinChecker = functions.database.ref('/battles/{id}/moves').onUpdate(async change => {
    if (!change || (!change.before || !change.after)) {
        return null;
    }
    const afterVals = change.after.val();
    const valArr = Object.values(afterVals);

    if (valArr.length !== 2 || valArr.some(val => val === false)) {
        return null;
    }

    const playerArr = Object.keys(afterVals);
    const player1 = playerArr[0];
    const player2 = playerArr[1];
    const val1 = valArr[0];
    const val2 = valArr[1];

    const winner = getWinner(val1, val2, player1, player2);
    const battleId = change.after.ref.parent.key;
    const players = await db.ref(`/players`).once('value').then(snap => snap.val());
    const player1LivesAndTeam = getUpdatedLivesAndTeam(players, player1, winner);
    const player2LivesAndTeam = getUpdatedLivesAndTeam(players, player2, winner);

    return db.ref().update({
        [`/battles/${battleId}/isCompleted`]: true,
        [`/battles/${battleId}/completionTime`]: Date.now(),
        [`/battles/${battleId}/winner`]: winner,
        [`/battles/${battleId}/isShowingResults`]: true,
        [`/players/${player1}/isBattling`]: false,
        [`/players/${player2}/isBattling`]: false,
        [`/players/${player1}/lives`]: player1LivesAndTeam.lives,
        [`/players/${player1}/team`]: player1LivesAndTeam.team,
        [`/players/${player2}/lives`]: player2LivesAndTeam.lives,
        [`/players/${player2}/team`]: player2LivesAndTeam.team
    });
});

exports.scheduledBattleCleanup = functions.pubsub.schedule('every 2 minutes').onRun(async(context) => {
    const twoMinutesAgo = Date.now() - 120000;
    const oldBattles = await db.ref('battles').orderByChild('battleInitiationTime').endAt(twoMinutesAgo).once('value').then(snapshot => snapshot.val());
    if (oldBattles) {
        const battleIds = Object.keys(oldBattles);
        let updates = {};
        battleIds.forEach(battleId => {
            if (oldBattles[battleId].isCompleted === false) {
                const playerIds = Object.keys(oldBattles[battleId].players);
                playerIds.forEach(playerId => {
                    updates[`/players/${playerId}/isBattling`] = false;
                });
                updates[`/battles/${battleId}/isCompleted`] = true;
                updates[`/battles/${battleId}/isShowingResults`] = false;
                updates[`/battles/${battleId}/winner`] = 'tie';
            }
        });
        
        await db.ref().update(updates);
    }
    return null;
});