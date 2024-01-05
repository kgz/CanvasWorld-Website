import { useAppDispatch, useAppSelector } from "../@store/store";
import style from '../@scss/template.module.scss'
import { SetDrawerOpen, SetMenuOpen } from "../@store/webSiteState.slice";
import MenuIcon from '@mui/icons-material/Menu';
import { Collapse, Drawer, Fade, Input } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { TransitionGroup } from 'react-transition-group';
import { Link, NavLink } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import routes from "../@types/routes";
import { genPath } from "./genPath";
import OutsideAlerter from "../@types/onClickOutside";
import SearchIcon from '@mui/icons-material/Search';
import LastPage from '@mui/icons-material/LastPage';
import FirstPage from '@mui/icons-material/FirstPage';

type TProps = {
    children: JSX.Element | JSX.Element[],
    title: string
}


const Menu = ({
    children,
    title
}: TProps) => {
    const { menuOpen, drawerOpen } = useAppSelector(state => state.webSiteState)
    const dispatch = useAppDispatch()
    const [search, setSearch] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    useEffect(() => {
        // always load with menu closed, or maybe we shouldnt - todo see how this works with browkser router
        void dispatch(SetMenuOpen(false))
    }, [dispatch])

    const filteredSearch = useMemo(() => {
        return routes.filter(route => route.name.toLowerCase().includes(search.toLowerCase()))
    }, [search])

    // watch window resize and if  @media screen and (max-width: 768px)  then close menu, otherwise should always be open
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [dispatch])

    return (
        <>
            <div className={style.drawerOpenButton} onClick={() => void dispatch(SetDrawerOpen(true))}>
                <LastPage />
            </div>
            <Drawer

                // className={style.body}
                open={drawerOpen || windowWidth > 768}
                onClose={() => void dispatch(SetDrawerOpen(false))}
                PaperProps={
                    {
                        style: {
                            backgroundColor: '#222',
                            color: '#fff',
                            width: 300,
                            overflowX: 'hidden'
                        },
                        className: style.body,
                    }
                }
                hideBackdrop={windowWidth > 768}
                sx={{
                    width: 300,
                }}


            >
                <div className={style.header}>
                    <div className={style.manuBar} >
                        {(windowWidth <= 768) && (
                            <div style={{
                                margin: '0 auto',
                                // marginLeft: 'auto'
                                position: 'absolute',


                            }} onClick={() => void dispatch(SetDrawerOpen(false))}>
                                <Fade in={true}>
                                    <FirstPage style={{
                                        position: 'absolute',
                                        left: 4,
                                        top: -10

                                    }} />
                                </Fade>
                            </div>
                        )}
                        <TransitionGroup
                            style={{
                                margin: '0 auto',
                                // marginLeft: 'auto'
                                position: 'absolute',
                                // top: -10
                            }}
                            onClick={() => {
                                void dispatch(SetMenuOpen(!menuOpen))
                            }}
                        >
                            {!menuOpen && <Fade>
                                <MenuIcon style={{
                                    position: 'absolute',
                                    left: windowWidth <= 768 ? 40 : 10,
                                    top: -10

                                }} />
                            </Fade>}
                            {menuOpen &&
                                <Fade>
                                    <CloseIcon style={{
                                        position: 'absolute',
                                        left: windowWidth <= 768 ? 40 : 10,
                                        top: -10

                                    }} />
                                </Fade>
                            }
                        </TransitionGroup>
                    </div>
                    <div className={style.title}>{title}</div>
                </div>
                <TransitionGroup style={{

                    // overflow: 'hidden'
                }}>

                    {!menuOpen && <Fade style={{
                        // position: 'absolute',
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
            </Drawer>
        </>
    )

}

export default Menu;