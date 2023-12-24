import { useAppDispatch, useAppSelector } from "../@store/store";
import style from '../@scss/template.module.scss'
import { SetMenuOpen } from "../@store/webSiteState.slice";
import MenuIcon from '@mui/icons-material/Menu';
import { Collapse, Fade } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { TransitionGroup } from 'react-transition-group';
import { Link, NavLink } from "react-router-dom";
import { useEffect } from "react";

type TProps = {
    children: JSX.Element | JSX.Element[],
    title: string
}


const Menu = ({
    children,
    title
}: TProps) => {
    const { menuOpen } = useAppSelector(state => state.webSiteState)
    const dispatch = useAppDispatch()

    useEffect(() => {
        // always load with menu closed, or maybe we shouldnt - todo see how this works with browkser router
        // void dispatch(SetMenuOpen(false))
    }, [dispatch])

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
                <div className={style.title}>{title}</div>
            </div>
            <TransitionGroup>

                {!menuOpen && <Fade style={{
                    position: 'absolute',
                    top: 50,
                    width: 300,
                }}><div>{children}</div>
                </Fade>
                }
                {menuOpen && <Fade style={{
                    position: 'absolute',
                    top: 50,
                    width: 300,
                }}>
                    <div className={style.menu}>
                        <NavLink className={({ isActive }) => style.menuItem + ' ' + (isActive ? style.active : '')} to="/">Home</NavLink>
                        <NavLink className={({ isActive }) => style.menuItem + ' ' + (isActive ? style.active : '')} to="/BedheadAttractor">Bedhead Attractor</NavLink>
                        <NavLink className={({ isActive }) => style.menuItem + ' ' + (isActive ? style.active : '')} to="/test">Test</NavLink>

                    </div>
                </Fade >}
            </TransitionGroup>

        </>
    )

}

export default Menu;