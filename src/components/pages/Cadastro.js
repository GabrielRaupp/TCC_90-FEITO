import React, { useState } from 'react';
import styles from './Cadastro.module.css';

const Cadastro = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState(''); // Novo campo para número de telefone

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, name, email, number }), // Incluindo número no body da requisição
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
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
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
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className={styles.campo}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className={styles.campo}> 
          <label htmlFor="number">Número de Telefone:</label>
          <input
            type="text"
            id="number"
            value={number}
            onChange={(event) => setNumber(event.target.value)}
          />
        </div>
        <button className={styles.btnSubmit} type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default Cadastro;
