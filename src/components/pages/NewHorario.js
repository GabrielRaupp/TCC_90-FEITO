import { useNavigate } from 'react-router-dom';
import HorarioForm from '../horario/HorarioForm';
import styles from './NewHorario.module.css';

function NewHorario() {
  const navigate = useNavigate();

  const createPost = async (horario) => {
    try {
      const response = await fetch('http://localhost:3000/horarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(horario),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar horário');
      }

      navigate('/horarios', { state: { message: 'Projeto criado com sucesso!' } });
    } catch (error) {
      console.error("Erro ao criar horário:", error);
    }
  };

  return (
    <div className={styles.newhorario_container}>
      <h1>Criar Horário</h1>
      <p>Crie seu horário para depois ele ser adicionado na sua agenda pessoal</p>
      <HorarioForm handleSubmit={createPost} btnText="Criar Horário" />
    </div>
  );
}

export default NewHorario;
