import "./Profile.css";
import { uploads } from "../../utils/config";

// COMPONENTES
import Message from "../../components/Message/Message";
import { Link } from "react-router-dom";
import { BsFillEyeFill, BsPencilFill, BsXLg } from "react-icons/bs";

// HOOKS
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useResetComponentMessage } from '../../hooks/useResetComponentMessage';

// REDUX
import { getUserDetails } from "../../slices/userSlice";
import {
	publishPhoto,
	resetMessage,
	getUserPhotos,
	deletePhoto,
  updatePhoto,
} from "../../slices/photoSlice";


const Profile = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const resetMessage = useResetComponentMessage(dispatch);

	const { user, loading } = useSelector((state) => state.user);
	const { user: userAuth } = useSelector((state) => state.auth);
	const {
		photos,
		loading: loadingPhoto,
		message: messagePhoto,
		error: errorPhoto,
	} = useSelector((state) => state.photo);

	const [title, setTitle] = useState("");
	const [image, setImage] = useState("");

	const [editId, setEditId] = useState("");
	const [editImage, setEditImage] = useState("");
	const [editTitle, setEditTitle] = useState("");

	// Photo
	const fileInputRef = useRef();
	const newPhotoForm = useRef();
	const editPhotoForm = useRef();

	// load user data
	useEffect(() => {
		dispatch(getUserDetails(id));
		dispatch(getUserPhotos(id));
	}, [dispatch, id]);

	const handleFile = (e) => {
		// image preview
		const image = e.target.files[0];
		setImage(image);
	};
 
	const handleSubmit = (e) => {
		e.preventDefault();

		const photoData = { title, image };

		const formData = new FormData();
		const photoFormData = Object.keys(photoData).forEach((key) =>
			formData.append(key, photoData[key])
		);

		formData.append("photo", photoFormData);

		dispatch(publishPhoto(formData));
		setTitle("");
		fileInputRef.current.value = '';
		resetMessage();
	};

	const handleDelete = (id) => {
		dispatch(deletePhoto(id));
		resetMessage();
	};

	const hideOrShowForms = () => {
		newPhotoForm.current.classList.toggle("hide");
		editPhotoForm.current.classList.toggle("hide");
	};

	const handleUpdate = (e) => {
		e.preventDefault();

    const photoData = { title: editTitle, id: editId };
    
		dispatch(updatePhoto(photoData));

		resetMessage();
	};


	const handleEdit = (photo) => {
		if (editPhotoForm.current.classList.contains("hide")) {
			hideOrShowForms();
		}

    setEditId(photo._id);
    setEditImage(photo.image);
    setEditTitle(photo.title);
	};

	const handleCancelEdit = () => {
		hideOrShowForms();
	};

	if (loading) {
		<p>Carregando...</p>;
	}

	return (
		<div id="profile">
			<div className="profile-header">
				{user.profileImage && (
					<img src={`${uploads}/users/${user.profileImage}`} alt={user.name} />
				)}
				<div className="profile-description">
					<h2>{user.name}</h2>
					<p>{user.bio}</p>
				</div>
			</div>

			{id === userAuth._id && (
				<>
					<div className="new-photo" ref={newPhotoForm}>
						<h3>Compartilhe algum momento seu:</h3>
						<form onSubmit={handleSubmit}>
							<label>
								<span>Título para a foto:</span>
								<input
									type="text"
									placeholder="Insira um título"
									onChange={(e) => setTitle(e.target.value)}
									value={title || ""}
								/>
							</label>

							<label>
								<span>Imagem:</span>
								<input type="file" onChange={handleFile} ref={fileInputRef} />
							</label>

							{!loadingPhoto && <input type="submit" value="Postar" />}
							{loading && <input type="submit" value="Aguarde..." disabled />}
						</form>
					</div>

					<div className="edit-photo hide" ref={editPhotoForm}>
						<p>Editando:</p>
						{editImage && (
							<img src={`${uploads}/photos/${editImage}`} alt={editTitle} />
						)}
						<form onSubmit={handleUpdate}>
							<input
								type="text"
								placeholder="Insira um novo título"
								onChange={(e) => setEditTitle(e.target.value)}
								value={editTitle || ""}
							/>

							<input type="submit" value="Atualizar" />
							<button className="cancel-btn" onClick={handleCancelEdit}>
								Cancelar edição
							</button>
						</form>
					</div>

					{errorPhoto && <Message message={errorPhoto} type="error" />}
					{messagePhoto && <Message message={messagePhoto} type="success" />}
				</>
			)}

			<div className="user-photos">
				<h2>Fotos publicadas</h2>
				<div className="photos-container">
					{photos &&
						photos.map((photo) => (
							<div className="photo" key={photo._id}>
								{photo.image && (
									<>
										<img
											src={`${uploads}/photos/${photo.image}`}
											alt={photo.title}
										/>
									</>
								)}
								{id === userAuth._id ? (
									<div className="actions">
										<Link to={`/photo/${photo._id}`}>
											<BsFillEyeFill />
										</Link>
										<BsPencilFill onClick={() => handleEdit(photo)} />
										<BsXLg onClick={() => handleDelete(photo._id)} />
									</div>
								) : (
									<Link className="btn" to={`/photo/${photo._id}`}>
										Ver
									</Link>
								)}
							</div>
						))}

					{photos.length === 0 && <p>Ainda não há fotos publicadas</p>}
				</div>
			</div>
		</div>
	);
};

export default Profile;
