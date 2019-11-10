import React, { Fragment, useEffect, useState } from 'react';
import { RouteComponentProps, Link, withRouter } from 'react-router-dom';
import md5 from 'md5';

import { ROUTES } from '../../../../routes/Routes';
import { http, getApiRouteUrl } from '../../../../utils';
import { ResponseDataType } from '../../../../types';

import styles from './LoginForm.module.pcss';

type LoginFormProps = RouteComponentProps;

const isRedirectToMain = () => {
  const token = localStorage.getItem('token') || '';
  const url = getApiRouteUrl('user/login/', [token]);
  return http<ResponseDataType>({ url }).then(
    value => value.response.data && !value.response.error
  );
};

const LoginForm = ({ history }: LoginFormProps): React.ReactElement => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    isRedirectToMain().then(val => {
      if (val) {
        history.push(ROUTES.MAIN);
      }
    });
  }, []);

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
      http<ResponseDataType>({ url }).then(value => {
        if (value.response.error) {
          setMessage('Неверный логин и(или) пароль');
        } else if (value.response.data) {
          localStorage.setItem('token', value.response.data);
          history.push(ROUTES.MAIN);
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
        {message && <p className={styles.error}>{message}</p>}
      </div>
      <Link to={ROUTES.REGISTRATION} className={styles.backToRegistrationLink}>
        Еще не зарегистрированы? Сделайте это!
      </Link>
    </Fragment>
  );
};

export default withRouter(LoginForm);
