const functions = require('firebase-functions');

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

exports.battleWinChecker = functions.database.ref('/battles/{id}/moves').onUpdate(change => {
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
    
    return change.after.ref.parent.child('winner').set(winner);
});