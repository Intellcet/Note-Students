import React, { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { ResponseDataType } from '../../../../types';
import { http, getApiRouteUrl } from '../../../../utils';
import { ROUTES } from '../../../../routes/Routes';

import styles from './Header.module.pcss';

type HeaderProps = RouteComponentProps;

const isRedirectToMain = () => {
  const token = localStorage.getItem('token') || '';
  const url = getApiRouteUrl('user/login/', [token]);
  return http<ResponseDataType>({ url }).then(
    value => value.response.data && !value.response.error
  );
};

const Header = ({ history }: HeaderProps): React.ReactElement => {
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
        .finally(() => {
          history.push(ROUTES.LOGIN);
        });
    } else {
      history.push(ROUTES.LOGIN);
    }
  };

  useEffect(() => {
    isRedirectToMain().then(val => {
      if (!val) {
        history.push(ROUTES.LOGIN);
      }
    });
  }, []);

  return (
    <React.Fragment>
      <header className={styles.header}>
        <h1 className={styles.title}>Note Student</h1>
        <button className={styles.logoutButton} onClick={handleLogoutClick}>
          Выйти
        </button>
      </header>
    </React.Fragment>
  );
};

export default withRouter(Header);
