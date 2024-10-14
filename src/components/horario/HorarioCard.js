import { Link } from 'react-router-dom';
import styles from './HorarioCard.module.css';
import { BsPencil, BsFillTrashFill } from 'react-icons/bs';

function HorarioCard({ id, name, horario, category, handleRemove }) {
  const remove = async (e) => {
    e.preventDefault();
    await handleRemove(id);  
  };

  const formatHorario = (dateString) => {
    if (!dateString) return 'Horário não disponível';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Data inválida';
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleString('pt-BR', options);
  };

  return (
    <div className={styles.project_card}>
      <h4>{name}</h4>
      <p>
        <span>Horário:</span> {formatHorario(horario)}
      </p>
      <p className={styles.category_text}>
        <span className={styles.category}>
          Categoria: {category || 'Sem categoria'}
        </span>
      </p>
      <div className={styles.project_card_actions}>
        <Link to={'/horario/' + id}>
          <BsPencil className={styles.icon} /> Editar
        </Link>
        <button onClick={remove}>
          <BsFillTrashFill className={styles.icon} /> Excluir
        </button>
      </div>
    </div>
  );
}

export default HorarioCard;
