import React from 'react'
import { Route, BrowserRouter, Routes, } from 'react-router-dom'
import Layout from './screens/Layout'
import FlawInMathsCrownJewel from './screens/FlawInMathsCrownJewel/FlawInMathsCrownJewel'
import Home from './screens/Home/Home'

// There is a bug when including @react-spring/web and @react-spring/three together.
// See: https://github.com/pmndrs/react-spring/issues/1586
import { Globals } from '@react-spring/shared';
Globals.assign({
  frameLoop: 'always',
})

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