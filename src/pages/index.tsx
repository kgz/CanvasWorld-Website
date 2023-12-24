import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import { useAppDispatch } from '../@store/store';

function Index() {


    return (
        <div className="App">
            <Link to="/">Home</Link><br />
            <Link to="/BedheadAttractor">Bedhead Attractor</Link><br />
            <Link to="/b">B</Link>
        </div>
    );
}

export default Index;
