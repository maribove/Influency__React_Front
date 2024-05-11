import React from 'react';
import './Home.css';
import { uploads } from "../../utils/config";

// components
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { BsFillEyeFill, BsPencilFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { FaCircleDot } from "react-icons/fa6";

// hooks
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// Redux
import { getUserDetails } from "../../slices/userSlice";
import {
  getUserPosts,
  publishPost,
  resetMessage,
  deletePost,
  updatePost,

} from "../../slices/postSlice";

const Home = () => {
  const { id } = useParams();



  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { user: userAuth } = useSelector((state) => state.auth);
  const {
    
    loading,
    error: errorpost,
    message: messagepost,
  } = useSelector((state) => state.photo);

  const [publicacao, setPublicacao] = useState("");
  const [image, setImage] = useState("");
  const [imageType, setImageType] = useState("");




  const [editId, setEditId] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editPublicacao, setEditPublicacao] = useState("");




  // New form and edit form refs
  const newPostForm = useRef();
  const editPostForm = useRef();

  // Load user data
  useEffect(() => {
    dispatch(getUserDetails(id));
    dispatch(getUserPosts(id));
  }, [dispatch, id]);

  // Reset componente
  function resetComponentMessage() {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 4000);
  }

  // Publicae vaga 
  // Publicae vaga 
  const submitPost = (e) => {
    e.preventDefault();

    const postData = {
      publicacao,

    };

    // build form data
    const formData = new FormData();

    const postFormData = Object.keys(postData).forEach((key) =>
      formData.append(key, postData[key])
    );

    formData.append("post", postFormData);

    dispatch(publishPost(formData));



    resetComponentMessage();
  };

  // mudae image state
  const handleFile = (e) => {
    const image = e.target.files[0];

    // Verificar o tipo de arquivo
    const fileType = image.type.split("/")[1];
    if (!["png", "jpg", "jpeg"].includes(fileType)) {
      setImageType(fileType);
    } else {
      setImage(image);
      setImageType("");
    }

    setImage(image);
  };

  // Excluir
  const handleDelete = (id) => {
    dispatch(deletePost(id));

    resetComponentMessage();
  };

  // mostrar ou escondeer form
  const hideOrShowForms = () => {
    newPostForm.current.classList.toggle("hide")
    editPostForm.current.classList.toggle("hide")
  }

  // update
  const handleUpdate = (e) => {
    e.preventDefault();

    const postData = {
      publicacao: editPublicacao,
      id: editId,
    };

    dispatch(updatePost(postData));

    resetComponentMessage();
  };

  // abrir edição
  const handleEdit = (post) => {
    if (editPostForm.current.classList.contains("hide")) {
      hideOrShowForms();
    }
    setEditId(post._id)
    setEditImage(post.image)
    setEditPublicacao(post.title)


    // Scroll para a seção de edição
    document.getElementById("editForm").scrollIntoView({ behavior: "smooth" });
  }

  const handleCancelEdit = (e) => {
    hideOrShowForms();

  }




  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div id='formulario'>

      <h2>Seja bem-vindo à Influency, o lugar onde sua influência se torna poderosa!</h2>
      <div className="new-photo">
        <form onSubmit={submitPost}>
          <label>

            <textarea
              type="text"
              placeholder="O que deseja compartilhar?"
              onChange={(e) => setPublicacao(e.target.value)}
              value={publicacao}
            />
          </label>
          <div className="btn-container">
            {!loading && <input type="submit" value="Compartilhar" className="btn-compartilhar" />}
            {loading && <input type="submit" disabled value="Aguarde..." />}
            {errorpost && <Message msg={errorpost} type="error" />}
            {messagepost && <Message msg={messagepost} type="sucess" />}
          </div>

        </form>
      </div>
    </div>
  );
}

export default Home;