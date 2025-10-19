import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Index from './index-new'
import { useAppDispatch, useAppSelector } from '../@store/store'
import { SetMenuOpen } from '../@store/WebSlice'
import routes from '../@types/routes'
import { genPath } from '../modules/genPath'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { useEffect, useMemo } from 'react'
import ModernCanvasPage from './template-modern'

const Template = () => {
	const dispatch = useAppDispatch()
	const { trackPageView } = useMatomo()

	const loc = useLocation()

	// Track page view
	useEffect(() => {
		console.log('tracking', loc)
		trackPageView({
			href: loc.pathname + loc.search
		})
	}, [trackPageView, loc])

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
						path={"/chaos/" + genPath(route.name)}
						element={
							<ModernCanvasPage route={route} isIframe={isIframe} />
						}
					/>
				)
			})}
			<Route path="*" element={<Index />} />
		</Routes>
	)
}

export default Template
