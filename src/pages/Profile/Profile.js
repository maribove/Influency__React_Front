import "./Profile.css";

import { uploads } from "../../utils/config";

// Components
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { BsFillEyeFill, BsPencilFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { FaCircleDot } from "react-icons/fa6";
import { FaTrash, FaEdit } from "react-icons/fa";
import { FaCheck, FaPlus } from "react-icons/fa";

// Hooks
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
  getApplicants,
  selectInfluencer
} from "../../slices/photoSlice";

// Modal de confirmação
const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Confirmar Exclusão</h3>
        <p>Você tem certeza que deseja excluir esta vaga?</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="btn-excluir">Sim</button>
          <button onClick={onClose} className="btn-nao">Não</button>
        </div>
      </div>
    </div>
  );
};

const ApplicantModal = ({ isOpen, onClose, applicants, photoId, onSelectInfluencer }) => {
  const { user } = useSelector((state) => state.auth);

  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Inscritos na Vaga</h3>
        {applicants?.length > 0 ? (
          applicants.map((applicant) => (
            <div key={applicant.userId._id} className="applicant-item">
              {applicant.userId.profileImage && (
                <img
                  src={`${uploads}/users/${applicant.userId.profileImage}`}
                  alt={applicant.userId.name}
                  className="applicant-profile-image"
                />
              )}
              <Link to={`/${applicant.userId._id}/profile`}>
                <p>{applicant.userId.name}</p>
              </Link>
              {user.role === "Empresa" && (
                <button
                  onClick={() => onSelectInfluencer(photoId, applicant.userId._id)}
                  disabled={applicant.userId._id === photoId?.selectedInfluencer}
                  className={`icon-button ${applicant.userId._id === photoId?.selectedInfluencer ? 'selected' : ''}`}
                >
                  {applicant.userId._id === photoId?.selectedInfluencer ? (
                    <FaCheck className="icon-check" />
                  ) : (
                    <FaPlus className="icon-plus" />
                  )}
                </button>
              )}
            </div>
          ))
        ) : (
          <p>Nenhum inscrito encontrado.</p>
        )}
        <button onClick={onClose} className="btn-excluir">Fechar</button>
      </div>
    </div>
  ) : null;
};



