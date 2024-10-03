import "./PerfilUser.css"; 
import { uploads } from "../../utils/config";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserDetails } from "../../slices/userSlice"; // Use getUserDetails aqui
import { FaInstagram } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { useParams } from "react-router-dom";

const PerfilUser = () => {
    const dispatch = useDispatch();
    const { id } = useParams(); 
    const { user } = useSelector((state) => state.user);
    const [previewPDF, setPreviewPDF] = useState("");

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
                                href={`https://wa.me/${user.telefone}`}
                                target="_blank"
                                rel="noopener noreferrer"
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
        </div>
    );
}

export default PerfilUser;
