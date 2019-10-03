import * as firebase from 'firebase';

const config = {
    apiKey: 'AIzaSyBvCwLSWTUuQcLS0heQxdE1ye85NcgdMxg',
    authDomain: 'deghalloween2019.firebaseapp.com',
    databaseURL: 'https://deghalloween2019.firebaseio.com',
    projectId: 'deghalloween2019',
    storageBucket: 'deghalloween2019.appspot.com',
    messagingSenderId: '652720868200',
    appId: '1:652720868200:web:bf2d3c6f70404b5b'
};

export default firebase.initializeApp(config);