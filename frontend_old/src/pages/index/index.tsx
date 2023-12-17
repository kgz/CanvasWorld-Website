import React from 'react';
import { NavLink } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { useAppDispatch } from '../../@store/store';
import { setLoggedIn } from '../../@store/user.slice';


function Index() {
  const cookies = new Cookies();

const dispatch = useAppDispatch();

  return (
    <div className="App">
      Home 

      <NavLink to="/migrations">Migrations</NavLink><br />
      <NavLink to="/login">Login</NavLink>
      <button onClick={() => {
        cookies.remove('token');
        void dispatch(setLoggedIn(false));
        (new Cookies()).set('token', '', { path: '/', maxAge: 0 });
        console.log(cookies.get('token'));
      }}>Logout</button>
    </div>
  );
}

export default Index;
