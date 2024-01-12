import { Link, Route, Routes } from "react-router-dom";
import style from "../@scss/template.module.scss";
import Index from ".";
import BedheadAttractor from './attractors/bedhead_attractor'
import { useAppDispatch, useAppSelector } from '../@store/store'
import { Drawer } from '@mui/material'
import { SetMenuOpen } from '../@store/webSiteState.slice'
import Test from './maps/bogdanov_map'
import routes from '../@types/routes'
import DatGui, { DatNumber } from 'react-dat-gui'
import Menu from '../modules/Menu'
import { useState } from 'react'
import { genPath } from '../modules/genPath'
import OutsideAlerter from '../@types/onClickOutside'
import 'katex/dist/katex.min.css'

const Template = () => {
	const dispatch = useAppDispatch()
	const [description, setDescription] = useState<JSX.Element | JSX.Element[]>(<></>)

	return (
		<div className={style.container}>
			<Routes>
				{routes.map((route, index) => {
					return (
						<Route
							key={index}
							path={genPath(route.name)}
							element={
								<>
									<OutsideAlerter callback={() => {}}>
										<Menu title={route.name} description={description} />
									</OutsideAlerter>
									<route.element setDescription={setDescription} />
								</>
							}
						/>
					)
				})}
				<Route path="*" element={<Index />} />
			</Routes>
		</div>
	)
}

export default Template;