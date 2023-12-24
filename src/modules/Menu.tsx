import { useAppDispatch, useAppSelector } from "../@store/store";
import style from '../@scss/template.module.scss'
import { SetMenuOpen } from "../@store/webSiteState.slice";
import MenuIcon from '@mui/icons-material/Menu';
import { Collapse, Fade } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { TransitionGroup } from 'react-transition-group';
import { Link, NavLink } from "react-router-dom";

type TProps = {
    children: JSX.Element | JSX.Element[]
}


const Menu = ({
    children
}: TProps) => {
    const { menuOpen } = useAppSelector(state => state.webSiteState)
    const dispatch = useAppDispatch()

    return (
        <>
            <div className={style.header}>
                <div className={style.menu} onClick={() => {
                    void dispatch(SetMenuOpen(!menuOpen))
                }}>
                    <TransitionGroup>
                        {!menuOpen && <Fade style={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                        }}>
                            <MenuIcon />
                        </Fade>}
                        {menuOpen &&
                            <Fade style={{
                                position: 'absolute',
                                top: 10,
                                left: 10,
                            }}>
                                <CloseIcon />
                            </Fade>
                        }
                    </TransitionGroup>
                </div>
                <div className={style.title}>Bedhead Attractor</div>
            </div>
            <Collapse in={!menuOpen} collapsedSize={0}><div>{children}</div></Collapse>
            <Fade in={menuOpen} >
                <div className={style.menu}>
                    <NavLink className={({ isActive }) => style.menuItem + ' ' + (isActive ? style.active : '')} to="/">Home</NavLink>
                    <NavLink className={({ isActive }) => style.menuItem + ' ' + (isActive ? style.active : '')} to="/BedheadAttractor">Bedhead Attractor</NavLink>

                </div>
            </Fade >
        </>
    )

}

export default Menu;