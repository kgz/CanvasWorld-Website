import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import { useAppDispatch } from '../@store/store';
import routes from '../@types/routes';
import { genPath } from '../modules/genPath';

function Index() {


    return (
        <div className="App">
            <Link to="/">Home</Link><br />
            {routes.map((route, index) => {
                return (
                    <Link key={index} to={genPath(route.name)}>{route.name}</Link>
                )
            })}
        </div>
    );
}

export default Index;
