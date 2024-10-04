import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate
import styles from './Login.module.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState('');
  const navigate = useNavigate(); // Inicializa o useNavigate

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Erro ao efetuar login');
      }

      const data = await response.json();
      setIsLoggedIn(true);
      setLoggedInUsername(username);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      alert('Login bem-sucedido!');
    } catch (error) {
      alert(error.message);
    }
  };

  const handlePasswordReset = () => {
    // Navega para a página de redefinição de senha
    navigate('/ForgotPassword'); // Usando navigate para redirecionar
  };

  return (
    <div className={styles.logincontainer}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Usuário:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Entrar</button>
      </form>
      <button className={styles.resetPasswordButton} onClick={handlePasswordReset}>
        Redefinir Senha
      </button>
    </div>
  );
};

export default Login;
