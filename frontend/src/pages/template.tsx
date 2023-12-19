import { Route, Routes } from "react-router-dom";
import style from "../@scss/template.module.scss";
import A from "./bedhead_attractor";
import B from "./b";
import Index from ".";
import BedheadAttractor from "./bedhead_attractor";

const Template = () => {
    return (
        <div className={style.container}>
            <div className={style.left}>
                <div className={style.header}>
                    <Index />

                </div>


            </div>
            <Routes>
                <Route path="/chaos/BedheadAttractor" element={<BedheadAttractor />} />
                <Route path="/b" element={<B />} />
            </Routes>
        </div>
    );
}

export default Template;