import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../@store/store';
import routes from '../@types/routes';
import { genPath } from '../modules/genPath';

function Index() {
	const dispatch = useAppDispatch();

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			{/* Test Tailwind classes */}
			<div className="p-8">
				<h1 className="text-4xl font-bold text-blue-400 mb-4">Tailwind CSS Test</h1>
				<div className="bg-blue-600 p-4 rounded-lg mb-4">
					<p className="text-white">This should be a blue box with white text</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{routes.slice(0, 6).map((route, index) => (
						<div key={index} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
							<h3 className="text-lg font-semibold text-white mb-2">{route.name}</h3>
							<img
								src={`${import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8080'}/chaos/icons/${genPath(route.name)}.png`}
								alt={route.name}
								className="w-full h-32 object-cover rounded"
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default Index;
