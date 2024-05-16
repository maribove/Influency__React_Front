import "./EditProfile.css";
import { uploads } from "../../utils/config";

// hooks
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Redux
import { profile, resetMessage, updateProfile } from "../../slices/userSlice";

// Components
import Message from '../../components/Message';

const EditProfile = () => {

    const dispatch = useDispatch();
    const { user, message, error, loading } = useSelector((state) => state.user);

    // states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [type, setType] = useState("");
    const [password, setPassword] = useState("");
    const [profileImage, setprofileImage] = useState("");
    const [bio, setBio] = useState("");
    const [previewImage, setpreviewImage] = useState("");
    const [imageType, setImageType] = useState("");

    // carregar dados do usuário
    useEffect(() => {
        dispatch(profile());
    }, [dispatch]);

    // preencher campos com dados do usuário 
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setBio(user.bio);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // pegar dados do usuário e colocar em um objeto
        const userData = { name };

        if (profileImage) {
            userData.profileImage = profileImage;
        }

        if (bio) {
            userData.bio = bio;
        }

        if (password) {
            userData.password = password;
        }

        // form data
        const formData = new FormData();
        const userFormData = Object.keys(userData).forEach((key) =>
            formData.append(key, userData[key])
        );
        formData.append("user", userFormData);

        await dispatch(updateProfile(formData));

        setTimeout(() => {
            dispatch(resetMessage());
        }, 2000);
    };

    const handleFile = (e) => {
        // preview imagem 
        const image = e.target.files[0];
        setpreviewImage(image);

        // Verificar o tipo de arquivo
        const fileType = image.type.split("/")[1];
        if (!["png", "jpg", "jpeg"].includes(fileType)) {
            setImageType(fileType);
        } else {
            setprofileImage(image);
            setImageType("");
        }
    };

    return (
        <div id="formulario">
            <h1>Edite seus dados</h1>

            {/* preview da imagem */}
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
                    <span>Alterar senha:</span>
                    <input
                        type="password"
                        placeholder="Digite uma nova senha"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password || ""}
                    />
                </label>
                {imageType && (
                    <div className="file-warning">
                        Formato de arquivo não suportado: {imageType.toUpperCase()}
                        <br />
                        Selecione um arquivo PNG, JPG ou JPEG.
                    </div>
                )}

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
