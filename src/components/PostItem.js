import "./PostItem.css";
import { uploads } from "../utils/config";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { FaTrash, FaEdit } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { deletePost, updatePost, resetMessage } from "../slices/postSlice";
import { useState } from 'react';

const PostItem = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { user: userAuth } = useSelector((state) => state.auth);

  const [showConfirm, setShowConfirm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editPublicacao, setEditPublicacao] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleDelete = (id) => {
    dispatch(deletePost(id));
    setShowConfirm(false);
    resetComponentMessage();
  };

  const handleEdit = () => {
    setEditMode(true);
    setEditPublicacao(post.publicacao);
    setDropdownVisible(false);
    resetComponentMessage();
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const postData = {
      publicacao: editPublicacao,
      id: post._id
    };

    dispatch(updatePost(postData));

    resetComponentMessage();
  };

  function resetComponentMessage() {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  }

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const formatDateTime = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="post-item">
      <div className="profile-header-home">
        {user.profileImage && (
          <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} className="profilepic" />
        )}
        <div className="profile-description">
          <h2 className="name_user">{user.name}</h2>
        </div>
        {userAuth && userAuth._id === post.userId && (
          <div className="options-menu" onClick={toggleDropdown}>
            <BsThreeDots className="pontinhos" />
          </div>
        )}
      </div>

      {dropdownVisible && (
        <div className="dropdown">
          <button onClick={handleEdit} className="btn-edit">
            <FaEdit className="lapis" /> Editar
          </button>
          <button onClick={() => setShowConfirm(true)} className="btn-delete">
            <FaTrash className="lixo" /> Excluir
          </button>
        </div>
      )}

      {editMode ? (
        <textarea
          className="edit-textarea"
          value={editPublicacao}
          onChange={(e) => setEditPublicacao(e.target.value)}
        />
      ) : (
        <p className="texto_publicacao">{post.publicacao}</p>
      )}

      {post.image && (
        <div className="img-container">
          <img className="img-post" src={`${uploads}/posts/${post.image}`} alt={post.publicacao} />
        </div>
      )}
      <div>
        <p className="post-author">
          Publicada por:{" "}
          <Link to={`/users/${post.userId}`}>{post.userName}</Link> em {formatDateTime(post.createdAt)}
        </p>
        {/* {post.updatedAt && post.updatedAt !== post.createdAt && (
          <p className="post-updated">
            Atualizada em: {formatDateTime(post.updatedAt)}
          </p>
        )} */}    {/* atualização do post */}
      
      </div>

      {userAuth && userAuth._id === post.userId && (
        <div className="post-actions">
          {editMode ? (
            <>
              <button onClick={handleUpdate} className="btn-confirm">Salvar</button>
              <button onClick={() => setEditMode(false)} className="btn-cancelar">Cancelar</button>
            </>
          ) : (
            <>
              {showConfirm && (
                <div className="confirm-delete-dialog">
                  <p>Tem certeza que deseja excluir este post?</p>
                  <button onClick={() => handleDelete(post._id)} className="btn-excluir">Sim</button>
                  <button onClick={() => setShowConfirm(false)} className="btn-cancel">Não</button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PostItem;
