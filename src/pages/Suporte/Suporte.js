import React, { useState } from 'react';
import './Suporte.css';
import { IoLogoWhatsapp } from "react-icons/io";
import { BsWhatsapp } from "react-icons/bs";

const Suporte = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        question: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('http://localhost:5000/suporte', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log('Suporte enviado:', data);
                setFormData({
                    name: '',
                    email: '',
                    question: ''
                });
            } else {
                console.error('Erro ao enviar suporte:', data);
            }
        } catch (error) {
            console.error('Erro de rede:', error);
        }
    };

    return (
        <div id='formulario'>
            <h2>Suporte</h2>
            <form onSubmit={handleSubmit} className="support-form">
                <div className="form-group">
                    <label htmlFor="name">Nome:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="question">Sua dúvida:</label>
                    <textarea
                        id="question"
                        name="question"
                        value={formData.question}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <a
                        href={`https://wa.me/5541984888651`}
                        target="_blank"
                        rel="noopener noreferrer">
                        <BsWhatsapp  className='whatsapp-icon' />
                    </a>

                </div>


                <button type="submit" className='btn'>Enviar</button>
            </form>
        </div>
    );
};

export default Suporte;
