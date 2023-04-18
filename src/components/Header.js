import React from 'react';
import logo from '../images/logo.svg';

function Header() {
	return (
		<header className='header'>
			<img src={logo} className='header__logo' alt='Mesto logo' />
		</header>
	);
}

export default Header;
