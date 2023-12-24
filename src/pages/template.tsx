import { Link, Route, Routes } from "react-router-dom";
import style from "../@scss/template.module.scss";
import Index from ".";
import BedheadAttractor from "./bedhead_attractor";
import { useAppDispatch, useAppSelector } from "../@store/store";
import { Drawer } from "@mui/material";
import { SetMenuOpen } from "../@store/webSiteState.slice";
import Test from "./test1";
import routes from "../@types/routes";
import DatGui, { DatNumber } from "react-dat-gui";
import Menu from "../modules/Menu";
import { useState } from "react";
import { genPath } from "../modules/genPath";

const Template = () => {

    const { menuOpen } = useAppSelector(state => state.webSiteState)
    const dispatch = useAppDispatch()
    const [bodyJSX, setBodyJSX] = useState<JSX.Element | JSX.Element[]>(<></>)
    return (
        <div className={style.container}>
            <Routes>
                {/* <Route path="/BedheadAttractor" element={<BedheadAttractor />} />
                <Route path="/Test" element={<Test />} /> */}
                {routes.map((route, index) => {
                    return (

                        <Route key={index} path={genPath(route.name)} element={
                            <> <div className={style.body}>
                                <Menu title={"Bedhead Attractor"}>
                                    {bodyJSX}
                                </Menu>

                            </div>
                                <route.element setBodyJSX={setBodyJSX} />

                            </>
                        } />
                    )
                })}
                {/* fallback */}
                <Route path="*" element={<Index />} />
            </Routes>
            {/* <Drawer
                anchor="left"
                open={menuOpen}
                onClose={() => {
                    void dispatch(SetMenuOpen(false))
                }}
            >
                <div className={style.menu}>
                    <Link to="/">Home</Link><br />
                    <Link to="/BedheadAttractor">Bedhead Attractor</Link><br />
                </div>
            </Drawer> */}
        </div>
    );
}

export default Template;