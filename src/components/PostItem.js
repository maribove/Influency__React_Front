// PostItem.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { FaTrash, FaEdit, FaComment } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { deletePost, updatePost, comment, resetMessage } from "../slices/postSlice";
import { uploads } from "../utils/config";
import LikeContainer from '../../src/components/LikeContainer';

import {like } from "../slices/postSlice";
import "./PostItem.css";

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

// Modal para opções
const OptionsModal = ({ isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content options-modal" onClick={e => e.stopPropagation()}>
        <button onClick={onEdit} className="option-button">
          <FaEdit /> Editar
        </button>
        <button onClick={onDelete} className="option-button">
          <FaTrash /> Excluir
        </button>
      </div>
    </div>
  );
};

const PostItem = ({ post}) => {
  const dispatch = useDispatch();
  const { user} = useSelector((state) => state.user)
  const { user: userAuth } = useSelector((state) => state.auth);
  const [editPublicacao, setEditPublicacao] = useState("");
  const [newComment, setNewComment] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [optionsModalOpen, setOptionsModalOpen] = useState(false);


  const handleLike = (post) => {
    dispatch(like(post._id));
    resetComponentMessage();
  };

  const handleDelete = (id) => {
    setOptionsModalOpen(false);
    setModalOpen(true);
  };

  const handleEdit = () => {
    setEditPublicacao(post.publicacao);
    setOptionsModalOpen(false);
    setEditModalOpen(true);
    resetComponentMessage();
  };

  const handleUpdate = () => {
    const postData = { publicacao: editPublicacao, id: post._id };
    dispatch(updatePost(postData));
    setEditModalOpen(false);
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

  const toggleOptionsModal = () => {
    setOptionsModalOpen(!optionsModalOpen);
  };

  const formatDateTime = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (

    <div className="post-item">
      <div className="post-left">
        <div className="profile-header-home">
          <img
            src={`${uploads}/users/${post.profileImage}`}
            alt={post.userName}
            className="post-user-image"
          />
          <div className="profile-description">
            <h2 className="name_user">{post.userName}</h2>
          </div>
          {userAuth && (userAuth._id === post.userId || userAuth.role === 'admin') && (
            <div onClick={toggleOptionsModal}>
              <BsThreeDots className="pontinhos" />
            </div>
          )}
        </div>

        {post.image && (
          <div className="img-container">
            <img className="img-post" src={`${uploads}/posts/${post.image}`} alt={post.publicacao} />
          </div>
        )}
      </div>

      <div className="post-right">


        <div>

        </div>



        <p className="texto_publicacao">{post.publicacao}</p>

        <p className="post-author">
          Publicada por:{" "}
          <Link to={`/users/${post.userId}`}>{post.userName}</Link> em {formatDateTime(post.createdAt)}
        </p>

        <div className="comments-section">
          <h3>Comentários <FaComment className="comment-icon" /></h3>
          {Array.isArray(post.comments) && post.comments.length > 0 ? (
            post.comments.map((comment, index) => (
              <div className="comment" key={index}>
                {comment.userImage && (
                  <img src={`${uploads}/users/${comment.userImage}`} alt={comment.userName} className="comment-profilepic" />
                )}
                <div className="comment-content">
                  <p className="comment-author">{comment.userName}</p>
                  <p className="comment-text">{comment.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-comments">Sem comentários</p>
          )}
        </div>
        <LikeContainer post={post} user={user} handleLike={handleLike} />
        <form className="comment-form" onSubmit={handleAddComment}>
          <textarea
            className="comment-textarea"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Adicionar um comentário..."
          />
          <button type="submit" className="btn-comentar">Comentar</button>
        </form>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          dispatch(deletePost(post._id));
          setModalOpen(false);
          resetComponentMessage();
        }}
      />

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onConfirm={handleUpdate}
        editPublicacao={editPublicacao}
        setEditPublicacao={setEditPublicacao}
      />

      <OptionsModal
        isOpen={optionsModalOpen}
        onClose={() => setOptionsModalOpen(false)}
        onEdit={handleEdit}
        onDelete={() => handleDelete(post._id)}
      />
    </div>
  );
};

export default PostItem;