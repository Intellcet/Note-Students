import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { ResponseDataType } from '../../../../types';
import { http, getApiRouteUrl } from '../../../../utils';
import { ROUTES } from '../../../../routes/Routes';

import styles from './Header.module.pcss';

const Header = (): React.ReactElement => {
  const [redirectToLogin, setRedirectToLogin] = useState(
    !localStorage.getItem('token')
  );

  const handleLogoutClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const url = getApiRouteUrl('user/logout/', [token]);
      http<ResponseDataType>({ url })
        .then(value => {
          if (value.response.data) {
            localStorage.removeItem('token');
          }
        })
        .finally(() => setRedirectToLogin(true));
    } else {
      setRedirectToLogin(true);
    }
  };

  return (
    <React.Fragment>
      {redirectToLogin && <Redirect from={ROUTES.MAIN} to={ROUTES.LOGIN} />}
      <header className={styles.header}>
        <h1 className={styles.title}>Note Student</h1>
        <button className={styles.logoutButton} onClick={handleLogoutClick}>
          Выйти
        </button>
      </header>
    </React.Fragment>
  );
};

export default Header;
