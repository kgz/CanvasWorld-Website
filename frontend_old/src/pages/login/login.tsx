import { useContext, useState } from 'react';
import styles from './login.module.scss'
import { Navigate } from 'react-router';
import Google from './google';
import Loader from '../../template/loading';
import fetch_api from '../../fetch/fetch';
import Cookies from 'universal-cookie';
import logo from '../../template/header/logo.png';
import { useAppDispatch, useAppSelector } from '../../@store/store';
import { setLoggedIn } from '../../@store/user.slice';

const Login = () => {
    const cookies = new Cookies();


    const { loggedIn } = useAppSelector(state => state.UserSlice.data);
    const [active_sign, setActive_sign] = useState(true);

    const [loading, setLoading] = useState(false);

    const [username, setUsername] = useState('sa1@localhost');
    const [password, setPassword] = useState('password');

    const [error, setError] = useState<boolean|string>(false);

    const dispatch = useAppDispatch();

    const login_post = () => {
        setLoading(true);
        console.log(username)

        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: username,
                password: password
            })
        })
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                } else if (res.status === 401) {
                    throw new Error('Invalid credentials');
                }
                throw new Error(res.statusText);
            }
            )
            .then(data => {
                console.log({data});
                if (data.token) {
                    cookies.set('token', data.token, { path: '/', maxAge: 3600 });
                    void dispatch(setLoggedIn(true));
                }
            }
            )
            .catch(err => {
                console.log(err);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                setTimeout(() => {
                    setError((err.message as string | undefined) || 'An unknown error occured');
                    setLoading(false);
                }, 1500);
            }
            )
    }

    return (
        (
            loggedIn && <Navigate to="/" />) ||
        <div className={styles.login}>
            <div className={styles.login_card}>

                <img src={"/static/media/logo.png"} alt="logo" width="250" style={{
                    marginLeft: '50%',
                    transform: 'translateX(-50%)',

                }} />

                <div className={styles.login_sign_switch}>
                    <div className={styles.login_sign_switch_signin + ' ' + (active_sign ? styles.active : '')} onClick={() => setActive_sign(true)}>SIGN IN</div>
                    <div className={styles.login_sign_switch_signup + ' ' + (!active_sign ? styles.active : '')} onClick={() => setActive_sign(false)}>SIGN UP</div>
                    <div className={styles.login_sign_line + ' ' + (!active_sign ? styles.active : '')} />
                </div>

                {loading && <Loader /> ||
                    <div className={styles.login_sign + ' ' + (!active_sign ? styles.active : '')} >
                        <div className={styles.login_sign_signin}>
                            <form>
                                <input type="text" placeholder='email / username' onChange={(e) => setUsername(e.target.value)} defaultValue={username} autoFocus={true} />
                                <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} defaultValue={password} />
                                <br />
                                <button type="submit" onClick={() => {login_post()}} className={styles.login__signInButton}>Sign In</button>

                                {/* <button className={styles.google_sign_in}></button> */}
                                {/* forgot */}
                                <div className={styles.login_sign_forgot}>
                                    <a href="#">Forgot your password?</a>
                                </div>
                            </form>
                            {error && <div className={styles.login_sign_error}>{error}</div>}

                        </div>
                        <div className={styles.login_sign_signup}>
                            <form>
                                <div>
                                    <input type="text" />
                                    <h5>E-mail</h5>
                                    <input type="text" />
                                    <h5>Password</h5>
                                    <input type="password" />
                                </div>
                                <div>

                                    <button type="submit" onClick={() => setLoading(true)} className={styles.login__signInButton}>Sign Up</button>
                                </div>
                            </form>

                        </div>

                    </div>}



                {/* <h1>Login</h1>
                <form>
                    <h5>E-mail</h5>
                    <input type="text" />
                    <h5>Password</h5>
                    <input type="password" />
                    <button type="submit" onClick={() => setIsLoggedin(true)} className={styles.login__signInButton}>Sign In</button>
                </form>
                <p>
                    By signing-in you agree to the AMAZON FAKE CLONE Conditions of Use & Sale. Please see our Privacy Notice, our Cookies Notice and our Interest-Based Ads Notice.
                </p>
                <button className={styles.login__registerButton}>Create your Amazon Account</button>

            */}
            </div>


        </div>
    )

}

export default Login