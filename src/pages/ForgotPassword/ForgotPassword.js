import { useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import { requestPasswordReset } from "../../slices/authSlice"; // Função do slice que chama a API

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth); // Obtenha o estado do Redux


  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(requestPasswordReset(email));
  };

  return (
    <div id="formulario">
      <h2>Esqueci Minha Senha</h2>
      <form onSubmit={handleSubmit}>
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
        <button className='btn' type="submit">Enviar</button>
      </form>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
