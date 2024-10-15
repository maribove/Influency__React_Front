import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestPasswordReset, reset } from "../../slices/authSlice";
import Message from "../../components/Message";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(requestPasswordReset(email)).unwrap();
      setMessage({ type: "sucess", text: "Um e-mail com instruções para redefinir sua senha foi enviado para o endereço fornecido." });
    } catch (error) {
      setMessage({ type: "error", text: error || "Erro ao solicitar redefinição de senha. Tente novamente." });
    }
  };

  return (
    <div id="formulario">
      <h2>Esqueci Minha Senha</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <span>Digite o seu e-mail:</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              required
            />
          </label>
        </div>
        <button className='btn-enviar' type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
      {message && <Message type={message.type} msg={message.text} />}
      {error && <Message type="error" msg={error} />}
    </div>
  );
};

export default ForgotPassword;