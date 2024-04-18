import "./NotFound.module.css";
import styles from "./NotFound.module.css";
const NotFound = () => {
  return (
    <div id='formulario'>
      <h1>Oops! Error 404</h1>
      <h2>Não há nada aqui! </h2>
      <img className={styles.erro} src="/erro-404.png" alt="ERRO" />
    </div>
  )
}

export default NotFound