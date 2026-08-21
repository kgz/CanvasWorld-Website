import { Route, Routes, useLocation } from 'react-router-dom'
import Index from './index-new'
import Blog from './blog'
import routes from '../@types/routes'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { useEffect, useMemo } from 'react'
import ModernCanvasPage from './template-modern'

const Template = () => {
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
						path={"/" + route.slug}
						element={
							<ModernCanvasPage route={route} isIframe={isIframe} />
						}
					/>
				)
			})}
			<Route path="/blog" element={<Blog />} />
			<Route path="*" element={<Index />} />
		</Routes>
	)
}

export default Template
