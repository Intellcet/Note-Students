import React from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { ROUTES } from '../../routes/Routes';
import { MainPage, LoginPage, RegistrationPage, ErrorPage } from '../../pages';

import '../../styles/common.pcss';
import './App.pcss';

const App = (): React.ReactElement => {
  return (
    <div>
      <BrowserRouter basename="/">
        <Switch>
          <Route exact={true} path={ROUTES.MAIN} component={MainPage} />
          <Route exact={true} path={ROUTES.LOGIN} component={LoginPage} />
          <Route
            exact={true}
            path={ROUTES.REGISTRATION}
            component={RegistrationPage}
          />
          <Route path="*" component={ErrorPage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default hot(App);
