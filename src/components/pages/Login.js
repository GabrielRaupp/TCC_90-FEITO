import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    const storedUsername = localStorage.getItem('username');
    if (storedIsLoggedIn === 'true' && storedUsername) {
      setIsLoggedIn(true);
      setLoggedInUsername(storedUsername);
    }
  }, []);

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
      localStorage.setItem('email', data.email);       
      localStorage.setItem('createdAt', data.createdAt); 
      alert('Login bem-sucedido!');

      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUsername('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('createdAt');
    alert('Logout realizado com sucesso!');
  };

  const handlePasswordReset = () => {
    navigate('/ForgotPassword');
  };

  return (
    <div className={styles.logincontainer}>
      {isLoggedIn ? (
        <div className={styles.profilecard}>
          <div className={styles.usericon}>👤</div>
          <div className={styles.profileinfo}>
            <h3>{loggedInUsername}</h3>
            <p>Bem-vindo(a) de volta!</p>
          </div>
          <div>
            <button className={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
            <button className={styles.resetPasswordButton} onClick={handlePasswordReset}>
              Redefinir Senha
            </button>
          </div>
        </div>
      ) : (
        <div>
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
            <button type="submit" className={styles.submitButton}>
              Entrar
            </button>
          </form>
          <button className={styles.resetPasswordButton} onClick={handlePasswordReset}>
            Redefinir Senha
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
