import md5 from 'md5';
import BaseManager, { BaseOptions } from './BaseManager';
import { User } from '../struct';

type Users = {
  [userToken: string]: User;
};

// Класс для описания методов для работы с пользователями
class UserManager extends BaseManager {
  users: Users;

  constructor(options: BaseOptions) {
    super(options);
    this.users = {};
    this.mediator.set(this.triggers.GET_ACTIVE_USERS, this.getActiveUsers);
    this.mediator.set(
      this.triggers.GET_ACTIVE_USER_BY_TOKEN,
      this.getActiveUserByToken
    );
    this.mediator.set(this.triggers.GET_USER, this.getUser);
    this.mediator.set(
      this.triggers.GET_USER_TYPE_BY_TOKEN,
      this.getUserTypeByToken
    );
    this.mediator.set(this.triggers.GET_USERS, this.getUsers);
    this.mediator.set(this.triggers.SET_USER, this.setUser);
    this.mediator.set(this.triggers.LOGIN, this.login);
    this.mediator.set(this.triggers.LOGOUT, this.logout);
    this.mediator.set(this.triggers.IS_LOGGED_IN, this.alreadyLoggedIn);
  }

  getActiveUsers = () => this.users;

  getActiveUserByToken = ({ token }: { token: string }) => this.users[token];

  getUserTypeByToken = async ({ token }: { token: string }) => {
    const user = await this.db.getUserByToken(token);
    if (user) {
      return this.db.getStudentType(user.id);
    }
    return null;
  };

  // Получить пользователя по логину. data = {login}
  getUser = ({ login }: { login: string }) => this.db.getUserByLogin(login);

  getUsers = () => this.db.getUsers();

  // Регистрация. data = {login, password, name}
  setUser = async (data: {
    login: string;
    password: string;
    name: string;
    userId?: number;
  }) => {
    const result = await this.db.addUser(data);
    if (result) {
      data.userId = result.id;
      return this.mediator.get(this.triggers.SET_USER, data);
    }
    return null;
  };

  // Вход в систему. data = {login, password, rnd}
  login = async ({
    login,
    password,
    rnd,
  }: {
    login: string;
    password: string;
    rnd: number;
  }) => {
    const user = await this.getUser({ login });
    if (user) {
      const passwordHash = md5(user.password + rnd);
      if (user && password === passwordHash) {
        const rnd = Math.floor(Math.random() * 100000);
        const token = md5(rnd + login + password);
        this.db.setToken(user.id, token);
        user.token = token;
        this.users[user.token] = new User({ ...user });
        return token;
      }
    }
    return false;
  };

  alreadyLoggedIn = async ({ token }: { token: string }) => {
    const user = await this.db.getUserByToken(token);
    if (user) {
      this.users[user.token] = new User({ ...user });
      this.mediator.call(this.events.REINIT_SOCEKT);
    }
    return !!user;
  };

  logout = async ({ token }: { token: string }) => {
    const user = await this.db.getUserByToken(token);
    if (user) {
      this.db.setToken(user.id);
      return true;
    }
    return null;
  };
}

export default UserManager;
