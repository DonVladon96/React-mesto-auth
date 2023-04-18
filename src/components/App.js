import { useEffect, useState } from 'react';

import Loader from '../Loader/Loader';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';

import ImagePopup from './ImagePopup';
import EditAvatarPopup from './EditAvatarPopup';
import PopupWithVerification from './PopupWithVerification';
import EditProfilePopup from './EditProfilePopup';
import AddPlacePopup from './AddPlacePopup';

import api from '../utils/Api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import WrapperForLoader from '../Loader/WrapperForLoader';

function App() {
	//использую хуки, чтобы задать начальное состояние(false)
	const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
	const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
	const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
	const [isConfirmDeletePopup, setConfirmDeletePopup] = useState(false);
	const [isCardOpen, setCardOpen] = useState(false);
	const [isSelectedCard, setSelectedCard] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	// Создайте стейт currentUser в корневом компоненте
	const [currentUser, setCurrentUser] = useState({});

	const [cards, setCard] = useState([]);

	const [currentCard, setCurrentCard] = useState({});

	useEffect(() => {
		Promise.all([api.getUserInfo(), api.getInitialCards()])
			.then((data) => {
				const [userData, cardsData] = data;

				setCurrentUser(userData);

				setCard(cardsData);
				setIsLoading(false);
			})
			.catch((err) => {
				console.log(`Ошибка: ${err}`);
			});
	}, []);

	function handleUpdateUser({ name, about }) {
		api
			.parseUserInfo({ name, about })
			.then((response) => {
				setCurrentUser(response);
				setIsLoading(false);
				closeAllPopups();
			})
			.catch((err) => {
				console.log(`Ошибка: ${err}`);
			})
			.finally(setIsLoading(true));
	}

	function handleCardLike(card) {
		const isLiked = card.likes.some((i) => i._id === currentUser._id);
		api
			.addLike(card._id, !isLiked)
			.then((newCard) => {
				setCard((state) =>
					state.map((c) => (c._id === card._id ? newCard : c))
				);
			})
			.catch((err) => {
				console.log(`Ошибка: ${err}`);
			});
	}

	function handleCardDelete(event) {
		event.preventDefault();

		api
			.deleteCard(currentCard._id)
			.then(() => {
				setCard(cards.filter((i) => i !== currentCard));
				setIsLoading(false);
				closeAllPopups();
			})
			.catch((err) => {
				console.log(`Ошибка: ${err}`);
			})
			.finally(setIsLoading(true));
	}

	//описываю функции для всех изменений начального состояния
	function handleEditProfileClick() {
		setEditProfilePopupOpen(true);
	}

	function handleChangeAvatar({ avatar }) {
		api
			.updateUserAvatar({ avatar })
			.then((res) => {
				setCurrentUser(res);
				setIsLoading(false);
				closeAllPopups();
			})
			.catch((err) => {
				console.log(`Ошибка: ${err}`);
			})
			.finally(setIsLoading(true));
	}

	function handleAddPlacePopup({ name, link }) {
		api
			.createCard({ name, link })
			.then((newCard) => {
				setCard([newCard, ...cards]);
				setIsLoading(false);
				closeAllPopups();
			})
			.catch((err) => {
				console.log(`Ошибка: ${err}`);
			})
			.finally(setIsLoading(true));
	}

	function handleAddPlaceClick() {
		setAddPlacePopupOpen(true);
	}

	function handleEditAvatarClick() {
		setEditAvatarPopupOpen(true);
	}

	//функция закрытия всех попапов
	function closeAllPopups() {
		setCardOpen(false);
		setEditProfilePopupOpen(false);
		setAddPlacePopupOpen(false);
		setEditAvatarPopupOpen(false);
		setConfirmDeletePopup(false);
	}

	function handleConfirmDeletePopup(card) {
		setConfirmDeletePopup(true);
		setCurrentCard(card);
	}

	function handleOpenCardClick(cardsData) {
		setCardOpen(true);
		setSelectedCard(cardsData);
	}

	return (
		<CurrentUserContext.Provider value={currentUser}>
			<div className='main-page'>
				{isLoading ? (
					<WrapperForLoader>
						<Loader></Loader>
					</WrapperForLoader>
				) : (
					<>
						{' '}
						<Header></Header>
						<Main
							openProfileEdit={handleEditProfileClick}
							addButtonCard={handleAddPlaceClick}
							openUserAvatar={handleEditAvatarClick}
							openDeleteConfirm={handleConfirmDeletePopup}
							openCard={handleOpenCardClick}
							cardLike={handleCardLike}
							cards={cards}
						></Main>
						<Footer></Footer>
					</>
				)}

				<EditAvatarPopup
					isOpen={isEditAvatarPopupOpen}
					isClosed={closeAllPopups}
					onSubmit={handleChangeAvatar}
				></EditAvatarPopup>
				{/* для редактирования профиля */}
				<EditProfilePopup
					isOpen={isEditProfilePopupOpen}
					isClosed={closeAllPopups}
					onUpdateUser={handleUpdateUser}
				></EditProfilePopup>

				{/* для добавления карточек */}
				<AddPlacePopup
					isOpen={isAddPlacePopupOpen}
					isClosed={closeAllPopups}
					onAddCards={handleAddPlacePopup}
				></AddPlacePopup>

				{/* для открытия картинки */}
				<ImagePopup
					card={isSelectedCard}
					isOpen={isCardOpen}
					isClosed={closeAllPopups}
				></ImagePopup>
				{/* для подтверждения удаления  */}
				<PopupWithVerification
					isOpen={isConfirmDeletePopup}
					isClosed={closeAllPopups}
					onSubmit={
						isLoading ? (
							<WrapperForLoader>
								<Loader></Loader>
							</WrapperForLoader>
						) : (
							handleCardDelete
						)
					}
				></PopupWithVerification>
			</div>
		</CurrentUserContext.Provider>
	);
}

export default App;
