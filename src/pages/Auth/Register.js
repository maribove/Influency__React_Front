import "./Auth.css";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import Message from "../../components/Message";
import { register, reset } from "../../slices/authSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [interests, setInterests] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    const passwordInput = document.querySelector("#passwordInput");

    const handlePasswordStrength = (e) => {
      const password = e.target.value;
      const strengthIndicator = document.querySelector("#password-strength-indicator");
      const strengthText = document.querySelector("#password-strength-text");

      const strengths = {
        0: "Muito fraca",
        1: "Fraca",
        2: "Moderada",
        3: "Forte",
        4: "Muito Forte",
      };

      let score = 0;
      if (password.length >= 8) score++;
      if (password.match(/[a-z]/)) score++;
      if (password.match(/[A-Z]/)) score++;
      if (password.match(/[0-9]/)) score++;
      if (password.match(/[^a-zA-Z0-9]/)) score++;

      const width = (score / 4) * 100;
      strengthIndicator.style.width = `${width}%`;

      switch (score) {
        case 1:
          strengthIndicator.style.backgroundColor = "#e70b0b";
          break;
        case 2:
          strengthIndicator.style.backgroundColor = "#FFF176";
          break;
        case 3:
          strengthIndicator.style.backgroundColor = "#FFB74D"; 
          break;
        case 4:
          strengthIndicator.style.backgroundColor = "#81C784";
          break;
        default:
          strengthIndicator.style.backgroundColor = "transparent";
          break;
      }

      if (password.length > 0) {
        strengthText.innerHTML = `Força: ${strengths[score]}`;
      } else {
        strengthText.innerHTML = "";
      }
    };

    passwordInput.addEventListener("input", handlePasswordStrength);

    return () => {
      passwordInput.removeEventListener("input", handlePasswordStrength);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { name, email, password, interests, type, confirmPassword };
    dispatch(register(user));
  };

  const handleInterestChange = (e) => {
    const value = e.target.value;
    setInterests((prevInterests) =>
      prevInterests.includes(value)
        ? prevInterests.filter((interest) => interest !== value)
        : [...prevInterests, value]
    );
  };

  return (
    <div id="formulario1">
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
            <input type="text" required placeholder="Nome" onChange={(e) => setName(e.target.value)} value={name || ""} />
          </label>
          <label>
            <span>Email:</span>
            <input type="email" required placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email || ""} />
          </label>
          <label>
            <span>Tipo de usuário:</span>
            <select onChange={(e) => setType(e.target.value)} value={type}>
              <option value="" disabled>Selecione...</option>
              <option value="Influenciador">Influenciador</option>
              <option value="Empresa">Empresa</option>
            </select>
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
                    onChange={handleInterestChange}
                  />
                  {interest}
                </label>
              ))}
            </div>
          </label>
          <label>
            <span>Senha:</span>
            <div className="input-container2">
              <input
                id="passwordInput"
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
            <div className="password-strength-bar">
              <div id="password-strength-indicator" className="strength-indicator"></div>
            </div>
            <p id="password-strength-text"></p>
            <p id="tip">Sua senha precisa conter letras minúsculas e maiúsculas, números e símbolo.</p>
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
            <div className="btn-container">
              {!loading && <button className="btn">Cadastrar</button>}
              {loading && <button className="btn">Aguarde...</button>}
          </div>
          </label>
          
          {error && <Message msg={error} type="error" />}
          <p className="entre">Já tem cadastro? <Link to="/login">Entre</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Register;
