import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { logout as logoutFn } from '../../services/authService.js';

const logout = () => {
    logoutFn();
    return (
        <Route render={() => (
            <Redirect to="/" />
        )} />
    );
};

export default logout;