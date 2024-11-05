import "./PerfilUser.css";
import { uploads } from "../../utils/config";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserDetails } from "../../slices/userSlice";
import { getUserPosts } from "../../slices/postSlice"; // Importe a action
import { FaInstagram } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { useParams } from "react-router-dom";
import PostItem from "../../components/PostItem"; // Ajuste o caminho conforme sua estrutura

const Modal = ({ isOpen, onClose, telefone }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Iniciar conversa no WhatsApp</h3>
                <p>Você está prestes a iniciar uma conversa com <strong>{telefone}</strong>.</p>
                <p>
                    <a
                        href={`https://wa.me/${telefone}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        Clique aqui para abrir a conversa no WhatsApp
                    </a>
                </p>
                <button onClick={onClose} className="btn-cancelar">Fechar</button>
            </div>
        </div>
    );
};

const PerfilUser = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { user } = useSelector((state) => state.user);
    const { posts } = useSelector((state) => state.post); // Adicione o selector para posts
    const [previewPDF, setPreviewPDF] = useState("");
    const [showWhatsAppChat, setShowWhatsAppChat] = useState(false);

    useEffect(() => {
        dispatch(getUserDetails(id));
        dispatch(getUserPosts(id)); // Busca os posts do usuário
    }, [dispatch, id]);

    useEffect(() => {
        if (user && user.portfolio) {
            setPreviewPDF(`${uploads}/portfolios/${user.portfolio}`);
        }
    }, [user]);

    const handleImageClick = () => {
        const imageUrl = user.profileImage ? `${uploads}/users/${user.profileImage}` : "#";
        window.open(imageUrl, "_blank");
    };

    const handleWhatsAppClick = (event) => {
        event.preventDefault();
        setShowWhatsAppChat(true);
    };

    const closeModal = () => {
        setShowWhatsAppChat(false);
    };

    return (
        <div className="profile-container">
            <div className="sidebar">
                {user.profileImage && (
                    <img
                        className="profile-image"
                        src={`${uploads}/users/${user.profileImage}`}
                        alt={user.name}
                        onClick={handleImageClick}
                    />
                )}
                <h2 className="nome">{user.name}</h2>
                <p className="infos-user">{user.usuario}</p>
                <p className="infos-user">{user.bio}</p>

                <section id="contatos">

                    {user.instagram && (
                        <p className="infos-user">
                            <a className="infos-user" href={`https://instagram.com/${user.instagram}`} target="_blank" rel="noopener noreferrer">
                                <FaInstagram className="icon-rede" /> @{user.instagram}
                            </a>
                        </p>
                    )}
                    {user.emailcontato && (
                        <p className="infos-user"><MdOutlineEmail className="icon-rede" /> {user.emailcontato}</p>
                    )}
                    {user.telefone && (
                        <p>
                            <a
                                href="#"
                                onClick={handleWhatsAppClick}
                                className="btn">
                                Entre em contato comigo
                            </a>
                        </p>
                    )}
                </section>

                <section id="portfolio">

                    {previewPDF ? (
                        <div className="pdf-preview">

                            <button className="btn" onClick={() => window.open(previewPDF, "_blank")}>
                                Meu portfólio
                            </button>
                        </div>
                    ) : (
                        <p>Portfólio não disponível</p>
                    )}
                </section>
            </div>

            <div id="formulario">





                <section id="user-posts">

                    <div className="posts-container">
                        {posts && posts.length > 0 ? (
                            posts.map((post) => (
                                <PostItem key={post._id} post={post} />
                            ))
                        ) : (
                            <>
                                
                                   <p className="no-posts">{user.usuario} ainda não fez nenhuma publicação!</p>
                                   <img src="/nenhum-post.png" alt="ERRO" />
                                   </>
                                
                                
                          
                        )}
                    </div>
                </section>
            </div>

            <Modal isOpen={showWhatsAppChat} onClose={closeModal} telefone={user.telefone} />
        </div>
    );
}

export default PerfilUser;