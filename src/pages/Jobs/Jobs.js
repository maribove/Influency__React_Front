import './Jobs.css';

import { uploads } from "../../utils/config";

// components
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { BsFillEyeFill, BsPencilFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { FaCircleDot } from "react-icons/fa6";
import { FaTrash, FaEdit } from "react-icons/fa";

// hooks
import { useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// Redux
import {
    getPhotos,
    getUserPhotos,
    publishPhoto,
    resetMessage,
    deletePhoto,
    updatePhoto,
    applyToJob,
    cancelApplication,
    getApplicants,

} from "../../slices/photoSlice";


const Jobs = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // ID vaga
  
  const [filterTags, setFilterTags] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [appliedJobs, setAppliedJobs] = useState(false); // Verificar se o influenciador já aplicou
  
  const { photos, applicants, loading, error } = useSelector((state) => state.photo);
  const { user: userAuth } = useSelector((state) => state.auth);

  const handleDelete = (id) => {
    dispatch(deletePhoto(id));

    resetComponentMessage();
  };

  const handleApply = (photoId) => {
    if (appliedJobs[photoId]) {
      dispatch(cancelApplication({ id: photoId, token: userAuth.token }));
    } else {
      dispatch(applyToJob({ id: photoId, token: userAuth.token }));
    }

    setAppliedJobs((prevState) => ({
      ...prevState,
      [photoId]: !appliedJobs[photoId], // Alterar o estado só pra vaga correspondente
    }));
  };

  function resetComponentMessage() {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 4000);
  }

  useEffect(() => {
    if (userAuth && userAuth.token) {
      dispatch(getPhotos());
  
      // Verificar se o usuário é um influenciador que já aplicou
      if (userAuth.role === "Influenciador") {
        dispatch(getApplicants({ id, token: userAuth.token }));
      }
    }
  }, [dispatch, userAuth, id]);

  useEffect(() => {
    if (applicants && Array.isArray(applicants)) { // Garantir que applicants é um array
      const appliedMap = {};
      applicants.forEach((applicant) => {
        appliedMap[applicant.photoId] = true;  // Mapeia o estado de aplicação para cada vaga
      });
      setAppliedJobs(appliedMap);
    }
  }, [applicants]);

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
    return <Message msg={error} type="error" />;}

  return (
    <div className="user-photos">
        <h2 className="titulo">Vagas publicadas:</h2>

        {/* Filtros */}
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
        
        {/* Renderizar as vagas filtradas */}

        {filteredPhotos && filteredPhotos.length > 0 ? ( // Verificar se há vagas
          filteredPhotos.map((photo) => (
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

                {/* Lógica para Influenciadores */}
                {userAuth && userAuth.role === "Influenciador" && (
                  <button className='btn' onClick={() => handleApply(photo._id)}>
                    {appliedJobs[photo._id] ? "Cancelar Aplicação" : "Aplicar"}
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
                  
                </div>
          ))
            
        ) : (
            <p><strong>Ainda não há vagas publicadas :(</strong></p>
          )}
          
      </div>
  );
};

export default Jobs;
