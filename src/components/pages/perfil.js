import React, { useEffect, useState } from 'react';
import styles from './perfil.module.css';

function Profile() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [password, setPassword] = useState('');
  const [campus, setCampus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3000/perfil'); 
      const data = await response.json();

      if (data) {
        setUsername(data.username);
        setEmail(data.email);
        setCreatedAt(data.createdAt);
        setPassword(data.password); 
        setCampus(data.campus); 

        // Armazenar no localStorage, se necessário
        localStorage.setItem('username', data.username);
        localStorage.setItem('email', data.email);
        localStorage.setItem('createdAt', data.createdAt);
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
        <p><strong>Campus:</strong> {campus}</p> {/* Exibir campus */}
      </div>
    </div>
  );
}

export default Profile;
