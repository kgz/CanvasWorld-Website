import React from 'react'
import { Link, NavLink } from 'react-router-dom'

import { useAppDispatch } from '../@store/store'
import routes from '../@types/routes'
import { genPath } from '../modules/genPath'
import { Card, CardHeader, CardMedia } from '@mui/material'
import { pink, yellow } from '@mui/material/colors'
import { Center } from '@react-three/drei'
import style from '../@scss/template.module.scss'
import { relative } from 'path'

function Index() {
	const L = routes.at(0)?.element

	return (
		<div
			className="App"
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				width: '100%',
				background: '#2222',
			}}
		>
			<link rel="preconnect" href="https://fonts.googleapis.com"></link>
			<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"></link>
			<link href="https://fonts.googleapis.com/css2?family=Rubik+Dirt&display=swap" rel="stylesheet"></link>
			<div
				style={{
					width: '100%',
					background: pink[500],
					height: 30,
				}}
			>
				some links content
			</div>
			<div
				style={{
					width: '100%',
					height: 400,
				}}
			>
				<div
					style={{
						opacity: 1,
						fontFamily: '"Rubik Dirt", system-ui',
						fontWeight: 400,
						fontStyle: 'normal',
						textAlign: 'center',
						verticalAlign: 'middle',
						height: 400,
						alignContent: 'center',
						fontSize: 90,
						zIndex: 1,
						position: 'absolute',
						width: '100%',
					}}
				>
					My World of <span className={style.awesome}>Chaos</span>
				</div>
				<div
					style={{
						width: '100%',
						height: 400,
						background: 'white',
						backgroundImage:
							'url("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.nightcafe.studio%2Fjobs%2FG5UemOvzThnEchkcJ77h%2FG5UemOvzThnEchkcJ77h--1--56siy.jpg%3Ftr%3Dw-1600%2Cc-at_max&f=1&nofb=1&ipt=69ca90eac2398c7f16e47e456d2317533b9042211e26d8f1dffb9cadb676b1b7&ipo=images")',
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'cover',
						backgroundPosition: 'top, center',
						opacity: 0.2,
						position: 'absolute',
						zIndex: 0,
					}}
				></div>
			</div>
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					marginInline: 20,
					gap: 50,
					marginTop: 50,
				}}
			>
				{routes.map((route, index) => {
					return (
						<Link key={index} to={"/" + genPath(route.name)}>
							{/* {route.name} */}

							<Card sx={{ maxWidth: 345, maxHeight: 450 }}>
								<CardHeader title={route.name} subheader={'September 14, 2016'} />
								<CardMedia
									component="img"
									src={`${import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8080'}/chaos/icons/${genPath(route.name)}.png`}
									height="194"
								></CardMedia>
							</Card>
						</Link>
					)
				})}
			</div>

			{/* <iframe
					frameBorder={'0'}
					scrolling="no"
					src={'https://localhost:2020/chaos/' + genPath(routes[0].name) + '?iframe'}
				/>
				 */}
		</div>
	)
}

export default Index
