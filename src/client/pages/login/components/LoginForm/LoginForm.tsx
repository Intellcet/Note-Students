import React, { Fragment } from 'react';

import { ROUTES } from '../../../../routes/Routes';
import styles from './LoginForm.module.pcss';

const LoginForm = (): React.ReactElement => {
  return (
    <Fragment>
      <div className={styles.inputBlock}>
        <input
          className={styles.input}
          type="text"
          placeholder="Введите ваш логин"
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Введите ваш пароль"
        />
        <button className={styles.button}>Войти</button>
        <p className={styles.error} />
      </div>
      <button className={styles.backToRegistration}>
        <a href={ROUTES.REGISTRATION} className={styles.backToRegistrationLink}>
          Еще не зарегистрированы? Сделайте это!
        </a>
      </button>
    </Fragment>
  );
};

export default LoginForm;
