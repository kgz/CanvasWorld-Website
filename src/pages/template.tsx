import { Link, Route, Routes } from "react-router-dom";
import style from "../@scss/template.module.scss";
import Index from ".";
import BedheadAttractor from "./bedhead_attractor";
import { useAppDispatch, useAppSelector } from "../@store/store";
import { Drawer } from "@mui/material";
import { SetMenuOpen } from "../@store/webSiteState.slice";

const Template = () => {

    const { menuOpen } = useAppSelector(state => state.webSiteState)
    const dispatch = useAppDispatch()

    return (
        <div className={style.container}>
            <Routes>
                <Route path="/BedheadAttractor" element={<BedheadAttractor />} />
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