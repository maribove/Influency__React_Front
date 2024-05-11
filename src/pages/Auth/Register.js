import "./Auth.css";


import { FaEye, FaEyeSlash  } from "react-icons/fa6";
// Components
import { Link } from "react-router-dom";
import Message from "../../components/Message";

// Hooks
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux
import { register, reset } from "../../slices/authSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      name,
      email,
      password,
      confirmPassword,
    };

    console.log(user);

    dispatch(register(user));
  };

  // Clean all auth states
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <div id='formulario1'>
      <div className="logo-container">
        <img src="/logo_influency_pq.png" alt="Logo Influency" className="logo" />
        <div className="line"></div>
      </div>
      <div className="form-container">
        <h1>Cadastre-se na Influency</h1>
        <h3>Dê o próximo passo para o sucesso!</h3>
        <p>Cadastre-se e explore um mundo de parcerias que podem impulsionar sua carreira!</p>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Nome:</span>
            <input type="text" required placeholder='Nome' onChange={(e) => setName(e.target.value)} value={name || ""} />
          </label>
          <label>
            <span>Email:</span>
            <input type="email" required placeholder='Email' onChange={(e) => setEmail(e.target.value)} value={email || ""} />
          </label>
          <label>
          <span>Senha:</span>
            <div className="input-container2">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Senha"
                value={password || ""}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn-auth"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash   size="25px" className="eye-icon" /> : <FaEye size="25px"  className="eye-icon" />}
              </button>
            </div>
          </label>

          <label>
            <span>Confirmação de senha:</span>
            <div className="input-container2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Confirme a Senha"
                value={confirmPassword || ""}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn-auth"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash size="25px" className="eye-icon" /> : <FaEye size="25px" className="eye-icon" />}
              </button>
            </div>
          </label>
          <div className="btn-container">
            {!loading && <button className='btn'>Cadastrar</button>}
            {loading && <button className='btn'>Aguarde...</button>}
          </div>
          {error && <Message msg={error} type="error" />}
          <p className='entre'>Já tem cadastro? <Link to='/login'>Entre</Link> </p>
        </form>
      </div>
    </div>

  )
}

export default Register