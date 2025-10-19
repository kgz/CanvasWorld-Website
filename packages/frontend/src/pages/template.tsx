import { Link, Route, Routes, useLocation } from 'react-router-dom'
import style from '../@scss/template.module.scss'
import Index from './index-test'
import BedheadAttractor from './attractors/bedhead_attractor'
import { useAppDispatch, useAppSelector } from '../@store/store'
import { Drawer } from '@mui/material'
import { SetMenuOpen } from '../@store/WebSlice'
import Test from './maps/bogdanov_map'
import routes from '../@types/routes'
import DatGui, { DatNumber } from 'react-dat-gui'
import Menu from '../modules/Menu'
import { useEffect, useMemo, useState } from 'react'
import { genPath } from '../modules/genPath'
import OutsideAlerter from '../@types/onClickOutside'
// import 'katex/dist/katex.min.css'
import { pink } from '@mui/material/colors'
import { useMatomo } from '@datapunt/matomo-tracker-react'

const Template = () => {
	const dispatch = useAppDispatch()
	// const [description, setDescription] = useState<JSX.Element | JSX.Element[]>(<></>)
	const { trackPageView, trackEvent } = useMatomo()

	const loc = useLocation()

	// Track page view
	useEffect(() => {
		console.log('tracking', loc)
		trackPageView({
			href: loc.pathname + loc.search
		})
	}, [trackPageView, loc])

	const { description } = useAppSelector(state => state.WebSlice)

	const isIframe = useMemo(() => {
		const params = new URLSearchParams(window.location.search)
		return params.get('iframe') !== null
	}, [])

	return (
		<Routes>
			{routes.map((route, index) => {
				return (
					<Route
						key={index}
						path={genPath(route.name) + '/'}
						element={
							<>
								<div
									className={style.container}
									style={
										isIframe
											? {
													gridTemplateColumns: '1fr',
												}
											: {}
									}
								>
									{!isIframe && (
										<OutsideAlerter callback={() => {}}>
											<Menu title={route.name} />
										</OutsideAlerter>
									)}
									<route.element />
								</div>
							</>
						}
					/>
				)
			})}
			<Route path="*" element={<Index />} />
		</Routes>
	)
}

export default Template
