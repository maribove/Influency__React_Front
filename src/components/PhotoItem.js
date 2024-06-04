import { uploads } from "../utils/config";

import { Link } from "react-router-dom";

const PhotoItem = ({ photo }) => {
  return (
    <div className="photo-item">
      {photo.image && (
        <img className="img-photo" src={`${uploads}/photos/${photo.image}`} alt={photo.title} />
      )}
      <h4>Vaga</h4>
      <h2>{photo.title}</h2>
      <p className="photo-author">
        Publicada por: <strong>{photo.userName} </strong>  
      
      </p>
    </div>
  );
};

export default PhotoItem;