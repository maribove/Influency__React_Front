import React, { useState } from 'react';
import './Suporte.css';
import Message from "../../components/Message"; // Assumindo que o componente Message já existe
import { BsWhatsapp } from 'react-icons/bs'; // Importando o ícone do WhatsApp

const Suporte = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [supportMessage, setSupportMessage] = useState('');
    const [message, setMessage] = useState(null); // Estado para exibir mensagens

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = { name, email, message: supportMessage };

        try {
            const response = await fetch('http://localhost:5000/api/suporte', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'sucess', text: 'E-mail enviado com sucesso!' });
                setName('');
                setEmail('');
                setSupportMessage('');
            } else {
                setMessage({ type: 'error', text: data.error || 'Erro ao enviar suporte. Tente novamente.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro de rede. Verifique sua conexão.' });
        }

        // Limpar a mensagem após um tempo
        setTimeout(() => {
            setMessage(null);
        }, 3000); 
    };

    return (
        <div id='formulario'>
            <h2>Suporte ao Usuário</h2>
            <p>Descreva seu problema e nossa equipe irá ajudá-lo o mais rápido possível.</p>
            <form onSubmit={handleSubmit} id='formulario'>
                <div className="form-group">
                    <label htmlFor="name">Nome:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="supportMessage">Descrição:</label>
                    <textarea
                        id="supportMessage"
                        name="supportMessage"
                        placeholder='Deixe sua dúvida ou descreva o problema que você está enfrentando.'
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        required
                    />
                    {/* Exibir mensagem de sucesso ou erro */}
                    {message && <Message type={message.type} msg={message.text} />}
                </div>

                <div>
                    <a
                        href="https://wa.me/5541984888651"
                        target="_blank"
                        rel="noopener noreferrer">
                        <BsWhatsapp className='whatsapp-icon' />
                    </a>
                </div>

                <button type="submit" className="btn-enviar">Enviar</button>
            </form>
        </div>
    );
};

export default Suporte;
