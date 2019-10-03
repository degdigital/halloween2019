import firebase from '../config/firebase.js';

const db = firebase.database();
const dbRef = db.ref();

const joinGame = playerId => db.ref(`players/${playerId}/isPlaying`).set(true);

 export {
     joinGame
 };