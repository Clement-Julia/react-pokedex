import React from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Navigation from '../layout/navigation'

import NotFound from './error-page'
import Home from '../pages/Home'
import ViewPokemon from '../pages/ViewPokemon'

const Routeur = () => {
	return (
		<BrowserRouter>
			<Navigation />
			<Routes>
				<Route exact path='/' element={<Home />} />
				<Route exact path='pokemon/:id' element={<ViewPokemon />} />
				<Route path='*' element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	)
}

export default Routeur
