import "./Profile.css";

import { uploads } from "../../utils/config";

// components
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { BsFillEyeFill, BsPencilFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { FaCircleDot } from "react-icons/fa6";
import { FaTrash, FaEdit } from "react-icons/fa";

// hooks
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// Redux
import { getUserDetails } from "../../slices/userSlice";
import {
  getUserPhotos,
  publishPhoto,
  resetMessage,
  deletePhoto,
  updatePhoto,

} from "../../slices/photoSlice";



const Profile = () => {
  const { id } = useParams();


  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.user);
  const { user: userAuth } = useSelector((state) => state.auth);
  const {
    photos,
    loading: loadingPhoto,
    error: errorPhoto,
    message: messagePhoto,
  } = useSelector((state) => state.photo);

  const [title, setTitle] = useState("");
  const [atuacao, setAtuacao] = useState("");
  const [tags, setTags] = useState("");
  const [local, setLocal] = useState("");
  const [desc, setdesc] = useState("");
  const [situacao, setSituacao] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [imageType, setImageType] = useState("");
  const [portfolio, setPortfolio] = useState(user.portfolio || "");





  const [editId, setEditId] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editLocal, setEditLocal] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editSituacao, setEditSituacao] = useState("");
  const [editAtuacao, setEditAtuacao] = useState("");


  const handleTagsChange = (e) => {
    const value = e.target.value;
    setTags((prevTags) =>
      prevTags.includes(value)
        ? prevTags.filter((tags) => tags !== value)
        : [...prevTags, value]
    );
  };

  // New form and edit form refs
  const newPhotoForm = useRef();
  const editPhotoForm = useRef();

  // Load user data
  useEffect(() => {
    dispatch(getUserDetails(id));
    dispatch(getUserPhotos(id));
    console.log("User ID:", id); // impressao do  id 
    if (messagePhoto === "Vaga publicada com sucesso!") {
      setTitle("");
      setdesc("");
      setLocal("");
      setSituacao("");
      setDate("");
      setImage("");
      setAtuacao("");

    }
  }, [dispatch, id, messagePhoto]);

  // Reset componente
  function resetComponentMessage() {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 4000);
  }

  // Publicae vaga 
  // Publicae vaga 
  const submitHandle = (e) => {
    e.preventDefault();

    const photoData = {
      title,
      atuacao,
      tags,
      desc,
      local,
      situacao,
      date,
      image,
    };

    // build form data
    const formData = new FormData();

    const photoFormData = Object.keys(photoData).forEach((key) =>
      formData.append(key, photoData[key])
    );

    formData.append("photo", photoFormData);

    dispatch(publishPhoto(formData));



    resetComponentMessage();
  };

  // muda image state
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
    dispatch(deletePhoto(id));

    resetComponentMessage();
  };

  // mostrar ou escondeer form
  const hideOrShowForms = () => {
    newPhotoForm.current.classList.toggle("hide")
    editPhotoForm.current.classList.toggle("hide")
  }

  // update
  const handleUpdate = (e) => {
    e.preventDefault();

    const photoData = {
      title: editTitle,
      atuacao: editAtuacao,
      desc: editDesc,
      local: editLocal,
      situacao: editSituacao,
      date: editDate,
      id: editId,
    };

    dispatch(updatePhoto(photoData));

    resetComponentMessage();
  };

  // abrir edição
  const handleEdit = (photo) => {
    if (editPhotoForm.current.classList.contains("hide")) {
      hideOrShowForms();
    }
    setEditId(photo._id)
    setEditImage(photo.image)
    setEditTitle(photo.title)
    setEditDesc(photo.desc)
    setEditLocal(photo.local)
    setEditDate(photo.date)
    setEditSituacao(photo.situacao)
    setEditAtuacao(photo.atuacao)

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
    <div id="formulario">
      <div className="profile-header">
        {user.profileImage && (
          <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} className="profilepic" />
        )}
        <div className="profile-description">
          <h2>{user.name}</h2>
          <p>{user.bio}</p>
          <p><strong>{user.interests}</strong></p>
          {user.portfolio && (
            <a href={`${uploads}/portfolios/${user.portfolio}`} target="_blank" rel="noopener noreferrer" className="btn">
              Visualizar Portfólio
            </a>
          )}
        </div>
      </div>
      {id === userAuth._id && (
        <>
          <div className="new-photo" ref={newPhotoForm}>
            <h1 className="title">Compartilhe uma vaga:</h1>
            <form onSubmit={submitHandle}>
              <label>
                <span>Título para a vaga*:</span>
                <input
                  type="text"
                  placeholder="Insira um título"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
              </label>

              <label>
                <span>Descrição para a vaga*:</span>
                <textarea
                  type="text"
                  placeholder="Insira uma descrição"
                  onChange={(e) => setdesc(e.target.value)}
                  value={desc}
                />
              </label>
              <label>
                <span>Área de atuação*:</span>
                <input
                  type="text"
                  placeholder="Insira um título"
                  onChange={(e) => setAtuacao(e.target.value)}
                  value={atuacao}
                />
              </label>

              <label>
                <span>Tags*:</span>

                <label className="content">
                  <input className="content_input" type="checkbox" name="Moda" value="Moda" onChange={handleTagsChange} />Moda


                  <input className="content_input" type="checkbox" name="Beleza" value="Beleza" onChange={handleTagsChange} />Beleza

                  <input className="content_input" type="checkbox" name="Saúde" value="Saúde" onChange={handleTagsChange} />Saúde

                  <input className="content_input" type="checkbox" name="Alimentação" value="Alimentação" onChange={handleTagsChange} />Alimentação
                </label>
              </label>

              <label>
                <span>Local da vaga*:</span>
                <input
                  type="text"
                  placeholder="Insira o local da vaga"
                  onChange={(e) => setLocal(e.target.value)}
                  value={local}
                />
              </label>
              <label>
                <span>Data para a finalização*:</span>
                <input type="date" name="data" id="data" onChange={(e) => setDate(e.target.value)}
                  value={date} />
              </label>

              <label>
                <span>Status da vaga*:</span>
                <select onChange={(e) => setSituacao(e.target.value)} value={situacao}>
                  <option value="" disabled>Selecione...</option>
                  <option value="Ativo">Ativo</option>
                </select>
              </label>

              <label>
                <span>Imagem*:</span>
                <input type="file" onChange={handleFile} />
              </label>


              <div className="btn-container">
                {!loadingPhoto && <input type="submit" value="Postar" className="btn" />}
                {loadingPhoto && <input type="submit" disabled value="Aguarde..." />}
              </div>
              <p className="campo_obrigatorio">* Campo Obrigatório</p>


            </form>

            {/* EDIÇÃO */}
          </div>
          <div className="edit-photo hide" ref={editPhotoForm} id="editForm">
            <h1>Editando vaga </h1>
            {editImage && (
              <img src={`${uploads}/photos/${editImage}`} alt={editTitle} className="edit_img" />
            )}

            <form onSubmit={handleUpdate}>
              <label>
                <span>Título para a vaga:</span>
                <input
                  type="text"
                  onChange={(e) => setEditTitle(e.target.value)}
                  value={editTitle || ""}
                />
              </label>
              <label>
                <span>Descrição para a vaga:</span>
                <input
                  type="text"
                  onChange={(e) => setEditDesc(e.target.value)}
                  value={editDesc || ""}
                />
              </label>

              <label>
                <span>Área de atuação:</span>
                <input
                  type="text"
                  onChange={(e) => setEditAtuacao(e.target.value)}
                  value={editAtuacao || ""}
                />
              </label>

              <label>
                <span>Local da vaga:</span>
                <input
                  type="text"
                  onChange={(e) => setEditLocal(e.target.value)}
                  value={editLocal || ""}
                />
              </label>
              <label>
                <span>Data de finalização:</span>
                <input
                  type="date" name="data" id="data" onChange={(e) => setEditDate(e.target.value)}
                  value={editDate || ""}
                />
              </label>
              <label>
                <span>Status da vaga:</span>
                <select onChange={(e) => setEditSituacao(e.target.value)} value={editSituacao}>
                  <option value="" disabled>Selecione...</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Encerrado">Encerrado</option>
                </select>
              </label>

              <div className="btn-container">
                <input type="submit" value="Atualizar" className="btn" />
                <button className="btn-cancel" onClick={handleCancelEdit}>Sair</button>
              </div>
            </form>

          </div>

          {errorPhoto && <Message msg={errorPhoto} type="error" />}
          {messagePhoto && <Message msg={messagePhoto} type="sucess" />}
          {/* 
          {imageType && (
            <div className="file-warning">
              Formato de arquivo não suportado: {imageType.toUpperCase()}
              <br />
              Selecione um arquivo PNG, JPG ou JPEG.
            </div>
          )} */}

        </>
      )}

      <div className="user-photos">
        <h2 className="titulo">Vagas publicadas:</h2>
        {photos &&
          photos.map((photo) => (
            <div className="photo" key={photo._id}>
              <div className="infos">
                {photo.image && (
                  <img
                    src={`${uploads}/photos/${photo.image}`}
                    alt={photo.title}
                  />
                )}
                <h3>{photo.title}</h3>

                <p className="p-align"><strong>Local: </strong> {photo.local}</p>
                <p className="p-align"><strong>Área de atuaçao: </strong> {photo.atuacao}</p>
                <p className="p-align">
                  <strong>Status: </strong> {photo.situacao}
                  {photo.situacao === 'Encerrado' ? (
                    <FaCircleDot className="encerrado" size="14.7px" />
                  ) : (
                    <FaCircleDot className="ativo" size="14.7px" />
                  )}
                </p>
                <p className="p-align"><strong>Data finalização: </strong> {photo.date}</p>
                <p className="p-align"><strong>Descrição: </strong> {photo.desc}</p>
                <p className="p-align"><strong>Tags: </strong> {photo.tags}</p>

              </div>
              {id === userAuth._id ? (
                <div className="actions">


                  <BsFillEyeFill size="40px" />



                  <BsPencilFill onClick={() => handleEdit(photo)} size="40px" />
                  <MdDelete size="40px" onClick={() => handleDelete(photo._id)} />
                </div>
              ) : (
                <Link to={`/photos/${photo._id}`}>

                </Link>
              )}
            </div>
          ))}
        {photos.length === 0 && <p><strong>Ainda não há vagas publicadas :(</strong></p>}
      </div>
    </div>

  );
};

export default Profile;