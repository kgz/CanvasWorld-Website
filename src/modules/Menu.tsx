import { useAppDispatch, useAppSelector } from "../@store/store";
import style from '../@scss/template.module.scss'
import { SetMenuOpen } from "../@store/webSiteState.slice";
import MenuIcon from '@mui/icons-material/Menu';
import { Collapse, Fade, Input } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { TransitionGroup } from 'react-transition-group';
import { Link, NavLink } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import routes from "../@types/routes";
import { genPath } from "./genPath";
import OutsideAlerter from "../@types/onClickOutside";
import SearchIcon from '@mui/icons-material/Search';
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
    const [search, setSearch] = useState('');

    useEffect(() => {
        // always load with menu closed, or maybe we shouldnt - todo see how this works with browkser router
        void dispatch(SetMenuOpen(false))
    }, [dispatch])

    const filteredSearch = useMemo(() => {
        return routes.filter(route => route.name.toLowerCase().includes(search.toLowerCase()))
    }, [search])

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
                    <div>
                        <div className={style.menu}>
                            <NavLink className={({ isActive }) => style.menuItem + ' ' + (isActive ? style.active : '')} to="/">Home</NavLink>
                            <div className={style.divider}></div>
                            <Input
                                startAdornment={<SearchIcon />}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search"
                                style={{
                                    color: '#fff',
                                }}
                                sx={
                                    // change the divider color
                                    {
                                        '.MuiInput-underline:before': {
                                            borderBottomColor: '#fff !important',
                                            borderBottom: '1px solid #fff !important',
                                        },
                                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                            borderBottomColor: '#fff',
                                        },
                                        '& .MuiInput-underline:after': {
                                            borderBottomColor: '#fff',
                                        },
                                    }
                                }

                            />
                            {filteredSearch.map((route, index) => {
                                return (
                                    <NavLink key={index} className={({ isActive }) => style.menuItem + ' ' + (isActive ? style.active : '')} to={genPath(route.name)}>{route.name}</NavLink>
                                )
                            })
                            }
                        </div>
                    </div>
                </Fade >}
            </TransitionGroup>
        </>

    )

}

export default Menu;