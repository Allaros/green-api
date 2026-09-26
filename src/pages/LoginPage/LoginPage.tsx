import LoginForm from '../../components/LoginForm';
import styles from './LoaginPage.module.scss';

const LoginPage = () => {
   return (
      <>
         <header className={styles.header}>
            <div className={`container ` + styles.headerContainer}>
               Подключение к <span>Green Api</span>
            </div>
         </header>
         <main className={styles.main}>
            <div className={`container ` + styles.mainContainer}>
               <LoginForm></LoginForm>
            </div>
         </main>
         <footer className={styles.footer}>
            <div className={`container ` + styles.footerContainer}>
               *Данные используются для подключения к GREEN-API и хранятся в
               текущей сессии браузера.
            </div>
         </footer>
      </>
   );
};

export default LoginPage;
