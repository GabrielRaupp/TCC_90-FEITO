import React, { useEffect, useState } from 'react';

function Profile() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [createdAt, setCreatedAt] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    const storedCreatedAt = localStorage.getItem('createdAt'); 
    
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedCreatedAt) {
      setCreatedAt(storedCreatedAt);
    }
  }, []);

  return (
    <div>
      <h2>Minha Conta</h2>
      <p><strong>Usuário:</strong> {username}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Data de criação da conta:</strong> {createdAt}</p>
      <p>Bem-vindo(a) à sua conta!</p>
    </div>
  );
}

export default Profile;
