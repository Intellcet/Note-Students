import React from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import { ROUTES } from '../../routes/Routes';
import { MainPage, LoginPage, RegistrationPage, ErrorPage } from '../../pages';

import '../../styles/common.pcss';
import './App.pcss';

// TODO:: чтобы открыть коррекутную заглушку, нужно комметировать Header, Footer, ChatWidget
const App = (): React.ReactElement => {
  const token = localStorage.getItem('token');
  return (
    <div>
      <BrowserRouter basename="/">
        <Switch>
          {!token && (
            <Redirect exact={true} from={ROUTES.MAIN} to={ROUTES.LOGIN} />
          )}
          <Route exact={true} path={ROUTES.MAIN} component={MainPage} />
          <Route path={ROUTES.LOGIN} component={LoginPage} />
          <Route path={ROUTES.REGISTRATION} component={RegistrationPage} />
          <Route path="*" component={ErrorPage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default hot(App);
