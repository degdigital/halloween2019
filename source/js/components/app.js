import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useObjectVal } from 'react-firebase-hooks/database';
import firebase from '../config/firebase.js';
import PrivateRoute from '../utils/privateRoute.js';
import Login from './auth/login.js';
import Logout from './auth/logout.js';
import Register from './auth/register.js';
import Admin from './admin.js';
import Home from './home.js';
import PlayerMap from './playerMap.js';
import Battle from './battle.js';
import Loading from './auth/loading.js';
import Error from './auth/error.js';

const App = () => {

    const [user, initialising, error] = useAuthState(firebase.auth());
    const [gameIsActive, loading] = useObjectVal(firebase.database().ref(`gameIsActive`));

    if (initialising || loading) {
        return (
            <Loading />
        );
    }
    if (error) {
        return (
            <Error />
        );
    }
    if (user && user.uid === 'uaOVgPAcauhhWSR7WlJkZwBDh7f2') {
        return (
            <Router>
                <Link to="/logout">Logout</Link>
                <PrivateRoute exact path="/" component={Admin} user={user} />
                <PrivateRoute path="/logout" component={Logout} user={user} />
            </Router>
        );
    }
    if (gameIsActive === false) {
        return (
            <p>No game active at this time. Check back soon.</p>
        );
    }
    if (user) {
        return (
            <Router>
                <Link to="/logout">Logout</Link>
                <PrivateRoute 
                    exact 
                    path="/" 
                    component={PlayerMap} 
                    user={user}
                />
                <PrivateRoute path="/battle" component={Battle} user={user} />
                <PrivateRoute path="/logout" component={Logout} user={user} />
            </Router>
        );
    }
    return (
        <Router>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
        </Router>
    );
};

export default App;