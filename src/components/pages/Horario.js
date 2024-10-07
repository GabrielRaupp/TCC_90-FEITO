import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './Horario.module.css';
import Loading from '../layout/Loading';
import Container from '../layout/Container';
import HorarioForm from '../horario/HorarioForm';
import Message from '../layout/Message';

function Horario() {
  const { id } = useParams();
  const [horario, setHorario] = useState({});
  const [showHorarioForm, setShowHorarioForm] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/horarios/${id}`);
        const data = await response.json();
        console.log('Dados do horário:', data);
        if (data) {
          setHorario(data);
        } else {
          setMessage('Horário não encontrado!');
          setType('error');
        }
      } catch (error) {
        console.error("Erro ao buscar horário:", error);
        setMessage('Erro ao buscar o horário!');
        setType('error');
      }
    };

    fetchData();
  }, [id]);

  const editPost = async (updatedHorario) => {
    try {
      console.log("Atualizando horário com:", updatedHorario);
      const response = await fetch(`http://localhost:3000/horarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedHorario),
      });

      const data = await response.json();
      console.log("Resposta da atualização:", data);

      if (response.ok) {
        setHorario(updatedHorario);
        setShowHorarioForm(false);
        setMessage('Horário atualizado com sucesso!');
        setType('success');
      } else {
        setMessage('Erro ao atualizar o horário!');
        setType('error');
      }
    } catch (error) {
      console.error("Erro ao atualizar horário:", error);
      setMessage('Erro ao atualizar o horário!');
      setType('error');
    }
  };

  const deleteHorario = async () => {
    try {
      const response = await fetch(`http://localhost:3000/horarios/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Horário excluído com sucesso!');
        setType('success');
      } else {
        setMessage('Erro ao excluir o horário!');
        setType('error');
      }
    } catch (error) {
      console.error("Erro ao excluir horário:", error);
      setMessage('Erro ao excluir o horário!');
      setType('error');
    }
  };

  return (
    <>
      {message && <Message type={type} msg={message} />}
      {horario.name ? (
        <div className={styles.horario_details}>
          <Container customClass="column">
            <div className={styles.details_container}>
              <h1>Horário: {horario.name}</h1>
              <button className={styles.btn} onClick={() => setShowHorarioForm(!showHorarioForm)}>
                {showHorarioForm ? 'Fechar' : 'Editar horário'}
              </button>
              <button className={styles.btn} onClick={deleteHorario}>
                Excluir horário
              </button>
              <div className={styles.horario_info}>
                {!showHorarioForm ? (
                  <>
                    <p>
                      <span>Categoria:</span> {horario.category || 'Sem categoria'}
                    </p>
                    <p>
                      <span>Horário:</span> {horario.horarios || 'Não disponível'}
                    </p>
                  </>
                ) : (
                  <HorarioForm
                    handleSubmit={editPost}
                    btnText="Concluir edição"
                    horarioData={horario}
                  />
                )}
              </div>
            </div>
          </Container>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Horario;
