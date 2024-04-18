// import React, { useState } from 'react';
// import axios from 'axios';

// const Esquecisenha = () => {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('/api/forgot-password', { email });
//       setMessage('Um e-mail foi enviado para redefinir sua senha.');
//     } catch (error) {
//       setMessage('Ocorreu um erro ao enviar o e-mail.');
//     }
//   };

//   return (
//     <div>
//       <h1>Esqueci a Senha</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           placeholder="Digite seu e-mail"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <button type="submit">Enviar</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default Esquecisenha;