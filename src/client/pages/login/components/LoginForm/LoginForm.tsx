import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import md5 from 'md5';
import axios, { AxiosResponse } from 'axios';

import { ROUTES } from '../../../../routes/Routes';

import getApiRouteUrl from '../../../../utils/getApiRouteUrl';

import styles from './LoginForm.module.pcss';
import { LoginResponse } from './LoginForm.models';

const LoginForm = (): React.ReactElement => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLoginChange = (ev: React.SyntheticEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = ev;
    setLogin(value);
  };

  const handlePasswordChange = (ev: React.SyntheticEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = ev;
    setPassword(value);
  };

  const handleLoginButtonClick = () => {
    if (login && password) {
      const rnd = Math.floor(Math.random() * 10000);
      const hash = md5(md5(login + password) + rnd);
      const url = getApiRouteUrl('user/login/', [login, hash, rnd.toString()]);
      axios(url).then((value: AxiosResponse<LoginResponse>) => {
        if (value.data.error) {
          setMessage('Неверный логин и(или) пароль');
        } else if (value.data.data) {
          localStorage.setItem('token', value.data.data);
          setMessage('Logged In!');
        }
      });
    } else {
      setMessage('Не введены логин и(или) пароль');
    }
  };

  return (
    <Fragment>
      <div className={styles.inputBlock}>
        <input
          value={login}
          onChange={handleLoginChange}
          className={styles.input}
          type="text"
          placeholder="Введите ваш логин"
        />
        <input
          value={password}
          onChange={handlePasswordChange}
          className={styles.input}
          type="password"
          placeholder="Введите ваш пароль"
        />
        <button className={styles.button} onClick={handleLoginButtonClick}>
          Войти
        </button>
        <p className={styles.error}>{message && message}</p>
      </div>
      <button className={styles.backToRegistration}>
        <a href={ROUTES.REGISTRATION} className={styles.backToRegistrationLink}>
          Еще не зарегистрированы? Сделайте это!
        </a>
      </button>
      {(message === 'Logged In!' || localStorage.getItem('token')) && (
        <Redirect to={ROUTES.MAIN} />
      )}
    </Fragment>
  );
};

export default LoginForm;
