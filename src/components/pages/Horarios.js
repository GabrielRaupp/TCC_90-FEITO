import { useState, useEffect } from 'react';
import Container from '../layout/Container';
import Loading from '../layout/Loading';
import LinkButton from '../layout/LinkButton';
import HorarioCard from '../horario/HorarioCard';
import Message from '../layout/Message';
import styles from './Horarios.module.css';

function Horarios() {
  const [horarios, setHorarios] = useState([]);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [horarioMessage, setHorarioMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/horarios', {
          credentials: 'same-origin',
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar horários');
        }

        const data = await response.json();
        console.log('Horários recebidos:', data);

        // Ordena os horários por data/hora
        const sortedHorarios = data.sort((a, b) => new Date(a.horarios) - new Date(b.horarios));
        setHorarios(sortedHorarios);
      } catch (error) {
        console.error("Erro ao buscar horários:", error);
        setErrorMessage('Falha ao carregar os horários. Tente novamente mais tarde.');
      } finally {
        setRemoveLoading(true);
      }
    };

    fetchData();
  }, []);

  const removeHorario = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/horarios/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      });

      if (!response.ok) {
        throw new Error('Erro ao remover horário');
      }

      setHorarios((prevHorarios) => prevHorarios.filter((horario) => horario._id !== id));
      setHorarioMessage('Horário removido com sucesso!');
    } catch (error) {
      console.error("Erro ao remover horário:", error);
      setErrorMessage('Falha ao remover o horário. Tente novamente.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title_container}>
        <h1>Meus Horários</h1>
        <LinkButton to="/newhorario" text="Montar horário" customClass={styles.addHorarioButton} />
      </div>
      {horarioMessage && <Message type="success" msg={horarioMessage} />}
      {errorMessage && <Message type="error" msg={errorMessage} />}
      <Container customClass={styles.container}>
        {horarios.length > 0 ? (
          horarios.map((horario) => (
            <HorarioCard
              id={horario._id}
              name={horario.name}
              horario={horario.horarios}
              category={horario.category || 'Sem categoria'}
              key={horario._id}
              handleRemove={removeHorario}
            />
          ))
        ) : (
          !removeLoading ? <Loading /> : <p>Não há horários cadastrados!</p>
        )}
      </Container>
    </div>
  );
}

export default Horarios;
