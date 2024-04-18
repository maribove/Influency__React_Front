import "./Profile.css";

import { uploads } from "../../utils/config";

// components
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { BsFillEyeFill, BsPencilFill, BsXLg } from "react-icons/bs";
import { MdDelete } from "react-icons/md";


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

  const [title, setTitle] = useState();
  const [desc, setdesc] = useState();
  const [image, setImage] = useState();

  // const [editId, setEditId] = useState();
  // const [editImage, setEditImage] = useState();
  // const [editTitle, setEditTitle] = useState();
  // const [editDesc, setEditdesc] = useState();

  // New form and edit form refs
  const newPhotoForm = useRef();
  const editPhotoForm = useRef();

  // Load user data
  useEffect(() => {
    dispatch(getUserDetails(id));
    dispatch(getUserPhotos(id));
  }, [dispatch, id]);

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

  // Verifica se uma imagem foi selecionada
  if (!image) {
    alert("Por favor, selecione uma imagem para enviar.");
    return;
  }

  // Verifica se o formato da imagem é suportado
  const supportedFormats = ["image/jpeg", "image/jpg", "image/png"];
  if (!supportedFormats.includes(image.type)) {
    alert("Formato de imagem não suportado. Por favor, selecione um arquivo JPG, JPEG ou PNG.");
    return;
  }

  const photoData = {
    title,
    desc,
    image,
  };

  // build form data
  const formData = new FormData();

  const photoFormData = Object.keys(photoData).forEach((key) =>
    formData.append(key, photoData[key])
  );

  formData.append("photo", photoFormData);

  dispatch(publishPhoto(formData));

  setTitle("");
  setImage(null); // Limpa o estado da imagem

  resetComponentMessage();
};

  // mudae image state
  const handleFile = (e) => {
    const image = e.target.files[0];

    setImage(image);
  };

  // Excluir
  const handleDelete = (id) => {
    dispatch(deletePhoto(id));

    resetComponentMessage();
  };



  if (loading) {
    return <p>Carregando...</p>;
  }


  return (
    <div id="formulario">
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
            <h1>Compartilhe uma vaga:</h1>
            <form onSubmit={submitHandle}>
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
                <span>Descrição para a foto:</span>
                <textarea
                  type="text"
                  placeholder="Insira uma descrição"
                  onChange={(e) => setdesc(e.target.value)}
                  value={desc || ""}
                />
              </label>
              <label>
                <span>Imagem:</span>
                <input type="file" onChange={handleFile} />
              </label>
              
              
              {!loadingPhoto && <input type="submit" value="Postar" className="btn" />}
              {loadingPhoto && <input type="submit" disabled value="Aguarde..." />}
              
            </form>
         
          </div>
{errorPhoto && <Message msg={errorPhoto} type="error" />}
              {messagePhoto && <Message msg={messagePhoto} type="sucess" />}

        </>
      )}

      <div className="user-photos">
        <h2 className="titulo">Minhas vagas publicadas:</h2>
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
                <p><strong>Descrição:</strong> {photo.desc}</p>
              </div>
              {id === userAuth._id ? (
                <div className="actions">
                  <Link to={`/photos/${photo._id}`}>
                    <BsFillEyeFill size="40px" />
                  </Link>
                  <MdDelete size="40px" onClick={() => handleDelete(photo._id)} />
                </div>
              ) : (
                <Link className="btn" to={`/photos/${photo._id}`}>
                  Ver
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
