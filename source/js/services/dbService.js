import firebase from '../config/firebase.js';
import { useObjectVal } from 'react-firebase-hooks/database';

const db = firebase.database();

const getDbVal = dbPath => useObjectVal(db.ref(dbPath));

export {
    getDbVal
};