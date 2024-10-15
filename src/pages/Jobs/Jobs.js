import './Jobs.css';

import { uploads } from "../../utils/config";

// components
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { BsFillEyeFill, BsPencilFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { FaCircleDot, FaFilter } from "react-icons/fa6";

// hooks
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// Redux
import {
  getPhotos,
  resetMessage,
  deletePhoto,
  applyToJob,  
  cancelApplication, 
  getApplicants,
} from "../../slices/photoSlice";

const Jobs = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // ID da vaga

  const [filterTags, setFilterTags] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState({});
  const [loadingState, setLoadingState] = useState({});

  const { photos, applicants, loading, error } = useSelector((state) => state.photo);
  const { user: userAuth } = useSelector((state) => state.auth);

  const handleDelete = (id) => {
    dispatch(deletePhoto(id));

    resetComponentMessage();
  };

  // Função para aplicar ou cancelar aplicação para uma vaga
  const handleApply = (photoId) => {
    setLoadingState((prev) => ({ ...prev, [photoId]: true }));

    if (appliedJobs[photoId]) {
      dispatch(cancelApplication({ id: photoId, token: userAuth.token }))
        .then(() => {
          setAppliedJobs((prevState) => ({
            ...prevState,
            [photoId]: false, // Define como não aplicado
          }));
        })
        .finally(() => setLoadingState((prev) => ({ ...prev, [photoId]: false })));
    } else {
      dispatch(applyToJob({ id: photoId, token: userAuth.token }))
        .then(() => {
          setAppliedJobs((prevState) => ({
            ...prevState,
            [photoId]: true, // Define como aplicado
          }));
        })
        .finally(() => setLoadingState((prev) => ({ ...prev, [photoId]: false })));
    }
  };

  function resetComponentMessage() {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 4000);
  }

  useEffect(() => {
    if (userAuth && userAuth.token) {
      dispatch(getPhotos());

      // Verifica se o usuário é influenciador e puxa os aplicantes
      if (userAuth.role === "Influenciador") {
        photos.forEach((photo) => {
          dispatch(getApplicants({ id: photo._id, token: userAuth.token }))
            .then((response) => {
              const { applied } = response.payload;
              setAppliedJobs((prevState) => ({
                ...prevState,
                [photo._id]: applied, // Atualiza o estado de aplicação com base na resposta
              }));
            });
        });
      }
    }
  }, [dispatch, userAuth]);

  // Função para aplicar os filtros
  const filteredPhotos = photos.filter((photo) => {
    return (
      (filterTags === "" || photo.tags.join(" ").toLowerCase().includes(filterTags.toLowerCase())) &&
      (filterLocation === "" || photo.local.toLowerCase().includes(filterLocation.toLowerCase()))
    );
  });

  if (loading) {
    return <p>Carregando...</p>;
  }
  if (error) {
    return <Message msg={error} type="error" />;
  }

  return (
    <div id='formulario'>
      <h2 className="titulo">Vagas publicadas:</h2>

      <div className="filter-icon" onClick={() => setShowFilters(!showFilters)}>
        <FaFilter className='iconfiltro' size="30px" style={{ cursor: "pointer" }} />
        <span>Filtrar vagas</span>
      </div>

      {showFilters && (
        <div className="filters">
          <input
            type="text"
            placeholder="Filtrar por tags"
            value={filterTags}
            onChange={(e) => setFilterTags(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filtrar por localização"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          />
        </div>
      )}

      {/* Renderizar as vagas filtradas */}
      {filteredPhotos && filteredPhotos.length > 0 ? (
        filteredPhotos.map((photo) => (
          <div key={photo._id}>
            <div className="infos">
              {photo.image && (
                <img className='imagemVaga'
                  src={`${uploads}/photos/${photo.image}`}
                  alt={photo.title}
                />
              )}
              <h3>{photo.title}</h3>
              <p className="p-align"><strong>Local: </strong> {photo.local}</p>
              <p className="p-align"><strong>Área de atuação: </strong> {photo.atuacao}</p>
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
              <p className="p-align"><strong>Valor da vaga: </strong> {photo.valor}</p>
              <p className="p-align"><strong>Tags: </strong> {photo.tags}</p>
            </div>

            {/* Lógica para Influenciadores */}
            {userAuth && userAuth.role === "Influenciador" && (
              <button className='btn' onClick={() => handleApply(photo._id)} disabled={loadingState[photo._id]}>
                {loadingState[photo._id]
                  ? "Carregando..."
                  : appliedJobs[photo._id]
                    ? "Cancelar Aplicação"
                    : "Aplicar"}
              </button>
            )}

            {/* Lógica para Admins (Empresa) */}
            {userAuth && userAuth.role === "admin" && (
              <div className="actions">
                <BsFillEyeFill size="40px" />
                <MdDelete size="40px" onClick={() => handleDelete(photo._id)} />
              </div>
            )}
          </div>
        ))
      ) : (
        <p><strong>Ainda não há vagas publicadas :(</strong></p>
      )}
    </div>
  );
};

export default Jobs;
