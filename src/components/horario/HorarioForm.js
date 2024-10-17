import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './HorarioForm.module.css'; 

const HorarioForm = ({ onSubmitSuccess, horarioData }) => {
  const [name, setName] = useState('');
  const [horarios, setHorarios] = useState(''); 
  const [category, setCategory] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (horarioData) {
      setName(horarioData.name);
      setHorarios(horarioData.horarios);
      setCategory(horarioData.category || ''); 
    }
  }, [horarioData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação dos campos
    if (!name || !horarios || !category) {
      setErrorMessage('Todos os campos são obrigatórios');
      return;
    }

    // Validação de data
    const parsedHorario = new Date(horarios);
    if (isNaN(parsedHorario)) {
      setErrorMessage('Por favor, forneça uma data/hora válida.');
      return;
    }

    try {
      let response;
      const horarioPayload = {
        name,
        horarios: parsedHorario.toISOString(), 
        category,
      };

      console.log('horarioPayload:', horarioPayload);

      if (horarioData) {
        response = await axios.put(`/horarios/${horarioData._id}`, horarioPayload, {
          withCredentials: true, 
        });
      } else {
        response = await axios.post('/horarios', horarioPayload, {
          withCredentials: true, 
        });
      }

      setName('');
      setHorarios('');
      setCategory('');
      setErrorMessage('');

      if (onSubmitSuccess) {
        onSubmitSuccess(response.data); 
      }
    } catch (error) {
      console.error('Erro ao salvar o horário:', error);
      setErrorMessage('Erro ao salvar o horário. Tente novamente.');
    }
  };

  return (
    <div className={styles.form}>
      <h2>{horarioData ? 'Editar Horário' : ''}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome"
            required
          />
        </div>
        <div>
          <label htmlFor="horarios">Horários:</label>
          <input
            type="datetime-local"
            id="horarios"
            value={horarios}
            onChange={(e) => setHorarios(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="category">Categoria:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Selecione uma categoria</option>
            <option value="Apresentação">Apresentação</option>
            <option value="Atendimento">Atendimento</option>
            <option value="Atividade">Atividade</option>
            <option value="Evento">Evento</option>
            <option value="Orientação/Co-Orientação">Orientação/Co-Orientação</option>
            <option value="Recuperação">Recuperação</option>
            <option value="Prova">Prova</option>
            <option value="Trabalho">Trabalho</option>
          </select>
        </div>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <button type="submit">{horarioData ? 'Atualizar Horário' : 'Salvar Horário'}</button>
      </form>
    </div>
  );
};

export default HorarioForm;
