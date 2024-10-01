import "./EditProfile.css";
import { uploads } from "../../utils/config";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { profile, resetMessage, updateProfile } from "../../slices/userSlice";
import Message from '../../components/Message';
import { FaInstagram } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";



const EditProfile = () => {
    const dispatch = useDispatch();
    const { user, message, error, loading } = useSelector((state) => state.user);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [interests, setInterests] = useState([]);
    const [password, setPassword] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [bio, setBio] = useState("");
    const [emailcontato, setEmailcontato] = useState("");
    const [instagram, setInstagram] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    const [portfolio, setPortfolio] = useState(null);
    const [previewPDF, setPreviewPDF] = useState("");
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        dispatch(profile());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setBio(user.bio);
            setEmailcontato(user.emailcontato);
            setInstagram(user.instagram);
            setInterests(user.interests || []);

            if (user.portfolio) {
                setPreviewPDF(`${uploads}/portfolios/${user.portfolio}`);
            }
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = { name, interests };

        if (profileImage) {
            userData.profileImage = profileImage;
        }

        if (bio) {
            userData.bio = bio;
        }

        if (emailcontato) {
            userData.emailcontato = emailcontato;
        }

        if (instagram) {
            userData.instagram = instagram;
        }

        if (password) {
            userData.password = password;
        }

        if (portfolio) {
            userData.portfolio = portfolio;
        }

        const formData = new FormData();
        Object.keys(userData).forEach((key) =>
            formData.append(key, userData[key])
        );

        await dispatch(updateProfile(formData));
        setTimeout(() => {
            dispatch(resetMessage());
        }, 2000);
    };

    const handleFile = (e) => {
        const image = e.target.files[0];
        setPreviewImage(image);

        const fileType = image.type.split("/")[1];
        if (!["png", "jpg", "jpeg"].includes(fileType)) {
            alert("Formato de arquivo não suportado. Selecione um arquivo PNG, JPG ou JPEG.");
        } else {
            setProfileImage(image);
        }
    };

    const handlePortfolio = (e) => {
        const file = e.target.files[0];
        if (file.type !== "application/pdf") {
            alert("Por favor, envie apenas arquivos em formato PDF!");
        } else {
            setPortfolio(file);
            setPreviewPDF(URL.createObjectURL(file));
        }
    };

    const handleInterestsChange = (e) => {
        const { value, checked } = e.target;
        setInterests((prevInterests) => {
            if (checked) {
                return [...prevInterests, value];
            } else {
                return prevInterests.filter((interest) => interest !== value);
            }
        });
    };

    // Novo manipulador para abrir a imagem em uma nova aba
    const handleImageClick = () => {
        const imageUrl = previewImage
            ? URL.createObjectURL(previewImage)
            : `${uploads}/users/${user.profileImage}`;
        window.open(imageUrl, "_blank");
    };

    return (
        <div className="profile-container">
            <div className="sidebar">
                {(user.profileImage || previewImage) && (
                    <img
                        className="profile-image"
                        src={
                            previewImage
                                ? URL.createObjectURL(previewImage)
                                : `${uploads}/users/${user.profileImage}`
                        }
                        alt={user.name}
                        onClick={handleImageClick}
                    />
                )}
                <h2 className="nome">{user.name}</h2>
                <p>{user.bio}</p>
               
               
                <button className="btn-edit" onClick={() => setEditing(!editing)}>
                    {editing ? 'Cancelar Edição' : 'Editar Perfil'}
                </button>
            </div>

            <div id="formulario">
                {editing ? (
                    <div id="edit-form" className="edit-form">
                        <h2>Editar Perfil</h2>
                        <form onSubmit={handleSubmit}>
                            <label>
                                <span>Nome*:</span>
                                <input
                                    type="text"
                                    placeholder="Nome"
                                    onChange={(e) => setName(e.target.value)}
                                    value={name || ""}
                                />
                            </label>
                            <label>
                                <span>Email:</span>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    disabled
                                    value={email || ""}
                                />
                            </label>

                            <label>
                                <span>Foto de perfil:</span>
                                <input
                                    type="file"
                                    onChange={handleFile}
                                />
                            </label>
                            <label>
                                <span>Biografia:</span>
                                <textarea
                                    type="text"
                                    placeholder="Fale um pouco sobre você.."
                                    onChange={(e) => setBio(e.target.value)}
                                    value={bio || ""}
                                />
                            </label>

                            <label>
                                <span>Instagram:</span>
                                <input
                                    type="text"
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        if (!value.startsWith("@")) {
                                            value = "@" + value;
                                        }
                                        setInstagram(value);
                                    }}
                                    value={instagram || ""}
                                />
                            </label>

                            <label>
                                <span>Email para contato:</span>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={emailcontato || ""}
                                    onChange={(e) => setEmailcontato(e.target.value)} 
                                />
                            </label>


                            <label>
                                <span>Seus interesses:</span>
                                <div>
                                    {["Moda", "Beleza", "Saúde", "Alimentação", "Viagens", "Animais", "Meio Ambiente", "Estudos"].map((interest) => (
                                        <label className="content" key={interest}>
                                            <input
                                                className="content_input"
                                                type="checkbox"
                                                name={interest}
                                                value={interest.toLowerCase()}
                                                checked={interests.includes(interest.toLowerCase())}
                                                onChange={handleInterestsChange}
                                            />
                                            {interest}
                                        </label>
                                    ))}
                                </div>
                            </label>

                            <label>
                                <span>Alterar senha:</span>
                                <input
                                    type="password"
                                    placeholder="Digite uma nova senha"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password || ""}
                                />
                            </label>

                            <label>
                                <span>Meu Portfólio (PDF):</span>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handlePortfolio}
                                />
                            </label>

                            <div className="btn-container">
                                {!loading && <button className='btn'>Atualizar</button>}
                                {loading && <button className='btn'>Aguarde...</button>}
                            </div>
                        </form>
                        {error && <Message msg={error} type="error" />}
                        {message && <Message msg={message} type="sucess" />}
                    </div>
                ) : (
                    <div className="profile-details">
                        <section id="bio">
                            <h2>Biografia</h2>
                            <p>{user.bio || "Biografia não definida"}</p>
                        </section>

                        <section id="redes">
                            <h2>Contato</h2>
                            <p> <FaInstagram  className="icon-rede"/> {user.instagram || ""}</p>
                            <p><MdOutlineEmail className="icon-rede" /> {user.emailcontato || ""}</p>
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
                                    <button className="btn-portfolio" onClick={() => window.open(previewPDF, "_blank")}>
                                        Visualizar PDF
                                    </button>
                                </div>
                            ) : (
                                <p>Portfólio não disponível</p>
                            )}
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditProfile;
