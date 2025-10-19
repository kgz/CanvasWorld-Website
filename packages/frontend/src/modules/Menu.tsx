import { useAppDispatch, useAppSelector } from '../@store/store'
import style from '../@scss/template.module.scss'
import { SetDrawerOpen, SetMenuOpen, setData } from '../@store/WebSlice'
import MenuIcon from '@mui/icons-material/Menu'
import { Drawer, Fade, Input } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { TransitionGroup } from 'react-transition-group'
import { NavLink } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import routes from '../@types/routes'
import { genPath } from './genPath'
import OutsideAlerter from '../@types/onClickOutside'
import SearchIcon from '@mui/icons-material/Search'
import LastPage from '@mui/icons-material/LastPage'
import FirstPage from '@mui/icons-material/FirstPage'
import DatGui, { DatButton, DatFolder, DatNumber } from 'react-dat-gui'
import GitHubIcon from '@mui/icons-material/GitHub'
import HomeIcon from '@mui/icons-material/Home'

type TProps = {
	title: string
}

const Menu = ({ title }: TProps) => {
	const { menuOpen, drawerOpen, datData, data } = useAppSelector(state => state.WebSlice)
	const dispatch = useAppDispatch()
	const [search, setSearch] = useState('')
	const [windowWidth, setWindowWidth] = useState(window.innerWidth)
	const { description } = useAppSelector(s => s.WebSlice)

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
				PaperProps={{
					style: {
						backgroundColor: '#222',
						color: '#fff',
						width: 300,
						overflowX: 'hidden',
					},
					className: style.body,
				}}
				hideBackdrop={windowWidth > 768}
				sx={{
					width: 300,
				}}
			>
				<div className={style.header}>
					<div className={style.manuBar}>
						{windowWidth <= 768 && (
							<div
								style={{
									margin: '0 auto',
									// marginLeft: 'auto'
									position: 'absolute',
								}}
								onClick={() => void dispatch(SetDrawerOpen(false))}
							>
								<Fade in={true}>
									<FirstPage
										style={{
											position: 'absolute',
											left: 4,
											top: -10,
										}}
									/>
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
							{!menuOpen && (
								<Fade>
									<MenuIcon
										style={{
											position: 'absolute',
											left: windowWidth <= 768 ? 40 : 10,
											top: -10,
										}}
									/>
								</Fade>
							)}
							{menuOpen && (
								<Fade>
									<CloseIcon
										style={{
											position: 'absolute',
											left: windowWidth <= 768 ? 40 : 10,
											top: -10,
										}}
									/>
								</Fade>
							)}
						</TransitionGroup>
					</div>
					<div className={style.title}>{title}</div>
				</div>
				<TransitionGroup
					style={
						{
							// overflow: 'hidden'
						}
					}
				>
					{!menuOpen && (
						<Fade
							style={{
								top: 50,
								width: 300,
							}}
						>
							<span>
								<DatGui
									data={data}
									onUpdate={(_data: typeof data) => {
										void dispatch(setData(_data))
									}}
								>
									{Object.entries(datData.options).map(([key, value]) => {
										return (
											<DatNumber
												key={key}
												path={key}
												label={key}
												min={value.min}
												max={value.max}
												step={value.step ?? 0.0001}
											/>
										)
									})}
									<DatButton
										label="Reset"
										onClick={() => {
											void dispatch(
												setData(
													Object.fromEntries(
														Object.entries(datData.options).map(([key, value]) => [key, value.initialValue]),
													),
												),
											)
										}}
									/>
									<DatFolder closed={true} title="Examples">
										{datData.examples.map((example, i) => {
											return (
												<DatButton
													key={i}
													label={`Example ${i}`}
													onClick={() => {
														void dispatch(setData({ ...data, ...example }))
													}}
												/>
											)
										})}
									</DatFolder>
								</DatGui>
								<div className={style.card}>
									<div className={style.desc}>
										{typeof description === 'string' 
											? description.split('\n').map((line, index) => {
												// Check if line contains LaTeX math (starts with x_ or y_)
												if (line.match(/^[xy]_{/)) {
													return (
														<div key={index} style={{ margin: '10px 0', fontFamily: 'monospace' }}>
															{line}
														</div>
													)
												}
												return (
													<div key={index} style={{ margin: '5px 0' }}>
														{line}
													</div>
												)
											})
											: <div>Loading description...</div>
										}
									</div>
								</div>
							</span>
						</Fade>
					)}
					{menuOpen && (
						<Fade
							style={{
								position: 'absolute',
								top: 50,
								width: 300,
							}}
						>
							<div>
								<OutsideAlerter callback={() => void dispatch(SetMenuOpen(false))}>
									<div className={style.menu}>
										<div style={{ marginTop: 15 }} className={style.divider}></div>

										<NavLink
											className={({ isActive }) => style.menuItem + ' ' + (isActive ? style.active : '')}
											to="/"
											style={{
												display: 'flex',
												alignItems: 'center',
											}}
										>
											<HomeIcon
												style={{
													marginLeft: 10,
												}}
												fontSize="small"
											/>{' '}
											<span style={{ marginLeft: -5 }}>Home</span>
										</NavLink>
										<NavLink
											className={({ isActive }) => style.menuItem + ' ' + (isActive ? style.active : '')}
											to="https://github.com/kgz/cw-app"
											target="_blank"
											style={{
												display: 'flex',
												alignItems: 'center',
											}}
										>
											<GitHubIcon
												style={{
													marginLeft: 10,
												}}
												fontSize="small"
											/>{' '}
											<span style={{ marginLeft: -5 }}>Github</span>
										</NavLink>
										<div className={style.divider}></div>
										<Input
											startAdornment={<SearchIcon />}
											value={search}
											onChange={e => setSearch(e.target.value)}
											placeholder="Search"
											style={{
												color: '#fff',
												width: 'calc(100% - 20px)',
												marginInline: 10,
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
										<div className={style.divider}></div>

										{filteredSearch.map((route, index) => {
											return (
												<NavLink
													key={index}
													className={({ isActive }) => 'test ' + style.menuItem + ' ' + (isActive ? style.active : '')}
													to={"/" + genPath(route.name)}
												>
													{route.name}
												</NavLink>
											)
										})}
									</div>
								</OutsideAlerter>
							</div>
						</Fade>
					)}
				</TransitionGroup>
			</Drawer>
		</>
	)
}

export default Menu
