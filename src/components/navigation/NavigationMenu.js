import React, { useState, useRef, useEffect } from 'react'
import { useSpring, animated } from '@react-spring/web'
import './NavigationMenu.css';
import { Link } from 'react-router-dom'

const NavigationMenu = (props) => {

	const [isNavOpen, setIsNavOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [isFirstTimeViewing, setIsFirstTimeViewing] = useState(true);
	const navEntries = [
		{ title: 'Home', location: '/' },
		{ title: `A Flaw in Math's Crown Jewel`, location: '/flaw-in-maths-crown-jewel' },
	];

	const filteredNavEntriesBySearchTerm = () => navEntries.filter((loopNavEntry) =>
		loopNavEntry.title.toLowerCase().includes(searchTerm.toLowerCase())
	)

	const springPropsMenu = useSpring({
		cancel: isFirstTimeViewing,
		from: {
			opacity: 0,
			left: isNavOpen ? '-300px' : '0px',
		},
		to: {
			opacity: 1,
			left: isNavOpen ? '0px' : '-310px',
		},
	})
	const springPropsSearch = useSpring({
		cancel: isFirstTimeViewing,
		display: isFirstTimeViewing ? 'none' : 'block',
		from: {
			opacity: 0,
			top: isNavOpen ? '-30px' : '0px',
		},
		to: {
			opacity: 1,
			top: isNavOpen ? '0px' : '-30px',
		},
	})

	const outsideClickRef = useRef();

	useEffect(() => {
		function handleClickOutside(event) {
		  if (outsideClickRef.current && !outsideClickRef.current.contains(event.target)) {
		    setIsNavOpen(false);
		  }
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
		  document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [outsideClickRef, setIsNavOpen]);

	return (
		<div className="Navigation-container" ref={outsideClickRef}>

			<div className="Navigation-top">
				<div>
					<button onClick={()=> {
						setIsNavOpen(!isNavOpen)
						setIsFirstTimeViewing(false)
						}}>
						Stories
					</button>
					</div>
				<div className="Navigation-top-search-container">
					<animated.div className="Navigation-top-search-input" style={springPropsSearch}>
						<input
							className="Navigation-top-search-input-field"
							type="text"
							placeholder="Search"
							onChange={(e) => setSearchTerm(e.target.value)}
							value={searchTerm}
						/>
					</animated.div>
				</div>
			</div>
			<div className="Navigation-menu-container">
				<animated.nav style={springPropsMenu} className="Navigation-window">
					<ul>
						{
							filteredNavEntriesBySearchTerm().map((loopNavEntry) => (
								<li key={loopNavEntry.location}>
									<Link className="Navigation-link" to={loopNavEntry.location}>{loopNavEntry.title}</Link>
								</li>
							))
						}
					</ul>
					{!filteredNavEntriesBySearchTerm().length && searchTerm && (
						<div className="Navigation-no-results-found">No Results</div>
					)}
				</animated.nav>
			</div>

		</div>
	)
}

export default NavigationMenu