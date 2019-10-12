import firebase from '../config/firebase.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useObject } from 'react-firebase-hooks/database';
import { processHookVals } from '../utils/dataUtils.js';

const getUser = () => useAuthState(firebase.auth());

const getPlayers = () => processHookVals(useObject(firebase.database().ref('players').orderByChild('isPlaying').equalTo(true)));

const getPlayer = (players, userId) => ({
    id: userId,
    ...players.find(({id}) => id === userId)
});

export {
    getUser,
    getPlayers,
    getPlayer
}