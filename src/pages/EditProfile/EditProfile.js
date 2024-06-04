import "./EditProfile.css";
import { uploads } from "../../utils/config";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { profile, resetMessage, updateProfile } from "../../slices/userSlice";
import Message from '../../components/Message';

const EditProfile = () => {
    const dispatch = useDispatch();
    const { user, message, error, loading } = useSelector((state) => state.user);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [interests, setInterests] = useState([]);
    const [password, setPassword] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [bio, setBio] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    useEffect(() => {
        dispatch(profile());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setBio(user.bio);
            setInterests(user.interests || []);
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

        if (password) {
            userData.password = password;
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

    return (
        <div id="formulario">
            <h1>Edite seus dados</h1>

            {(user.profileImage || previewImage) && (
                <img
                    className="profile-image"
                    src={
                        previewImage
                            ? URL.createObjectURL(previewImage)
                            : `${uploads}/users/${user.profileImage}`
                    }
                    alt={user.name}
                />
            )}
            <p>Adicione uma foto de perfil e fale um pouco sobre você!</p>

            <form onSubmit={handleSubmit}>
                <label>
                    <span>Nome:</span>
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
                        className="ficheiro"
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
                    <span>Seus interesses:</span>
                    <div>
                        {["Moda", "Beleza", "Saúde", "Alimentação", "Viagens", "Animais", "Meio Ambiente", "Estudos"].map((interest) => (
                            <label className="content" key={interest}>
                                <input
                                    
                                    className="content_input"
                                    type="checkbox"
                                    name={interest}
                                    value={interest.toLowerCase() || ""}
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

                <div className="btn-container">
                    {!loading && <button className='btn'>Atualizar</button>}
                    {loading && <button className='btn'>Aguarde...</button>}
                </div>
            </form>
            {error && <Message msg={error} type="error" />}
            {message && <Message msg={message} type="sucess" />}
        </div>
    );
}

export default EditProfile;