const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { user, loading, users } = useSelector((state) => state.user);
  const { user: userAuth } = useSelector((state) => state.auth);
  const {
    photos,
    loading: loadingPhoto,
    error: errorPhoto,
    message: messagePhoto,
  } = useSelector((state) => state.photo);



  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [local, setLocal] = useState("");
  const [desc, setDesc] = useState("");
  const [situacao, setSituacao] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [valor, setValor] = useState("");
  const [imageType, setImageType] = useState("");
  const [contrato, setContrato] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [editId, setEditId] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editValor, setEditValor] = useState("");
  const [editLocal, setEditLocal] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editSituacao, setEditSituacao] = useState("");
  const [editContrato, setEditContrato] = useState("");

  const [currentApplicants, setCurrentApplicants] = useState([]);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [currentPhotoId, setCurrentPhotoId] = useState(null);

  const getActivePhotos = () => {
    return photos.filter(photo => photo.situacao !== "Encerrada");
  };


  const handleTagsChange = (e) => {
    const value = e.target.value;
    setTags((prevTags) =>
      prevTags.includes(value)
        ? prevTags.filter((tag) => tag !== value)
        : [...prevTags, value]
    );
  };

  const newPhotoForm = useRef();
  const editPhotoForm = useRef();

  useEffect(() => {
    dispatch(getUserDetails(id));
    dispatch(getUserPhotos(id));
    if (messagePhoto === "Vaga publicada com sucesso!") {
      setTitle("");
      setDesc("");
      setLocal("");
      setValor("");
      setSituacao("");
      setDate("");
      setImage(null);
      setContrato(null);
    }
  }, [dispatch, id, messagePhoto]);

  function resetComponentMessage() {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 4000);
  }


  const handleViewApplicants = (photoId) => {
    setCurrentPhotoId(photoId);
    dispatch(getApplicants({ id: photoId, token: userAuth.token }))
      .then((res) => {
        if (res.payload?.applicants) {
          setCurrentApplicants(res.payload.applicants);
          setShowApplicantsModal(true);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar inscritos:", error);
        setCurrentApplicants([]);
        setShowApplicantsModal(true);
      });
  };

  const handleSelectInfluencer = (photoId, influencerId) => {
    dispatch(selectInfluencer({ photoId, influencerId, token: userAuth.token }))
      .then((res) => {
        if (res.payload) {
          // Atualiza a lista de inscritos após a seleção do influenciador
          handleViewApplicants(photoId);
          dispatch(getUserPhotos(id)); // Atualiza a lista de fotos do usuário
        }
        resetComponentMessage();
      })
      .catch((error) => {
        console.error("Erro ao selecionar influenciador:", error);
      });
  };

  const handleCloseApplicantsModal = () => {
    setShowApplicantsModal(false);
  };

  const handleDeleteClick = (photoId) => {
    setPhotoToDelete(photoId);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (photoToDelete) {
      dispatch(deletePhoto(photoToDelete)).then(() => {
        resetComponentMessage();
      });
    }
    setModalOpen(false);
    setPhotoToDelete(null);
  };

  const handleCancelDelete = () => {
    setModalOpen(false);
    setPhotoToDelete(null);
  };

  const submitHandle = (e) => {
    e.preventDefault();

    const photoData = {
      title,
      tags,
      desc,
      local,
      valor,
      situacao,
      date,
      image,
      contrato,
    };

    const formData = new FormData();
    Object.keys(photoData).forEach((key) => formData.append(key, photoData[key]));

    dispatch(publishPhoto(formData));
    resetComponentMessage();
  };

  const handleFile = (e) => {
    const image = e.target.files[0];
    if (image) {
      const fileType = image.type.split("/")[1];
      if (!["png", "jpg", "jpeg"].includes(fileType)) {
        setImageType(fileType);
      } else {
        setImage(image);
        setImageType("");
      }
    }
  };

  const handleContractFile = (e) => {
    const file = e.target.files[0];
    setContrato(file);
  };



  const hideOrShowForms = () => {
    newPhotoForm.current.classList.toggle("hide");
    editPhotoForm.current.classList.toggle("hide");
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const photoData = {
      title: editTitle,
      contrato: editContrato,
      desc: editDesc,
      valor: editValor,
      local: editLocal,
      situacao: editSituacao,
      date: editDate,
      id: editId,
    };

    dispatch(updatePhoto(photoData));
    resetComponentMessage();
  };

  const handleEdit = (photo) => {
    if (editPhotoForm.current.classList.contains("hide")) {
      hideOrShowForms();
    }
    setEditId(photo._id);
    setEditImage(photo.image);
    setEditContrato(photo.contrato);
    setEditTitle(photo.title);
    setEditDesc(photo.desc);
    setEditLocal(photo.local);
    setEditValor(photo.valor);
    setEditDate(photo.date);
    setEditSituacao(photo.situacao);

    document.getElementById("editForm").scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    hideOrShowForms();
  };


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
          {user.portfolio && (
            <a
              href={`${uploads}/portfolios/${user.portfolio}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-portfolio"
            >
              Visualizar Portfólio
            </a>
          )}
        </div>
      </div>
      {id === userAuth._id && (
        <>
          {/* Formulário para adicionar nova vaga */}
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
                  required
                />
              </label>

              <label>
                <span>Descrição para a vaga*:</span>
                <textarea
                  placeholder="Insira uma descrição"
                  onChange={(e) => setDesc(e.target.value)}
                  value={desc}
                  required
                />
              </label>


              <label>
                <span>Tags*:</span>
                <div>
                  {["Moda", "Beleza", "Saúde", "Alimentação", "Viagens", "Animais", "Meio Ambiente", "Estudos"].map(tag => (
                    <label key={tag} className="content">
                      <input
                      className="content_input"
                        type="checkbox"
                        name={tag}
                        value={tag}
                        onChange={handleTagsChange}
                      />
                      {tag}
                    </label>
                  ))}
                </div>
              </label>


              <label>
                <span>Local da vaga*:</span>
                <input
                  type="text"
                  placeholder="Insira o local da vaga"
                  onChange={(e) => setLocal(e.target.value)}
                  value={local}
                  required
                />
              </label>
              <label>
                <span>Data para a finalização*:</span>
                <input
                  type="date"
                  onChange={(e) => setDate(e.target.value)}
                  value={date}
                  required
                />
              </label>

              <label>
                <span>Status da vaga*:</span>
                <select onChange={(e) => setSituacao(e.target.value)} value={situacao} required>
                  <option value="" disabled>
                    Selecione...
                  </option>
                  <option value="Ativo">Ativo</option>

                </select>
              </label>
              <label>
                <span>Valor pago para a vaga*:</span>
                <input
                  type="text"
                  placeholder="Insira o valor da vaga"
                  onChange={(e) => setValor(e.target.value)}
                  value={valor}
                  required
                />
              </label>

              <label>
                <span>Imagem da vaga:</span>
                <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleFile} />
              </label>

              <label>
                <span>Contrato (PDF):</span>
                <input type="file" accept="application/pdf" onChange={handleContractFile} />
              </label>

              <div className="btn-container">
                {!loadingPhoto && <input type="submit" value="Publicar" className="btn" />}
                {loadingPhoto && <input type="submit" disabled value="Aguarde..." />}
              </div>
              <p className="campo_obrigatorio">* Campo Obrigatório</p>
            </form>
          </div>

          {/* Formulário de edição de vaga */}
          <div className="edit-photo hide" ref={editPhotoForm} id="editForm">
            <h1>Editando vaga</h1>
            {editImage && (
              <img
                src={`${uploads}/photos/${editImage}`}
                alt={editTitle}
                className="edit_img"
              />
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
                <textarea
                  onChange={(e) => setEditDesc(e.target.value)}
                  value={editDesc || ""}
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
                  type="date"
                  onChange={(e) => setEditDate(e.target.value)}
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

              <label>
                <span>Valor pago para a vaga:</span>
                <input
                  type="text"
                  placeholder="Insira o valor da vaga"
                  onChange={(e) => setEditValor(e.target.value)}
                  value={editValor || ""}
                />
              </label>

              <label>
                <span>Contrato (PDF):</span>
                <input type="file" accept="application/pdf" onChange={(e) => setEditContrato(e.target.files[0])} />
              </label>

              <div className="btn-container">
                <input type="submit" value="Atualizar" className="btn" />
                <button type="button" className="btn" onClick={handleCancelEdit}>Cancelar</button>
              </div>
            </form>


          </div>
          {/* 
          
          

          {/* Mensagens de erro/sucesso */}
          {errorPhoto && <Message msg={errorPhoto} type="error" />}
          {messagePhoto && <Message msg={messagePhoto} type="sucess" />}
        </>



      )}


      <Modal
        isOpen={modalOpen}
        onClose={handleCancelDelete}
        onConfirm={confirmDelete}
      />

      <ApplicantModal
        isOpen={showApplicantsModal}
        onClose={() => setShowApplicantsModal(false)}
        applicants={currentApplicants}
        photoId={currentPhotoId}
        onSelectInfluencer={handleSelectInfluencer}
      />


      {/* Seção de Suas Vagas */}
      <div className="user-photos">
        <h2 className="titulo-vagas">Suas Vagas:</h2>
        {photos && photos.length > 0 ? (
          <div className="vagas-list">
            {photos.map((photo) => (
              <div
                className={`vaga-card ${photo.situacao === "Encerrada" ? "vaga-encerrada" : ""}`}
                key={photo._id}
              >
                {photo.image && (
                  <img
                    className="imagemVaga"
                    src={`${uploads}/photos/${photo.image}`}
                    alt={photo.title}
                  />
                )}
                <div className="vaga-info">
                  <h3 className="vaga-title">{photo.title}</h3>
                  <p className="p-align"><strong>Local:</strong> {photo.local}</p>
                  <p className="p-align">
                    <strong>Status:</strong> {photo.situacao}
                    <FaCircleDot
                      className={photo.situacao === "Encerrada" ? "encerrado" : "ativo"}
                      size="14.7px"
                    />
                  </p>
                  <p className="p-align"><strong>Data finalização:</strong> {photo.date}</p>
                  <p className="p-align"><strong>Descrição:</strong> {photo.desc}</p>
                  <p className="p-align"><strong>Valor da vaga:</strong> {photo.valor}</p>
                  <p className="p-align">
                    <strong>Influenciador selecionado:</strong> {photo.selectedInfluencer?.userName || 'Nenhum influenciador selecionado'}
                  </p>
                  <p className="p-align"><strong>Tags:</strong> {photo.tags.join(", ")}</p>
                  {photo.contrato && (
                    <a
                      href={`${uploads}/contratos/${photo.contrato}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-contrato"
                    >
                      Contrato
                    </a>
                  )}
                </div>
                {id === userAuth._id && photo.situacao !== "" && (
                  <div className="vaga-actions">
                    <button className="action-btn" onClick={() => handleViewApplicants(photo._id)}>
                      <BsFillEyeFill />
                    </button>
                    <button
                      onClick={() => handleEdit(photo)}
                      className="action-btn"
                      title="Editar Vaga"
                    >
                      <FaEdit size="20px" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(photo._id)}
                      className="action-btn"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>
            <strong>Ainda não há vagas publicadas :(</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
