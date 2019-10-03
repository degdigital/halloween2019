import React, { useState } from 'react';
import { login } from '../../services/authService.js';

const Login = ({history}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const onFormSubmit = e => {
        e.preventDefault();
        login(email, password)
            .then(() => history.push('/'))
            .catch(error => setErrorMessage(error.message));
    };
    
    return (
        <form onSubmit={onFormSubmit}>
            {errorMessage}
            <div className="field">
                <label htmlFor="email">Email Address</label>
                <input 
                    id="email" 
                    type="email" 
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    required={true}
                />
            </div>
            <div className="field">
                <label htmlFor="password">Password</label>
                <input 
                    id="password" 
                    type="password" 
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    required={true}
                />
            </div>
            <button type="submit">Login</button>
        </form>
    );

};

export default Login;