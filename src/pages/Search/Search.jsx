import "./Search.css";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";
import { useQuery } from "../../hooks/useQuery";

import LikeContainer from "../../components/LikeContainer/LikeContainer";
import PhotoItem from "../../components/PhotoItem/PhotoItem";
import { Link, useParams } from "react-router-dom";

import { searchPhotos, like } from "../../slices/photoSlice";

const Search = () => {
	const query = useQuery();
	const search = query.get("q");

	const dispatch = useDispatch();
	const resetMessage = useResetComponentMessage(dispatch);

	const { user } = useSelector(({ auth }) => auth);
	const { photos, loading } = useSelector(({ photo }) => photo);

	useEffect(() => {
		dispatch(searchPhotos(search));
	}, [dispatch, search]);

	const handleLike = (photo) => {
		dispatch(like(photo._id));
		resetMessage();
	};

	if (loading) {
		return <p>Carregando...</p>;
	} 

	return (
		<div id="search">
			<h2>Você está buscando por: {search} </h2>

			{photos &&
				photos.map((photo) => (
					<div key={photo._id}>
						<PhotoItem photo={photo} />
						<LikeContainer photo={photo} user={user} handleLike={handleLike} />
						<Link className="btn" to={`/photo/${photo._id}`}>
							Ver mais
						</Link>
					</div>
				))}
			{photos && photos.length === 0 && (
				<h2 className="no-photos">
					Não foram encontrados resultados para sua busca
					<Link to={`/users/${user._id}`}>clique aqui</Link>
				</h2>
			)}
		</div>
	);
};

export default Search;
