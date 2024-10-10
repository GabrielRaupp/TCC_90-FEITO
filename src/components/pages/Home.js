import styles from './Home.module.css'
import savings from '../../img/savings.svg'

import LinkButton from '../layout/LinkButton'

function Home() {
  return (
    <section className={styles.home_container}>
      <h1>
        Bem-vindo ao <span>IntelAgend</span>
      </h1>
      <p>Crie sua conta para começar a usufruir do nosso sistema!</p>
      <LinkButton to="/Cadastro" text="Criar conta " />
      <img src={savings} alt="Savings" />
    </section>
  )
}

export default Home