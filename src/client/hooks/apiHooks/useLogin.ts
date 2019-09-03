import { useEffect, useState } from 'react';
import md5 from 'md5';
import axios from 'axios';

import LoginManager from '../../pages/login/modules/LoginManager';
import getApiRouteUrl from '../../utils/getApiRouteUrl';

type useLoginReturn = [
  (login: string) => void,
  (password: string) => void,
  string
];

const useLogin = (): useLoginReturn => {
  const [login, setLogin] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (login && password) {
      const rnd = Math.floor(Math.random() * 10000);
      const hash = md5(md5(login + password) + rnd);
      const url = getApiRouteUrl('user/login/', [login, hash, rnd.toString()]);
      axios(url).then(value => setMessage(LoginManager.parseAnswer(value)));
    }
  }, [login, password]);

  return [setLogin, setPassword, message];
};

export default useLogin;
