import "./PostItem.css";
import { uploads } from "../utils/config";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { FaTrash, FaEdit, FaComment } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { deletePost, updatePost, comment, resetMessage } from "../slices/postSlice";
import { useState } from 'react';

// Modal para confirmação de exclusão
const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Confirmar Exclusão</h3>
        <p>Você tem certeza que deseja excluir este post?</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="btn-excluir">Sim</button>
          <button onClick={onClose} className="btn-nao">Não</button>
        </div>
      </div>
    </div>
  );
};

// Modal para edição do post com fundo blurry
const EditModal = ({ isOpen, onClose, onConfirm, editPublicacao, setEditPublicacao }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content edit-modal">
        <h3>Editar Publicação</h3>
        <textarea
          className="edit-textarea"
          value={editPublicacao}
          onChange={(e) => setEditPublicacao(e.target.value)}
        />
        <div className="modal-buttons">
          <button onClick={onConfirm} className="btn-confirma">Confirmar</button>
          <button onClick={onClose} className="btn-cancelar">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

const PostItem = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { user: userAuth } = useSelector((state) => state.auth);
  const [editMode, setEditMode] = useState(false);
  const [editPublicacao, setEditPublicacao] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // Controle do modal de exclusão
  const [editModalOpen, setEditModalOpen] = useState(false); // Controle do modal de edição

  const handleDelete = (id) => {
    dispatch(deletePost(id));
    setModalOpen(false);
    resetComponentMessage();
  };

  const handleEdit = () => {
    setEditPublicacao(post.publicacao);
    setEditModalOpen(true);
    setDropdownVisible(false);
    resetComponentMessage();
  };

  const handleUpdate = () => {
    const postData = { publicacao: editPublicacao, id: post._id };
    dispatch(updatePost(postData));
    setEditModalOpen(false); // Fechar modal após confirmação
    resetComponentMessage();
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    const commentData = { comment: newComment, id: post._id };
    dispatch(comment(commentData));
    setNewComment("");
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
        {post.profileImage && (
          <img src={`${uploads}/users/${post.profileImage}`} alt={post.userName} className="profilepic" />
        )}
        <div className="profile-description">
          <h2 className="name_user">{post.userName}</h2>
        </div>
        {userAuth && (userAuth._id === post.userId || user.role === 'admin') && (
          <div className="options-menu" onClick={toggleDropdown}>
            <BsThreeDots className="pontinhos" />
          </div>
        )}
      </div>

      {dropdownVisible && (
        <div className="dropdown">
          {userAuth && userAuth._id === post.userId && (
            <button onClick={handleEdit} className="btn-delete">
              <FaEdit className="lapis" /> Editar
            </button>
          )}
          {userAuth && (userAuth._id === post.userId || userAuth.role === 'admin') && (
            <button onClick={() => setModalOpen(true)} className="btn-delete">
              <FaTrash className="lixo" /> Excluir
            </button>
          )}
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
      </div>

      <div className="comments-icon" onClick={() => setShowComments(!showComments)}>
        <span>{Array.isArray(post.comments) ? post.comments.length : 0}</span>
        <FaComment className="comment-icon" />
      </div>

      {showComments && (
        <div className="comments-section">
          {Array.isArray(post.comments) && post.comments.length > 0 && post.comments.map((comment, index) => (
            <div className="comment" key={index}>
              {comment.userImage && (
                <img src={`${uploads}/users/${comment.userImage}`} alt={comment.userName} className="comment-profilepic" />
              )}
              <div className="comment-content">
                <p className="comment-author">{comment.userName}</p>
                <p className="comment-text">{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <form className="comment-form" onSubmit={handleAddComment}>
        <textarea
          className="comment-textarea"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Adicionar um comentário..."
        />
        <button type="submit" className="btn-comentar">Comentar</button>
      </form>

      {/* Modal de exclusão */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => handleDelete(post._id)}
      />

      {/* Modal de edição */}
      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onConfirm={handleUpdate}
        editPublicacao={editPublicacao}
        setEditPublicacao={setEditPublicacao}
      />
    </div>
  );
};

export default PostItem;
