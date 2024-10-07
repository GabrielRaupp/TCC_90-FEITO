import React, { useState } from 'react';
import styles from './Cadastro.module.css';

const Cadastro = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState(''); // Modificado para telefone

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/register', { // Corrigido para a rota '/register'
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email, telefone }), // Modificado para incluir telefone
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao cadastrar usuário');
      }

      alert('Usuário cadastrado com sucesso!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={styles.cadastro}>
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.campo}>
          <label htmlFor="username">Nome de Usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        
        <div className={styles.campo}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        
        <div className={styles.campo}>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <div className={styles.campo}> 
          <label htmlFor="telefone">Número de Telefone:</label>
          <input
            type="text"
            id="telefone" // Corrigido para id correto
            value={telefone} // Corrigido para telefone
            onChange={(event) => setTelefone(event.target.value)} // Corrigido para telefone
          />
        </div>
        <button className={styles.btnSubmit} type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default Cadastro;
