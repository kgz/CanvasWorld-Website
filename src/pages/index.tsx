import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import { useAppDispatch } from '../@store/store';
import routes from '../@types/routes';
import { genPath } from '../modules/genPath';
import { Card, CardHeader, CardMedia } from '@mui/material'

function Index() {
	const L = routes.at(0)?.element

	return (
		<div
			className="App"
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				width: '100%',
			}}
		>
			<Link to="/">Home</Link>
			<br />
			{routes.map((route, index) => {
				return (
					<Link key={index} to={genPath(route.name)}>
						{/* {route.name} */}

						<Card sx={{ maxWidth: 345, maxHeight: 450 }}>
							<CardHeader title={route.name} subheader={'September 14, 2016'} />
							<CardMedia component="img" src={'/chaos/icons/' + genPath(route.name) + '.png'} height="194"></CardMedia>
						</Card>
					</Link>
				)
			})}

			{/* <iframe
					frameBorder={'0'}
					scrolling="no"
					src={'https://localhost:2020/chaos' + genPath(routes[0].name) + '?iframe'}
				/>
				 */}
		</div>
	)
}

export default Index;
