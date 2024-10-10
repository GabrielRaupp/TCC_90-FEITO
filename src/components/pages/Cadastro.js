import React, { useState } from 'react';
import styles from './Cadastro.module.css';

const Cadastro = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [campus, setCampus] = useState('');
  const [telefone, setTelefone] = useState(''); 

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/register', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email, telefone }), 
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
            id="telefone" 
            value={telefone} 
            onChange={(event) => setTelefone(event.target.value)} 
          />
        </div>
        <div className={styles.campo}>
  <form>
    <div className={styles.campo}>
      <label htmlFor="campus">Campus:</label>
        <select
          id="campus"
          value={campus}
          onChange={(e) => setCampus(e.target.value)}
          required
        >
              <option value="">Selecione um campus</option>
                <option value="IFC Campus Araquari">IFC Campus Araquari</option>
                <option value="IFC Campus Avançado Abelardo Luz">IFC Campus Avançado Abelardo Luz</option>
                <option value="IFC Campus Avançado Brusque">IFC Campus Avançado Brusque</option>
                <option value="IFC Campus Blumenau">IFC Campus Blumenau</option>
                <option value="IFC Campus Brusque">IFC Campus Brusque</option>
                <option value="IFC Campus Camboriú">IFC Campus Camboriú</option>
                <option value="IFC Campus Concórdia">IFC Campus Concórdia</option>
                <option value="IFC Campus Fraiburgo">IFC Campus Fraiburgo</option>
                <option value="IFC Campus Ibirama">IFC Campus Ibirama</option>
                <option value="IFC Campus Luzerna">IFC Campus Luzerna</option>
                <option value="IFC Campus Rio do Sul">IFC Campus Rio do Sul</option>
                <option value="IFC Campus Santa Rosa do Sul">IFC Campus Santa Rosa do Sul</option>
                <option value="IFC Campus São Bento do Sul">IFC Campus São Bento do Sul</option>
                <option value="IFC Campus São Francisco do Sul">IFC Campus São Francisco do Sul</option>
                <option value="IFC Campus Sombrio">IFC Campus Sombrio</option>
                <option value="IFC Campus Videira">IFC Campus Videira</option>
        </select>
    </div>
  </form>
</div>

        <button className={styles.btnSubmit} type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default Cadastro;
