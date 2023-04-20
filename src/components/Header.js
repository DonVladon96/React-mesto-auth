import { useState } from 'react';
import logo from '../images/logo.svg';

function Header({ isWrapperForHeader, children }) {
	const [isMenuOpened, setIsMenuOpened] = useState(false);

	function handleOpenMenu() {
		setIsMenuOpened((state) => !state);
	}

	return (
		<header
			className={'header section_size_narrow' + (isWrapperForHeader ? '' : '')}
		>
			<img src={logo} className='header__logo' alt='Mesto logo' />

			{isWrapperForHeader && (
				<button
					type='button'
					className={
						'header__menu-button' +
						(isMenuOpened ? 'header__menu-button_active' : '')
					}
					aria-label='Menu'
					onClick={handleOpenMenu}
				></button>
			)}

			{children && (
				<nav
					className={
						'header__menu' + (isMenuOpened ? 'header__menu_active' : '')
					}
				>
					<ul className='header__menu-li'>
						{(children.length > 1 ? children : [children]).map((item, pos) => (
							<li className='header__menu-item' key={pos}>
								{item}
							</li>
						))}
					</ul>
				</nav>
			)}
		</header>
	);
}

export default Header;
