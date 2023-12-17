import { notification } from "antd";
import { createContext, useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cookies from "universal-cookie";

import type { TUser } from "./@types/TUser";
import Index from "./pages/index/index";
import Login from "./pages/login/login";
import Migrations from "./pages/migrations";
import Profile from "./pages/profile/profile";
import Container from "./template/container";
import { Provider } from "react-redux";
import store, { useAppDispatch, useAppSelector } from "./@store/store";
import axios from "axios";
import { setLoggedIn, setUserData } from "./@store/user.slice";

// create conetex for types const [isLoggedin, setIsLoggedin] = useState(false);

const App = () => {
    const cookies = useMemo(() => {
        return new Cookies();
    }, []);

    // const [isLoggedin, setIsLoggedin] = useState(cookies.get('token') !== undefined);
    const [api, contextHolder] = notification.useNotification();

    const dispatch = useAppDispatch();

    const {
        loggedIn
    } = useAppSelector(state => state.UserSlice.data);
    const [cachedLoggedIn, setCachedLoggedIn] = useState(loggedIn);


    useEffect(() => {
        console.log('ini', cookies.get('token'));
        if (!cookies.get('token')) {
            return;
        }
        axios.get<TUser['data']>('/api/me',
            {
                headers: {
                    Authorization: `Bearer ${cookies.get('token')}`
                }
            }).then(response => {
                if (response.status !== 200) {
                    void dispatch(setLoggedIn(false));
                } else {
                    console.log(response.data);
                    void dispatch(setUserData(response.data));
                    void dispatch(setLoggedIn(true));
                }
            }).catch(error => {
                console.log(error);
            });
    }, [cookies, dispatch]);

    useEffect(() => {
        // if hasnt changed 
        if (cachedLoggedIn === loggedIn) {
            return;
        }

        setTimeout(() => {
            // if has changed
            setCachedLoggedIn(loggedIn);
            // show antd toast
            if (loggedIn) {
                toast.success('Logged in');
            } else {
                toast('You have been logged out.');
            }
        }, 500);
    }, [cachedLoggedIn, loggedIn]);


    return (
        <><Toaster
            position="bottom-left"
            reverseOrder={false}
        />
            <BrowserRouter>
                <Container>
                    {!loggedIn && <Login />}
                    {loggedIn && <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Index />} />
                        <Route path="/migrations" element={<Migrations />} />
                        <Route path="/profile/*" element={<Profile />} >
                            <Route path="*" element={<Profile />} />
                        </Route>

                        {/* 404 */}
                        <Route path="*" element={<h1>404</h1>} />
                    </Routes>
                    }
                </Container>

            </BrowserRouter>
        </>
    )
}

export default App;