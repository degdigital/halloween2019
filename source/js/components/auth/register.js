import React, {useState} from 'react';
import { register } from '../../services/authService.js';

const Register = ({history}) => {

    const [inputs, setInputs] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = e => {
        const target = e.target;
        e.persist();
        setInputs(inputs => ({...inputs, [target.name]: target.value}));
    };

    const handleSubmit = e => {
        e.preventDefault();
        register(inputs)
            .then(() => history.push('/'))
            .catch(error => setErrorMessage(error.message));
    };

    return (
        <form onSubmit={handleSubmit}>
            {errorMessage}
            <div className="field">
                <label htmlFor="firstName">First Name</label>
                <input 
                    id="firstName" 
                    name="firstName"
                    type="text" 
                    onChange={handleInputChange}
                    value={inputs.firstName}
                    required={true}
                />
            </div>
            <div className="field">
                <label htmlFor="lastName">Last Name</label>
                <input 
                    id="lastName"
                    name="lastName"
                    type="text" 
                    onChange={handleInputChange}
                    value={inputs.lastName}
                    required={true}
                />
            </div>
            <div className="field">
                <label htmlFor="email">Email</label>
                <input 
                    id="email" 
                    name="email"
                    type="email" 
                    onChange={handleInputChange}
                    value={inputs.email}
                    required={true}
                />
            </div>
            <div className="field">
                <label htmlFor="password">Password</label>
                <input 
                    id="password" 
                    name="password"
                    type="password" 
                    onChange={handleInputChange}
                    value={inputs.password}
                    required={true}
                />
            </div>
            <button type="submit">Sign Up</button>
        </form>
    )

};

export default Register;