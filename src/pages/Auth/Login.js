import "./Auth.css";


import { FaEye, FaEyeSlash } from "react-icons/fa6";



// Components
import { Link } from "react-router-dom";
import Message from "../../components/Message";

// Hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux
import { login, reset } from "../../slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      email,
      password,
    };

    console.log(user);

    dispatch(login(user));
  };

  // Clean all auth states
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (

    <div id='formulario1'>
      <div className="logo-container">
        <img src="/logo_influency_pq.png" alt="Logo Influency" className="logo" />
      </div>
      <div className="form-container">
        <h1>Entrar</h1>
        <p>Faça o login e construa conexões poderosas! </p>
        <form onSubmit={handleSubmit} >
          <label>
            <span>Email:</span>
            <input type="email" required placeholder='Email' onChange={(e) => setEmail(e.target.value)} value={email || ''} />
          </label>
          <label className="password-input">
            <span>Senha:</span>
            <div className="input-container">
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
                {showPassword ? <FaEyeSlash size="25px" className="eye-icon" /> : <FaEye size="25px" className="eye-icon" />}
              </button>
            </div>
            <div className="btn-container">
            {!loading && <button className='btn'>Entrar</button>}
            {loading && <button className='btn'>Aguarde...</button>}
          </div>
          </label>
          
          {error && <Message msg={error} type="error" />}
          <a className='esquecisenha' href='/esquecisenha'>Esqueci a senha</a>
          <p className='entre'>Não tem cadastro? <Link to='/register'>Cadastrar</Link> </p>



        </form>
      </div>
    </div>


  )
}
export default Login