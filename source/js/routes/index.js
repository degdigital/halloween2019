import React from 'react';
import { Route } from 'react-router-dom';

const PrivateRoute = ({
    component: Component,
    ...rest
}) => (
    <Route
        {...rest}
        render={props => (
            <Component {...props} {...rest} />
        )}
    />
);

export { PrivateRoute };
export { default as Login } from '../components/auth/login.js';
export { default as Logout } from '../components/auth/logout.js';
export { default as Register } from '../components/auth/register.js';
export { default as Loading } from '../components/loading.js';
export { default as Error } from '../components/error.js';
export { default as Admin } from '../components/admin.js';
export { default as Home } from '../components/home.js';
export { default as GameLanding } from '../components/gameLanding.js';
export { default as BattleLanding } from '../components/battleLanding.js';