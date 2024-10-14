import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './perfil.module.css';

function Profile() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [campus, setCampus] = useState('');
  const navigate = useNavigate();

  
  
  const handlePasswordReset = () => {
    navigate('/ForgotPassword');
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3000/perfil'); 
      const data = await response.json();

      if (data) {
        setUsername(data.username);
        setEmail(data.email);

        const date = new Date(data.createdAt);
        const formattedDate = date.toLocaleString('pt-BR', { 
          timeZone: 'America/Sao_Paulo',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        setCreatedAt(formattedDate); 
        setCampus(data.campus); 

        localStorage.setItem('username', data.username);
        localStorage.setItem('email', data.email);
        localStorage.setItem('createdAt', formattedDate);
        localStorage.setItem('campus', data.campus);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.profileHeader}>Perfil do Usuário</h1>
      <div className={styles.profileInfo}>
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Data de Criação:</strong> {createdAt}</p>
        <p><strong>Campus:</strong> {campus}</p>
      </div>
      <button className={styles.resetPasswordButton} onClick={handlePasswordReset}>
            Redefinir Senha
          </button>
    </div>
  );
}

export default Profile;
