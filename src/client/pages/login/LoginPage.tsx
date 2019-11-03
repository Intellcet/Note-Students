import React from 'react';

import LoginForm from './components/LoginForm';

import styles from './LoginPage.module.pcss';

const LoginPage = (): React.ReactElement => (
  <div className={styles.auth}>
    <h1>Войти</h1>
    <LoginForm />
  </div>
);

export default LoginPage;
