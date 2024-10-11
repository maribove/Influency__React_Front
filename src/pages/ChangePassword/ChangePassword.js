import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../slices/authSlice";
import Message from "../../components/Message";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);

  const { loading, error } = useSelector((state) => state.auth);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 6) {
      errors.push("A senha deve ter no mínimo 6 caracteres");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("A senha deve conter pelo menos uma letra maiúscula");
    }
    if (!/\d/.test(password)) {
      errors.push("A senha deve conter pelo menos um número");
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.push("A senha deve conter pelo menos um caractere especial");
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setMessage({ type: "error", text: passwordErrors.join(". ") });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "As senhas não correspondem!" });
      return;
    }

    try {
      await dispatch(resetPassword({ token, password })).unwrap();
      setMessage({ type: "success", text: "Senha alterada com sucesso!" });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage({ type: "error", text: error || "Erro ao redefinir a senha. Tente novamente." });
    }
  };

  return (
    <div id="formulario">
      <h2>Trocar Senha</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nova Senha"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirme a Nova Senha"
          required
        />
        <button className='btn-enviar' type="submit" disabled={loading}>
          {loading ? "Carregando..." : "Trocar Senha"}
        </button>
      </form>
      {message && <Message type={message.type} msg={message.text} />}
      {error && <Message type="error" msg={error} />}
    </div>
  );
};

export default ChangePassword;