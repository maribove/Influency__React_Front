import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BiSolidImageAdd } from 'react-icons/bi';
import { useParams } from 'react-router-dom';

import './Home.css';
import { uploads } from '../../utils/config';
import Message from '../../components/Message';
import PostItem from '../../components/PostItem';

import { getUserDetails } from '../../slices/userSlice';
import { publishPost, resetMessage, getAllPosts, getPostsByInterests } from '../../slices/postSlice';
import { useResetComponentMessage } from '../../hooks/useResetComponentMessage';

const Home = () => {
  const { id: userId } = useParams();

  const dispatch = useDispatch();
  const resetMessageFn = useResetComponentMessage(dispatch);

  const { user, loading: userLoading } = useSelector((state) => state.user)
  const { user: userAuth } = useSelector((state) => state.auth);
  const { posts, loading: postLoading, error: postError, message: postMessage } = useSelector((state) => state.post);

  const [publicacao, setPublicacao] = useState('');
  const [image, setImage] = useState('');
  const [imageType, setImageType] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [editId, setEditId] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editPublicacao, setEditPublicacao] = useState('');

  const token = localStorage.getItem("token");
  console.log("Token JWT:", token);
  console.log("JWT_SECRET:", process.env.JWT_SECRET);

    // Carregar dados do usuário e posts do usuário autenticado
    useEffect(() => {
      if (userAuth && userAuth._id) {
        dispatch(getUserDetails(userAuth._id)); //arrumar pra pegar foto do usuario cert
        dispatch(getPostsByInterests());
        //dispatch(getAllPosts(userId));
      }
      if (postMessage === "Post publicado com sucesso!") {
        setPublicacao(""); // limpa o campo 
        setImagePreview("");
        setImage("");
       
      }
    }, [dispatch, userAuth, postMessage]);

  const resetComponentMessage = () => {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  const submitPost = (e) => {
    e.preventDefault();

    const postData = {publicacao, image };
    const formData = new FormData();

    Object.keys(postData).forEach((key) => formData.append(key, postData[key]));
    formData.append('post', postData);

    dispatch(publishPost(formData));
    resetComponentMessage();
  };

  const handleFile = (e) => {
    const image = e.target.files[0];
    const fileType = image.type.split('/')[1];

    if (!['png', 'jpg', 'jpeg'].includes(fileType)) {
      setImageType(fileType);
    } else {
      setImage(image);
      setImageType('');
      setImagePreview(URL.createObjectURL(image));
    }
  };



  if (userLoading) {
    return <p>Carregando...</p>;
  }

  return (
    <div id="formulario">
      <h2>Seja bem-vindo à Influency, o lugar onde sua influência se torna poderosa!</h2>
      <div className="profile-header-home-post">
        {user.profileImage && (
          <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} className="profilepic" />
        )}
        <div className="profile-description">
          <h2 className='name_user'>{user.name}</h2>
        </div>
      </div>

      <div className="new-photo">
        {userAuth && userAuth.role !== "admin" &&(
          <form onSubmit={submitPost}>
            <div className="form-group">
              <label>
                <textarea
                  className="textarea-postagem"
                  type="text"
                  placeholder="O que deseja compartilhar? :)"
                  onChange={(e) => setPublicacao(e.target.value)}
                  value={publicacao}
                />
              </label>
            </div>
            <label htmlFor="post-image" className="camera-icon">
              <BiSolidImageAdd className="camera-icon" />
            </label>
            <input
              type="file"
              name="post-image"
              id="post-image"
              onChange={handleFile}
              className="input-img"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Pré-visualização" className="image-preview" />
            )}
            <div className="btn-container">
              {!postLoading && <input type="submit" value="Publicar" className="btn-compartilhar" />}
              {postLoading && <input type="submit" disabled value="Aguarde..." />}
            </div>
          </form>
        )}
      </div>
        

      {postError && <Message msg={postError} type="error" />}
      {postMessage && <Message msg={postMessage} type="sucess" />}
      {imageType && (
        <div className="file-warning">
          Formato de arquivo não suportado: {imageType.toUpperCase()}
          <br />
          Selecione um arquivo PNG, JPG ou JPEG.
        </div>
      )}

      <div id="home">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id}>
              <PostItem post={post}  />
             
            </div>
          ))
        ) : (
          <h2 className="no-photos">
            Ainda não há posts publicados! <br /> Faça a sua primeira publicação! &#128512;{' '}
          </h2>
        )}
      </div>
    </div>
  );
};

export default Home;
