import firebase from '../config/firebase.js';

const db = firebase.database();

const joinGame = playerId => db.ref(`players/${playerId}/isPlaying`).set(true);

export {
    joinGame
};