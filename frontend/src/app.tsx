import { notification } from "antd";
import { createContext, useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import type { TUser } from "./@types/TUser";
import Index from "./pages/index";
import { Provider } from "react-redux";
import store, { useAppDispatch, useAppSelector } from "./@store/store";
import axios from "axios";
import { setLoggedIn, setUserData } from "./@store/user.slice";
import A from "./pages/bedhead_attractor";
import B from "./pages/b";
import Template from "./pages/template";

// create conetex for types const [isLoggedin, setIsLoggedin] = useState(false);

const App = () => {
    return (
        <><Toaster
            position="bottom-left"
            reverseOrder={false}
        />
            <BrowserRouter>
                {/* <Index /> */}
                <Template />

            </BrowserRouter>
        </>
    )
}

export default App;