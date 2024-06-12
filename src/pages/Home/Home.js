import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { BiSolidImageAdd } from "react-icons/bi";
import { FaTrash } from "react-icons/fa"; // Importando o ícone de lixeira

import './Home.css';
import { uploads } from "../../utils/config";
import Message from "../../components/Message";
import LikeContainer from "../../components/LikeContainer";
import PostItem from "../../components/PostItem";
import { useParams } from "react-router-dom";

import { getUserDetails } from '../../slices/userSlice';
import { getUserPosts, publishPost, resetMessage, deletePost, updatePost, getPosts, like, comment } from "../../slices/postSlice"
import { useResetComponentMessage } from '../../hooks/useResetComponentMessage';

const Home = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const resetMessage = useResetComponentMessage(dispatch);

  const { user, loading } = useSelector((state) => state.user);
  const { user: userAuth } = useSelector((state) => state.auth);
  const { posts, loading: loadingPost, error: errorpost, message: messagepost } = useSelector((state) => state.post);

  const [publicacao, setPublicacao] = useState("");
  const [image, setImage] = useState("");
  const [imageType, setImageType] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [editId, setEditId] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editPublicacao, setEditPublicacao] = useState("");



  // Carregar posts
  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  // Carregar dados do usuário e posts do usuário autenticado
  useEffect(() => {
    if (userAuth && userAuth._id) {
      dispatch(getUserDetails(userAuth._id));
      dispatch(getUserPosts(userAuth._id));
    }
    if (messagepost === "Post publicado com sucesso!") {
      setPublicacao(""); // limpa o campo 
      setImagePreview("");
    }
  }, [dispatch, userAuth, messagepost]);

  // Reset componente
  function resetComponentMessage() {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  }

  // Publicar post
  const submitPost = (e) => {
    e.preventDefault();

    const postData = { publicacao, image };
    const formData = new FormData();

    Object.keys(postData).forEach((key) => formData.append(key, postData[key]));
    formData.append("post", postData);

    dispatch(publishPost(formData));
    resetComponentMessage();
  };

  // Alterar estado da imagem
  const handleFile = (e) => {
    const image = e.target.files[0];
    const fileType = image.type.split("/")[1];

    if (!["png", "jpg", "jpeg"].includes(fileType)) {
      setImageType(fileType);
    } else {
      setImage(image);
      setImageType("");
      setImagePreview(URL.createObjectURL(image));
    }
  };




  // Curtir
  const handleLike = (post) => {
    dispatch(like(post._id));
    resetMessage();
  };



  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div id='formulario'>
      <h2>Seja bem-vindo à Influency, o lugar onde sua influência se torna poderosa!</h2>
      <div className="profile-header-home-post">
        {user.profileImage && (
          <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} className="profilepic" />
        )}
        <div className="profile-description">
          <h2>{user.name}</h2>
        </div>
      </div>

      <div className="new-photo">
        <form onSubmit={submitPost}>
          <label>
            <textarea
            className='textarea-postagem'
              type="text"
              placeholder="O que deseja compartilhar? :)"
              onChange={(e) => setPublicacao(e.target.value)}
              value={publicacao}
            />
          </label>
          <label htmlFor="post-image" className="camera-icon">
            <BiSolidImageAdd className='camera-icon' />
          </label>
          <input
            type="file"
            name="post-image"
            id="post-image"
            onChange={handleFile}
            className='input-img'
          />
          {imagePreview && (
            <img src={imagePreview} alt="Pré-visualização" className="image-preview" />
          )}
          <div className="btn-container">
            {!loadingPost && <input type="submit" value="Publicar" className="btn-compartilhar" />}
            {loadingPost && <input type="submit" disabled value="Aguarde..." />}
          </div>
        </form>
      </div>

      {errorpost && <Message msg={errorpost} type="error" />}
      {messagepost && <Message msg={messagepost} type="sucess" />}
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
              <PostItem post={post} />
              <LikeContainer post={post} user={user} handleLike={handleLike} />

            </div>
          ))
        ) : (
          <h2 className="no-photos">
            Ainda não há posts publicados! <br/> Faça a sua primeira publicação! &#128512;{" "}
          </h2>
        )}
      </div>
      
    </div>
  );
};

export default Home;
