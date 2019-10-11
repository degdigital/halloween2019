import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import { getUser, getPlayers, getPlayer, getBattleInvolvingPlayer, getDbVal } from '../services';
import { PrivateRoute, Login, Logout, Register, Loading, Error, Admin, Home, GameLanding, BattleLanding } from '../routes';

const App = () => {

    const [user, userLoading, userError] = getUser();
    const [players, playersLoading, playersError] = getPlayers();
    const [gameIsActive, gameIsActiveLoading, gameIsActiveError] = getDbVal('gameIsActive');
    const [battles, battlesLoading, battlesError] = getDbVal('battles');
    const [
        gameIsAwaitingPlayers, 
        gameIsAwaitingPlayersLoading, 
        gameIsAwaitingPlayersError
    ] = getDbVal('gameIsAwaitingPlayers');

    if (userLoading || playersLoading || gameIsActiveLoading || gameIsAwaitingPlayersLoading || battlesLoading) {
        return (
            <Loading />
        );
    }
    if (userError || playersError || gameIsActiveError || gameIsAwaitingPlayersError || battlesError) {
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
    if (user && players) {
        const propsToPushToAll = {
            player: getPlayer(players, user.uid),
            players,
            battle: getBattleInvolvingPlayer(battles, user.uid),
            gameIsAwaitingPlayers
        };
        console.log(propsToPushToAll);
        return (
            <Router>
                <Link to="/logout">Logout</Link>
                <PrivateRoute 
                    exact 
                    path="/" 
                    component={GameLanding} 
                    {...propsToPushToAll}
                />
                <PrivateRoute 
                    path="/battle" 
                    component={BattleLanding}
                    {...propsToPushToAll} 
                />
                <PrivateRoute 
                    path="/logout" 
                    component={Logout} 
                    user={user}
                />
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