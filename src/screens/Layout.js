import React from 'react'
import './Layout.css';
import NavigationMenu from '../components/navigation/NavigationMenu'


const Layout = (props) => (
	<div className="Layout-container" >
		<nav className="Layout-top-nav">
			<NavigationMenu />
		</nav>
		<div>
			{props.children}
		</div>
	</div>
)

export default Layout