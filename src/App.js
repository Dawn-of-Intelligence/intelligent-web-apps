import React from 'react'
import { Route, BrowserRouter, Routes, } from 'react-router-dom'
import Layout from './screens/Layout'
import FlawInMathsCrownJewel from './screens/FlawInMathsCrownJewel/FlawInMathsCrownJewel'
import Home from './screens/Home/Home'

const App = () => (
	
	<BrowserRouter>
		<Layout>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/flaw-in-maths-crown-jewel" element={<FlawInMathsCrownJewel />} />
			</Routes>
	</Layout>
	</BrowserRouter>
)

export default App