import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../@store/store';
import routes from '../@types/routes';
import { genPath } from '../modules/genPath';
import { HeroSection, FractalCard, GridSection } from '../components/ui';

function Index() {
	const dispatch = useAppDispatch();

	return (
		<div className="min-h-screen bg-gray-900">
			{/* Hero Section */}
			<HeroSection 
				title="My World of Chaos"
				subtitle="Discover the infinite beauty hidden within mathematical equations. Explore stunning fractal attractors and chaotic systems through interactive visualizations."
			/>

			{/* Navigation Bar */}
			<nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
				<div className="max-w-7xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<Link to="/" className="text-2xl font-bold gradient-text">
							CanvasWorld
						</Link>
						<div className="hidden md:flex space-x-8">
							<Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300">
								Home
							</Link>
							<Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-300">
								About
							</Link>
							<Link to="/gallery" className="text-gray-300 hover:text-white transition-colors duration-300">
								Gallery
							</Link>
						</div>
						<button className="md:hidden text-white">
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>
					</div>
				</div>
			</nav>

			{/* Attractors Grid */}
			<GridSection title="Mathematical Attractors">
				{routes.map((route, index) => (
					<FractalCard
						key={index}
						name={route.name}
						route={genPath(route.name)}
						imageUrl={`${import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:9090'}/chaos/icons/${genPath(route.name)}.png`}
						description={`Explore the ${route.name} mathematical attractor`}
					/>
				))}
			</GridSection>

			{/* Features Section */}
			<section className="py-20 px-4 bg-gray-800/50">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
							Why Explore Mathematical Beauty?
						</h2>
						<p className="text-xl text-gray-300 max-w-3xl mx-auto">
							Mathematical attractors reveal the hidden patterns that govern our universe, from the smallest quantum particles to the largest cosmic structures.
						</p>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="text-center p-6 glass-effect rounded-xl">
							<div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-white mb-2">Interactive Exploration</h3>
							<p className="text-gray-400">
								Manipulate parameters in real-time to see how small changes create dramatically different patterns.
							</p>
						</div>
						
						<div className="text-center p-6 glass-effect rounded-xl">
							<div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-white mb-2">Infinite Complexity</h3>
							<p className="text-gray-400">
								Zoom into any region to discover new levels of detail and self-similar patterns that never end.
							</p>
						</div>
						
						<div className="text-center p-6 glass-effect rounded-xl">
							<div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-white mb-2">Aesthetic Beauty</h3>
							<p className="text-gray-400">
								Experience the profound beauty that emerges from simple mathematical equations and rules.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-12 px-4 bg-gray-900 border-t border-gray-800">
				<div className="max-w-7xl mx-auto text-center">
					<div className="mb-8">
						<h3 className="text-2xl font-bold gradient-text mb-4">CanvasWorld</h3>
						<p className="text-gray-400 max-w-2xl mx-auto">
							Exploring the infinite beauty of mathematical chaos through interactive visualizations.
						</p>
					</div>
					
					<div className="flex justify-center space-x-6 mb-8">
						<a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
							<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
								<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
							</svg>
						</a>
						<a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
							<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
							</svg>
						</a>
						<a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
							<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
							</svg>
						</a>
					</div>
					
					<div className="text-gray-500 text-sm">
						<p>&copy; 2024 CanvasWorld. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}

export default Index;
