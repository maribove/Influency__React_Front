import "./PerfilUser.css"; 
import { uploads } from "../../utils/config";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserDetails } from "../../slices/userSlice";
import { FaInstagram } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { useParams } from "react-router-dom";

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
    const [previewPDF, setPreviewPDF] = useState("");
    const [showWhatsAppChat, setShowWhatsAppChat] = useState(false);

    useEffect(() => {
        dispatch(getUserDetails(id)); 
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
        event.preventDefault(); // Previne o comportamento padrão do link
        setShowWhatsAppChat(true); // Abre o modal
    };

    const closeModal = () => {
        setShowWhatsAppChat(false); // Fecha o modal
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
                <p>{user.bio}</p>
            </div>

            <div id="formulario">
                <section id="bio">
                    <h2>Biografia</h2>
                    <p>{user.bio || "Biografia não definida"}</p>
                </section>

                <section id="contatos">
                    <h2>Contato</h2>
                    {user.instagram && (
                        <p>
                            <a href={`https://instagram.com/${user.instagram}`} target="_blank" rel="noopener noreferrer">
                                <FaInstagram className="icon-rede" /> @{user.instagram}
                            </a>
                        </p>
                    )}
                    {user.emailcontato && (
                        <p><MdOutlineEmail className="icon-rede" /> {user.emailcontato}</p>
                    )}
                    {user.telefone && (
                        <p>
                            <a
                                href="#"
                                onClick={handleWhatsAppClick}
                                className="btn-whatsapp">
                                Entre em contato comigo
                            </a>
                        </p>
                    )}
                </section>

                <section id="portfolio">
                    <h2>Portfólio</h2>
                    {previewPDF ? (
                        <div className="pdf-preview">
                            <iframe
                                src={previewPDF}
                                title="Pré-visualização do Portfólio"
                                width="100%"
                                height="500px"
                            />
                            <button className="btn-whatsapp" onClick={() => window.open(previewPDF, "_blank")}>
                                Visualizar PDF
                            </button>
                        </div>
                    ) : (
                        <p>Portfólio não disponível</p>
                    )}
                </section>
            </div>

            
            <Modal isOpen={showWhatsAppChat} onClose={closeModal} telefone={user.telefone} />
        </div>
    );
}

export default PerfilUser;
