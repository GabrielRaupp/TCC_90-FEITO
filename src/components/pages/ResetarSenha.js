import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const ResetarSenha = () => {
  const { token } = useParams(); 
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
  
    if (!newPassword) {
      setMessage('A nova senha é obrigatória.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/resetarSenha/${token}`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage(data.message || 'Senha redefinida com sucesso!');
      } else {
        setMessage(data.message || 'Erro ao redefinir a senha.');
      }
    } catch (error) {
      console.error('Erro ao redefinir a senha:', error);
      setMessage('Erro ao redefinir a senha. Tente novamente.');
    }
  };
  

  return (
    <div>
      <h2>Redefinir Senha</h2>
      <form onSubmit={handleResetPassword}>
        <div>
          <label htmlFor="newPassword">Nova Senha:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Redefinir Senha</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetarSenha;
