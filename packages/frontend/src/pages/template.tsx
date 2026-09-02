import { lazy, Suspense, useEffect, useMemo } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Index from './index-new'
import Blog from './blog'
import PostPage from './PostPage'
import routes from '../@types/routes'
import { useMatomo } from '@datapunt/matomo-tracker-react'

const ModernCanvasPage = lazy(() => import('./template-modern'))

const Template = () => {
	const { trackPageView } = useMatomo()

	const loc = useLocation()

	// Track page view
	useEffect(() => {
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
						path={'/' + route.slug}
						element={
							<Suspense fallback={null}>
								<ModernCanvasPage route={route} isIframe={isIframe} />
							</Suspense>
						}
					/>
				)
			})}
			<Route path="/blog" element={<Blog />} />
			<Route path="/blog/:slug" element={<PostPage />} />
			<Route path="*" element={<Index />} />
		</Routes>
	)
}

export default Template
