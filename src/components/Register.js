import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import auth from '../utils/auth';

function Register({ handleShowInfoMessage }) {
	const startValues = {
		email: '',
		password: ''
	};

	const [inputs, setInputs] = useState(startValues);

	const navigate = useNavigate();

	function handleChangeValue(evt) {
		const value = evt.target.value;
		const name = evt.target.name;
		setInputs((state) => ({ ...state, [name]: value }));
	}

	function handleSubmitValue(evt) {
		evt.preventDefault();
		auth
			.register(inputs)
			.then((res) => {
				handleShowInfoMessage({
					text: 'Вы успешно зарегистрировались!',
					isSuccess: true
				});
				restartForm();
				navigate('/sign-in');
			})
			.catch((error) => {
				const text =
					error.message || 'Что-то пошло не так! Попробуйте еще раз.';
				handleShowInfoMessage({
					text: 'Что-то пошло не так! Попробуйте еще раз.',
					isSuccess: false
				});
			});
	}

	function restartForm() {
		setInputs({ ...startValues });
	}

	return (
		<>
			<Header>
				<Link to='/sign-in' className='header__menu-item'>
					Войти
				</Link>
			</Header>

			<main>
				<div className='initial-window section_size_narrow'>
					<h2 className='initial-window__title'> Регистрация </h2>
					<form
						className='initial-window__form'
						onSubmit={handleSubmitValue}
						noValidate
					>
						<input
							type='email'
							className='initial-window__input'
							placeholder='Email'
							value={inputs.email}
							name='email'
							onChange={handleChangeValue}
							required
						/>
						<input
							type='password'
							className='initial-window__input'
							placeholder='Password'
							name='password'
							value={inputs.password}
							onChange={handleChangeValue}
							required
						/>
						<button type='submit' className='initial-window__submit-button'>
							Регистрация
						</button>
					</form>
					<p className='initial-window__span-text'>
						Уже зарегистрированы?{' '}
						<Link className='initial-window__link' to='/sing-in'>
							Войти
						</Link>
					</p>
				</div>
			</main>
		</>
	);
}

export default Register;
