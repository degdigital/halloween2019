import firebase from '../config/firebase.js';

const auth = firebase.auth();
const db = firebase.database();

const register = ({ firstName, lastName, email, password }) => 
    auth.createUserWithEmailAndPassword(email, password)
        .then(({user}) => db.ref(`players/${user.uid}`).set({
            displayName: `${firstName} ${lastName}`,
            isPlaying: false,
            isBattling: false
        }));

const login = (username, password) => auth.signInWithEmailAndPassword(username, password);

const logout = () => auth.signOut();

export {
    register,
    login,
    logout
};