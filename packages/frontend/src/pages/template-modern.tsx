import React from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../@store/store';
import { SetMenuOpen, setData } from '../@store/WebSlice';
import routes from '../@types/routes';
import { genPath } from '../modules/genPath';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { useEffect, useMemo } from 'react';
import Index from './index-new';

// Route components are imported dynamically via route.element

const ModernCanvasPage: React.FC<{ route: any; isIframe: boolean }> = ({ route, isIframe }) => {
	const dispatch = useAppDispatch();
	const { description, datData, data } = useAppSelector(state => state.WebSlice);
	const [sidebarOpen, setSidebarOpen] = React.useState(!isIframe);

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			{/* Navigation Header */}
			<nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
				<div className="max-w-7xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<button
								onClick={() => setSidebarOpen(!sidebarOpen)}
								className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
							>
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
								</svg>
							</button>
							<Link to="/" className="text-2xl font-bold gradient-text">
								CanvasWorld
							</Link>
						</div>
						<h1 className="text-xl font-semibold text-white">{route.name}</h1>
						<div className="flex items-center space-x-4">
							<Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300">
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
								</svg>
							</Link>
						</div>
					</div>
				</div>
			</nav>

			<div className="flex pt-16">
				{/* Sidebar */}
				{sidebarOpen && !isIframe && (
					<div className="w-80 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/50 min-h-screen">
					<div className="p-6">
							{/* Description */}
							<div className="mb-6">
								<h2 className="text-lg font-semibold text-white mb-3">About</h2>
								<div className="text-gray-300 text-sm leading-relaxed">
									{typeof description === 'string' 
										? description.split('\n').map((line, index) => {
											// Check if line contains LaTeX math (starts with x_ or y_)
											if (line.match(/^[xy]_{/)) {
												return (
													<div key={index} className="my-2 font-mono text-blue-300 bg-gray-700/50 p-2 rounded">
														{line}
													</div>
												)
											}
											return (
												<div key={index} className="my-1">
													{line}
												</div>
											)
										})
										: <div>Loading description...</div>
									}
								</div>
							</div>

							{/* Controls */}
							{datData && Object.keys(datData.options).length > 0 && (
								<div className="mb-6">
									<h2 className="text-lg font-semibold text-white mb-3">Controls</h2>
									<div className="space-y-4">
										{Object.entries(datData.options).map(([key, option]: [string, any]) => (
											<div key={key}>
												<label className="block text-sm font-medium text-gray-300 mb-1">
													{key}
												</label>
												<input
													type="range"
													min={option.min}
													max={option.max}
													step={option.step || 0.001}
													value={data[key] || option.initialValue}
													onChange={(e) => {
														dispatch(setData({ [key]: parseFloat(e.target.value) }));
													}}
													className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
												/>
												<div className="flex justify-between text-xs text-gray-400 mt-1">
													<span>{option.min}</span>
													<span className="font-mono">{data[key] || option.initialValue}</span>
													<span>{option.max}</span>
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Examples */}
							{datData.examples && datData.examples.length > 0 && (
								<div className="mb-6">
									<h2 className="text-lg font-semibold text-white mb-3">Examples</h2>
									<div className="space-y-2">
										{datData.examples.map((example: any, index: number) => (
											<button
												key={index}
												onClick={() => {
													dispatch(setData(example));
												}}
												className="w-full text-left p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors duration-300"
											>
												<div className="text-sm text-white font-medium">Example {index + 1}</div>
												<div className="text-xs text-gray-400 mt-1">
													{Object.entries(example).map(([key, value]) => `${key}: ${value}`).join(', ')}
												</div>
											</button>
										))}
									</div>
								</div>
							)}

							{/* Navigation */}
							<div>
								<h2 className="text-lg font-semibold text-white mb-3">Explore</h2>
								<div className="space-y-1">
									{routes.slice(0, 8).map((route, index) => (
										<Link
											key={index}
											to={"/" + genPath(route.name)}
											className="block p-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded transition-colors duration-300"
										>
											{route.name}
										</Link>
									))}
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Main Canvas Area */}
				<div className={`flex-1 ${sidebarOpen && !isIframe ? 'ml-0' : 'ml-0'}`}>
					<div className="h-screen bg-gray-900 relative">
						<route.element />
					</div>
				</div>
			</div>
		</div>
	);
};

const Template = () => {
	const dispatch = useAppDispatch();
	const { trackPageView } = useMatomo();
	const loc = useLocation();

	// Track page view
	useEffect(() => {
		console.log('tracking', loc);
		trackPageView({
			href: loc.pathname + loc.search
		});
	}, [trackPageView, loc]);

	const isIframe = useMemo(() => {
		const params = new URLSearchParams(window.location.search);
		return params.get('iframe') !== null;
	}, []);

	return (
		<Routes>
			{routes.map((route, index) => {
				return (
					<Route
						key={index}
						path={"/" + genPath(route.name)}
						element={
							<ModernCanvasPage route={route} isIframe={isIframe} />
						}
					/>
				);
			})}
			<Route path="*" element={<Index />} />
		</Routes>
	);
};

export default ModernCanvasPage;
