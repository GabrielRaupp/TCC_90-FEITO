import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/forgotpassword', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
      setMessage(data.message || 'Erro ao solicitar redefinição de senha');
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      setMessage('Erro ao solicitar redefinição de senha. Tente novamente.');
    }
  };

  return (
    <div>
      <h2>Redefinir Senha</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Enviar E-mail de Redefinição de Senha</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
