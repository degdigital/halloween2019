import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
    <section>
        <h1>Home</h1>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
    </section>
);

export default Home;