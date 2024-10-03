import React, { useEffect, useState } from 'react';
import './Search.css';

// hooks
import { useSelector, useDispatch } from 'react-redux';
import useResetComponentMessage from '../../hooks/useResetComponentMessage';
import { useQuery } from '../../hooks/useQuery';

// componentes
import UserItem from '../../components/UserItem';
import PhotoItem from '../../components/PhotoItem';
import { Link } from 'react-router-dom';
import { TfiFaceSad } from "react-icons/tfi";


// redux
import { SearchPhoto } from '../../slices/photoSlice';
import { SearchUser } from '../../slices/userSlice';

const Search = () => {
    const query = useQuery();
    const search = query.get("q") || "";  // Default to empty string if null

    const dispatch = useDispatch();

    const resetMessage = useResetComponentMessage(dispatch);
    const { user } = useSelector(state => state.auth);
    const { photos, loading: loadingPhotos } = useSelector(state => state.photo);
    const { users, loading: loadingUsers } = useSelector(state => state.user);

    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!search) {
            setErrorMessage("Por favor, insira um termo de pesquisa!");
            return;
        } else {
            setErrorMessage("");
            dispatch(SearchPhoto(search));
            dispatch(SearchUser(search));
        }
    }, [dispatch, search]);

    if (loadingPhotos || loadingUsers) {
        return <p>Carregando...</p>;
    }

    return (
        <div className='search'>
            {/* quando campo estiver vazio */}
            {errorMessage ? (
                <h2 className='no-results'>{errorMessage}</h2>
            ) : (
                <>
                    <h2>Você está buscando por: {search}</h2>
                    {users && users.length === 0 && (
                        <h2 className='no-results'>
                            Não foram encontrados resultados para usuários!  <TfiFaceSad className='sad-face'/>
                        </h2>
                    )}
                    {photos && photos.length === 0 && (
                        <h2 className='no-results'>
                            Não foram encontrados resultados de vagas! <TfiFaceSad className='sad-face'/>
                        </h2>
                    )}
                    <div id="search-results">
                        {photos && photos.map((photo, index) => (
                            <div key={photo._id} className={`search-result search-result-${index}`}>
                                <PhotoItem photo={photo} />
                                <Link to={`/users/${photo.userId}`}>
                                    <button className='btn-vaga'>Ver mais</button>
                                </Link>
                            </div>
                        ))}

                        {users && users.map((user, index) => (
                            <div key={user._id} className={`search-result search-result-${index}`}>
                                <UserItem user={user} />
                                <Link to={`/${user._id}/profile`}>
                                    <button className='btn-vaga'>Ver mais</button>
                                </Link>
                            </div> 
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Search;
