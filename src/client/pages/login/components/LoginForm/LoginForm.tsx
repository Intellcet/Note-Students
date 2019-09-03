import React, { Fragment, useRef } from 'react';
import { Redirect } from 'react-router-dom';

import { ROUTES } from '../../../../routes/Routes';
import useLogin from '../../../../hooks/apiHooks';

import styles from './LoginForm.module.pcss';

const LoginForm = (): React.ReactElement => {
  const loginRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [setLogin, setPassword, message] = useLogin();

  const loginHandler = (): void => {
    if (loginRef.current && passwordRef.current) {
      setLogin(loginRef.current.value);
      setPassword(passwordRef.current.value);
    }
  };

  return (
    <Fragment>
      <div className={styles.inputBlock}>
        <input
          ref={loginRef}
          className={styles.input}
          type="text"
          placeholder="Введите ваш логин"
        />
        <input
          ref={passwordRef}
          className={styles.input}
          type="password"
          placeholder="Введите ваш пароль"
        />
        <button className={styles.button} onClick={loginHandler}>
          Войти
        </button>
        <p className={styles.error}>{message}</p>
      </div>
      <button className={styles.backToRegistration}>
        <a href={ROUTES.REGISTRATION} className={styles.backToRegistrationLink}>
          Еще не зарегистрированы? Сделайте это!
        </a>
      </button>
      {message === 'Logged In!' && <Redirect to={ROUTES.MAIN} />}
    </Fragment>
  );
};

export default LoginForm;
